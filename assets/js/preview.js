(() => {
  const page = document.querySelector('[data-ex6-page]');
  if (!page) return;

  const feature = new URLSearchParams(window.location.search).get('feature');
  if (feature === 'nexlinq' || feature === 'telemetry' || feature === 'all') {
    page.dataset.previewFeature = feature;
  }
})();
