<?php
defined('ABSPATH') || exit;
?>

<section class="ex6-section ex6-nexlinq" id="ex6-nexlinq" aria-labelledby="nexlinq-title">
    <div class="ex6-nexlinq__app">
        <header class="ex6-nexlinq__intro">
            <p class="ex6-eyebrow">Nexlinq + integrated display</p>
            <h2 id="nexlinq-title">Design the dashboard.<br>See it live.</h2>
            <p>Choose a preset in the Nexlinq prototype and watch the built-in 10-inch IPS display update directly inside the EX6.</p>
        </header>

        <div class="ex6-app-window">
            <div class="ex6-app-topbar"><span class="ex6-app-logo" role="img" aria-label="Phanteks NexLinq"></span></div>
            <div class="ex6-app-layout">
                <div class="ex6-app-workspace">
                    <nav class="ex6-control-tabs" aria-label="Nexlinq controls">
                        <button type="button">Fan control</button>
                        <button type="button">Lighting control</button>
                        <button class="is-active" type="button">Screen control</button>
                    </nav>
                    <div class="ex6-app-content">
                        <div class="ex6-app-heading"><div><small>Integrated display</small><h3>Screen presets</h3></div><span>10” IPS · 1600 × 720</span></div>
                        <div class="ex6-preset-grid" role="tablist" aria-label="Nexlinq display presets">
                            <button class="is-active" id="ex6-tab-thermal" type="button" role="tab" aria-selected="true" aria-controls="ex6-panel-thermal" data-screen-mode="thermal"><span>Thermal monitor</span><small>Live telemetry</small></button>
                            <button id="ex6-tab-specs" type="button" role="tab" aria-selected="false" aria-controls="ex6-panel-specs" aria-disabled="true" tabindex="-1" data-screen-mode="specs" disabled><span>System specs</span><small>Clocks and metrics</small></button>
                            <button id="ex6-tab-media" type="button" role="tab" aria-selected="false" aria-controls="ex6-panel-media" aria-disabled="true" tabindex="-1" data-screen-mode="media" disabled><span>Video/GIF</span><small>Upload media to enable</small></button>
                            <button id="ex6-tab-desktop" type="button" role="tab" aria-selected="false" aria-controls="ex6-panel-desktop" aria-disabled="true" tabindex="-1" data-screen-mode="desktop" disabled><span>Secondary screen</span><small>Windows desktop</small></button>
                        </div>
                        <label class="ex6-media-upload">
                            <input type="file" accept="video/*,image/gif" data-screen-media-upload>
                            <strong>Upload Video/GIF</strong>
                            <small data-screen-media-label>Select a video or animated GIF</small>
                        </label>
                        <div class="ex6-lcd-backgrounds">
                            <div><strong>Default backgrounds</strong><small>Select an LCD wallpaper</small></div>
                            <div class="ex6-lcd-background-grid" role="group" aria-label="Default LCD backgrounds">
                                <button class="ex6-lcd-background ex6-lcd-background--phanteks" type="button" aria-pressed="false" data-lcd-background><i aria-hidden="true"></i><span>Phanteks</span></button>
                                <button class="ex6-lcd-background ex6-lcd-background--nature" type="button" aria-pressed="false" data-lcd-background><i aria-hidden="true"></i><span>Nature</span></button>
                                <button class="ex6-lcd-background ex6-lcd-background--space is-active" type="button" aria-pressed="true" data-lcd-background><i aria-hidden="true"></i><span>Space</span></button>
                                <button class="ex6-lcd-background ex6-lcd-background--texture" type="button" aria-pressed="false" data-lcd-background><i aria-hidden="true"></i><span>Black texture</span></button>
                                <label class="ex6-lcd-upload">
                                    <input type="file" accept="image/*" data-lcd-upload>
                                    <i aria-hidden="true"><b>+</b></i>
                                    <span data-lcd-upload-label>Upload image</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="ex6-device-stage" role="group" aria-label="EX6 Max Ultra chassis with an interactive built-in display">
        <div class="ex6-device-render" aria-hidden="true"></div>
        <div class="ex6-device-screen" data-screen aria-label="Built-in display preview, 1600 by 720 resolution" aria-live="polite">
            <div class="ex6-screen-panel" id="ex6-panel-thermal" role="tabpanel" aria-labelledby="ex6-tab-thermal" data-screen-panel="thermal">
                <div class="ex6-widget-safe-area"><div class="ex6-widget-grid" aria-label="System data widgets">
                    <article class="ex6-data-widget">
                        <div class="ex6-widget-gauge ex6-widget-gauge--temperature" data-widget-temperature-gauge><strong><b data-widget-temperature>52</b><small>°C</small></strong></div>
                        <h4>CPU</h4><p>AMD RYZEN 9 9950X3D</p>
                    </article>
                    <article class="ex6-data-widget">
                        <div class="ex6-widget-gauge ex6-widget-gauge--fan"><strong>1800</strong></div>
                        <h4>FAN</h4><p>REAR EXHAUST</p>
                    </article>
                    <article class="ex6-data-widget ex6-data-widget--chart">
                        <div class="ex6-widget-bars" data-widget-bars aria-hidden="true"><div class="ex6-widget-bar-track" data-widget-bar-track><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
                        <h4>CPU</h4>
                    </article>
                    <article class="ex6-data-widget ex6-data-widget--chart">
                        <svg class="ex6-widget-line" data-widget-line viewBox="0 0 400 250" preserveAspectRatio="none" role="img" aria-label="Live CPU temperature history"><polyline/><g></g></svg>
                        <h4>CPU</h4>
                    </article>
                </div></div>
            </div>
            <div class="ex6-screen-panel" id="ex6-panel-specs" role="tabpanel" aria-labelledby="ex6-tab-specs" data-screen-panel="specs" hidden>
                <div class="ex6-screen-top"><span>SYSTEM SPECS</span><span>LIVE</span></div>
                <dl class="ex6-spec-list"><div><dt>CPU clock</dt><dd>5.40 GHz</dd></div><div><dt>GPU clock</dt><dd>2,505 MHz</dd></div><div><dt>Memory</dt><dd>64 GB</dd></div><div><dt>Fan speed</dt><dd>1,280 RPM</dd></div></dl>
            </div>
            <div class="ex6-screen-panel ex6-media-panel" id="ex6-panel-media" role="tabpanel" aria-labelledby="ex6-tab-media" data-screen-panel="media" hidden>
                <video data-screen-media-video muted loop playsinline autoplay preload="auto" hidden></video>
                <img data-screen-media-image alt="User-uploaded screen media" hidden>
                <div class="ex6-media-placeholder" data-screen-media-placeholder><strong>Upload Video/GIF</strong><span>Select media in NexLinq</span></div>
            </div>
            <div class="ex6-screen-panel ex6-desktop-panel" id="ex6-panel-desktop" role="tabpanel" aria-labelledby="ex6-tab-desktop" data-screen-panel="desktop" hidden>
                <div class="ex6-desktop-wallpaper"><strong>Secondary display</strong><span>Windows desktop</span></div>
                <div class="ex6-taskbar"><i></i><i></i><i></i><i></i></div>
            </div>
        </div>
        <span class="ex6-device-label">LIVE 10” DISPLAY PREVIEW</span>
    </div>
</section>
