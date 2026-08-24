(() => {
  'use strict';

  const root = document.querySelector('[data-ex6-page]');
  if (!root) return;

  const modeButtons = [...root.querySelectorAll('[data-screen-mode]')];
  const panels = [...root.querySelectorAll('[data-screen-panel]')];
  const backgroundButtons = [...root.querySelectorAll('[data-lcd-background]')];
  const backgroundUpload = root.querySelector('[data-lcd-upload]');
  const backgroundUploadLabel = root.querySelector('[data-lcd-upload-label]');
  const backgroundUploadControl = backgroundUpload?.closest('.ex6-lcd-upload');
  const deviceScreen = root.querySelector('[data-screen]');
  const widgetTemperature = root.querySelector('[data-widget-temperature]');
  const widgetTemperatureGauge = root.querySelector('[data-widget-temperature-gauge]');
  const widgetBarTrack = root.querySelector('[data-widget-bar-track]');
  const widgetBars = [...root.querySelectorAll('[data-widget-bars] i')];
  const widgetLine = root.querySelector('[data-widget-line]');
  const screenMediaUpload = root.querySelector('[data-screen-media-upload]');
  const screenMediaLabel = root.querySelector('[data-screen-media-label]');
  const screenMediaVideo = root.querySelector('[data-screen-media-video]');
  const screenMediaImage = root.querySelector('[data-screen-media-image]');
  const screenMediaPlaceholder = root.querySelector('[data-screen-media-placeholder]');
  let activeBackgroundImage = '';
  let activeBackgroundIsUpload = false;
  let screenMediaObjectUrl = '';

  const projectScreenContent = () => {
    if (!deviceScreen) return;

    // Project the native 1600 × 720 (20:9) display canvas into the
    // photographed screen bezel.
    const width = 1600;
    const height = 720;
    if (!deviceScreen.clientWidth || !deviceScreen.clientHeight) return;

    const styles = getComputedStyle(deviceScreen);
    const readCorner = (property) => {
      const value = styles.getPropertyValue(property).trim();
      let depth = 0;
      let splitAt = -1;
      for (let index = 0; index < value.length; index += 1) {
        if (value[index] === '(') depth += 1;
        if (value[index] === ')') depth -= 1;
        if (/\s/.test(value[index]) && depth === 0) {
          splitAt = index;
          break;
        }
      }

      const marker = document.createElement('i');
      marker.style.cssText = `position:absolute;left:${value.slice(0, splitAt)};top:${value.slice(splitAt + 1)};width:0;height:0;visibility:hidden;pointer-events:none`;
      deviceScreen.appendChild(marker);
      const corner = { x: marker.offsetLeft, y: marker.offsetTop };
      marker.remove();
      return corner;
    };

    // Match the content plane to the existing four-corner screen mask without
    // changing the mask's size, position or hand-tuned corner coordinates.
    const [topLeft, topRight, bottomRight, bottomLeft] = [
      readCorner('--ex6-screen-top-left'),
      readCorner('--ex6-screen-top-right'),
      readCorner('--ex6-screen-bottom-right'),
      readCorner('--ex6-screen-bottom-left'),
    ];

    const dx1 = topRight.x - bottomRight.x;
    const dx2 = bottomLeft.x - bottomRight.x;
    const dx3 = topLeft.x - topRight.x + bottomRight.x - bottomLeft.x;
    const dy1 = topRight.y - bottomRight.y;
    const dy2 = bottomLeft.y - bottomRight.y;
    const dy3 = topLeft.y - topRight.y + bottomRight.y - bottomLeft.y;
    const denominator = dx1 * dy2 - dx2 * dy1;
    if (!denominator) return;

    const perspectiveX = (dx3 * dy2 - dx2 * dy3) / denominator;
    const perspectiveY = (dx1 * dy3 - dx3 * dy1) / denominator;
    const scaleX = topRight.x - topLeft.x + perspectiveX * topRight.x;
    const skewX = bottomLeft.x - topLeft.x + perspectiveY * bottomLeft.x;
    const skewY = topRight.y - topLeft.y + perspectiveX * topRight.y;
    const scaleY = bottomLeft.y - topLeft.y + perspectiveY * bottomLeft.y;

    deviceScreen.style.setProperty('--ex6-screen-content-transform', `matrix3d(${scaleX / width}, ${skewY / width}, 0, ${perspectiveX / width}, ${skewX / height}, ${scaleY / height}, 0, ${perspectiveY / height}, 0, 0, 1, 0, ${topLeft.x}, ${topLeft.y}, 0, 1)`);
  };

  projectScreenContent();
  if ('ResizeObserver' in window && deviceScreen) {
    new ResizeObserver(projectScreenContent).observe(deviceScreen);
  } else {
    window.addEventListener('resize', projectScreenContent);
  }

  // Lightweight live telemetry simulation for the Thermal monitor preset.
  let simulatedTemperature = 52;
  const temperatureHistory = [48, 50, 49, 52, 54, 53, 55, 51, 50, 52, 54, 56, 55, 53, 52, 54, 51, 50];
  const clampTemperature = (value) => Math.max(40, Math.min(60, value));
  const temperatureToBarHeight = (value) => `${25 + ((value - 40) / 20) * 62}%`;
  const scrollWidgetBars = (value) => {
    if (!widgetBarTrack || widgetBars.length < 2) return;
    const liveBars = [...widgetBarTrack.querySelectorAll('i')];
    const step = liveBars[1].offsetLeft - liveBars[0].offsetLeft;
    liveBars[liveBars.length - 1].style.height = temperatureToBarHeight(value);
    widgetBarTrack.style.transition = 'transform .65s ease';
    widgetBarTrack.style.transform = `translateX(-${step}px)`;
    window.setTimeout(() => {
      widgetBarTrack.style.transition = 'none';
      widgetBarTrack.appendChild(liveBars[0]);
      widgetBarTrack.style.transform = 'translateX(0)';
      void widgetBarTrack.offsetWidth;
    }, 660);
  };
  const renderWidgetTelemetry = (updateAllBars = true) => {
    if (widgetTemperature) widgetTemperature.textContent = String(simulatedTemperature);
    if (widgetTemperatureGauge) {
      const gaugeLevel = 28 + ((simulatedTemperature - 40) / 20) * 38;
      widgetTemperatureGauge.style.setProperty('--ex6-widget-level', `${gaugeLevel}%`);
      widgetTemperatureGauge.setAttribute('aria-label', `CPU temperature ${simulatedTemperature} degrees Celsius`);
    }

    if (updateAllBars) {
      widgetBars.forEach((bar, index) => {
        const historyValue = temperatureHistory[index % temperatureHistory.length];
        bar.style.height = temperatureToBarHeight(historyValue);
      });
    }

    if (widgetLine) {
      const polyline = widgetLine.querySelector('polyline');
      const dots = widgetLine.querySelector('g');
      const points = temperatureHistory.map((value, index) => {
        const x = index * (400 / (temperatureHistory.length - 1));
        const y = 220 - ((value - 40) / 20) * 175;
        return { x, y };
      });
      polyline?.setAttribute('points', points.map(({ x, y }) => `${x},${y}`).join(' '));
      if (dots) dots.innerHTML = points.map(({ x, y }) => `<circle cx="${x}" cy="${y}"/>`).join('');
      widgetLine.setAttribute('aria-label', `Live CPU temperature history, current value ${simulatedTemperature} degrees Celsius`);
    }
  };

  renderWidgetTelemetry();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(() => {
      const direction = Math.random() > .5 ? 1 : -1;
      const change = direction * (1 + Math.floor(Math.random() * 3));
      simulatedTemperature = clampTemperature(simulatedTemperature + change);
      temperatureHistory.push(simulatedTemperature);
      temperatureHistory.shift();
      scrollWidgetBars(simulatedTemperature);
      renderWidgetTelemetry(false);
    }, 2000);
  }

  const applyBackgroundToMode = (mode) => {
    panels.forEach((panel) => {
      panel.classList.remove('has-lcd-background');
      panel.classList.remove('has-uploaded-background');
      panel.style.removeProperty('background-image');
      panel.style.removeProperty('--ex6-active-background-image');
    });
    if (!activeBackgroundImage || mode === 'media') return;
    const activePanel = panels.find((panel) => panel.dataset.screenPanel === mode);
    if (!activePanel) return;
    activePanel.style.setProperty('--ex6-active-background-image', activeBackgroundImage);
    activePanel.classList.add('has-lcd-background');
    activePanel.classList.toggle('has-uploaded-background', activeBackgroundIsUpload);
  };

  const defaultBackgroundButton = root.querySelector('.ex6-lcd-background--space');
  if (defaultBackgroundButton) {
    activeBackgroundImage = getComputedStyle(defaultBackgroundButton).getPropertyValue('--ex6-lcd-background-image').trim();
    const initialMode = modeButtons.find((item) => item.classList.contains('is-active'))?.dataset.screenMode;
    if (initialMode) applyBackgroundToMode(initialMode);
  }

  const selectScreenMode = (button) => {
    if (button.disabled) return;
    const mode = button.dataset.screenMode;
    modeButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.screenPanel !== mode;
    });
    applyBackgroundToMode(mode);
  };

  modeButtons.forEach((button, index) => {
    button.addEventListener('click', () => selectScreenMode(button));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + modeButtons.length) % modeButtons.length;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % modeButtons.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = modeButtons.length - 1;
      selectScreenMode(modeButtons[nextIndex]);
      modeButtons[nextIndex].focus();
    });
  });

  backgroundButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const backgroundImage = getComputedStyle(button).getPropertyValue('--ex6-lcd-background-image').trim();
      if (!backgroundImage) return;

      backgroundButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      backgroundUploadControl?.classList.remove('is-active');

      activeBackgroundImage = backgroundImage;
      activeBackgroundIsUpload = false;
      const activeMode = modeButtons.find((item) => item.classList.contains('is-active'))?.dataset.screenMode;
      if (activeMode) applyBackgroundToMode(activeMode);
    });
  });

  backgroundUpload?.addEventListener('change', () => {
    const [file] = backgroundUpload.files;
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') return;
      const previewImage = new Image();
      previewImage.addEventListener('load', () => {
        const maxWidth = 1600;
        const maxHeight = 720;
        const scale = Math.min(1, maxWidth / previewImage.naturalWidth, maxHeight / previewImage.naturalHeight);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(previewImage.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(previewImage.naturalHeight * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          if (backgroundUploadLabel) backgroundUploadLabel.textContent = 'Image processing failed';
          return;
        }
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(previewImage, 0, 0, canvas.width, canvas.height);
        const optimizedImage = canvas.toDataURL('image/webp', .86);
        if (!optimizedImage || optimizedImage === 'data:,') {
          if (backgroundUploadLabel) backgroundUploadLabel.textContent = 'Image processing failed';
          return;
        }

        activeBackgroundImage = `url("${optimizedImage}")`;
        activeBackgroundIsUpload = true;

        backgroundButtons.forEach((item) => {
          item.classList.remove('is-active');
          item.setAttribute('aria-pressed', 'false');
        });
        backgroundUploadControl?.classList.add('is-active');
        backgroundUploadControl?.style.setProperty('--ex6-lcd-background-image', activeBackgroundImage);
        if (backgroundUploadLabel) backgroundUploadLabel.textContent = 'Uploaded image';
        if (backgroundUploadControl) backgroundUploadControl.title = file.name;

        const activeMode = modeButtons.find((item) => item.classList.contains('is-active'))?.dataset.screenMode;
        if (activeMode) applyBackgroundToMode(activeMode);
      }, { once: true });
      previewImage.addEventListener('error', () => {
        if (backgroundUploadLabel) backgroundUploadLabel.textContent = 'Unsupported image';
      }, { once: true });
      if (backgroundUploadLabel) backgroundUploadLabel.textContent = 'Processing image…';
      previewImage.src = reader.result;
    }, { once: true });
    reader.readAsDataURL(file);
  });

  const activateScreenMedia = (fileName) => {
    if (screenMediaPlaceholder) screenMediaPlaceholder.hidden = true;
    if (screenMediaLabel) screenMediaLabel.textContent = fileName;
    const mediaModeButton = modeButtons.find((item) => item.dataset.screenMode === 'media');
    if (!mediaModeButton) return;
    mediaModeButton.disabled = false;
    mediaModeButton.setAttribute('aria-disabled', 'false');
    const description = mediaModeButton.querySelector('small');
    if (description) description.textContent = 'Full-screen media';
    selectScreenMode(mediaModeButton);
  };

  const resetScreenMedia = () => {
    if (screenMediaVideo) {
      screenMediaVideo.pause();
      screenMediaVideo.removeAttribute('src');
      screenMediaVideo.load();
      screenMediaVideo.hidden = true;
    }
    if (screenMediaImage) {
      screenMediaImage.removeAttribute('src');
      screenMediaImage.hidden = true;
    }
    if (screenMediaObjectUrl) {
      URL.revokeObjectURL(screenMediaObjectUrl);
      screenMediaObjectUrl = '';
    }
  };

  screenMediaUpload?.addEventListener('change', () => {
    const [file] = screenMediaUpload.files;
    if (!file || (!file.type.startsWith('video/') && file.type !== 'image/gif')) return;
    if (screenMediaLabel) screenMediaLabel.textContent = 'Processing media…';
    resetScreenMedia();

    if (file.type === 'image/gif' && screenMediaImage) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (typeof reader.result !== 'string') return;
        screenMediaImage.src = reader.result;
        screenMediaImage.hidden = false;
        activateScreenMedia(file.name);
      }, { once: true });
      reader.addEventListener('error', () => {
        if (screenMediaLabel) screenMediaLabel.textContent = 'Media processing failed';
      }, { once: true });
      reader.readAsDataURL(file);
      return;
    }

    if (!screenMediaVideo) return;
    let triedDataUrlFallback = false;
    const removeVideoListeners = () => {
      screenMediaVideo.removeEventListener('loadeddata', showVideo);
      screenMediaVideo.removeEventListener('error', loadDataUrlFallback);
    };
    const showVideo = () => {
      removeVideoListeners();
      screenMediaVideo.hidden = false;
      activateScreenMedia(file.name);
      screenMediaVideo.play().catch(() => {
        if (screenMediaLabel) screenMediaLabel.textContent = `${file.name} — tap preview to play`;
      });
    };
    const loadDataUrlFallback = () => {
      if (triedDataUrlFallback) {
        removeVideoListeners();
        screenMediaVideo.hidden = true;
        if (screenMediaPlaceholder) {
          screenMediaPlaceholder.hidden = false;
          screenMediaPlaceholder.innerHTML = '<strong>Video unavailable</strong><span>Use an H.264 MP4 for browser compatibility</span>';
        }
        if (screenMediaLabel) screenMediaLabel.textContent = 'Unsupported video or codec';
        return;
      }
      triedDataUrlFallback = true;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (typeof reader.result !== 'string') return;
        screenMediaVideo.src = reader.result;
        screenMediaVideo.load();
      }, { once: true });
      reader.addEventListener('error', loadDataUrlFallback, { once: true });
      reader.readAsDataURL(file);
    };

    screenMediaVideo.addEventListener('loadeddata', showVideo);
    screenMediaVideo.addEventListener('error', loadDataUrlFallback);
    screenMediaObjectUrl = URL.createObjectURL(file);
    screenMediaVideo.src = screenMediaObjectUrl;
    screenMediaVideo.load();
  });

  window.addEventListener('pagehide', () => {
    if (screenMediaObjectUrl) URL.revokeObjectURL(screenMediaObjectUrl);
  }, { once: true });

})();
