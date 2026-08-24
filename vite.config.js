const fs = require('node:fs');
const path = require('node:path');
const { defineConfig } = require('vite');

const templatePath = path.resolve(__dirname, 'templates/ex6-max-ultra.php');
const nexlinqTemplatePath = path.resolve(__dirname, 'templates/sections/nexlinq.php');
const telemetryTemplatePath = path.resolve(__dirname, 'templates/sections/telemetry-simulator.php');

function wordpressTemplatePreview() {
  return {
    name: 'wordpress-template-preview',
    transformIndexHtml(html) {
      const readPartial = (partialPath) => fs
        .readFileSync(partialPath, 'utf8')
        .replace(/^<\?php[\s\S]*?\?>\s*/, '');
      const nexlinqTemplate = readPartial(nexlinqTemplatePath);
      const telemetryTemplate = readPartial(telemetryTemplatePath);
      const template = fs
        .readFileSync(templatePath, 'utf8')
        .replace("<?php require PHANTEKS_EX6_PATH . 'templates/sections/nexlinq.php'; ?>", nexlinqTemplate)
        .replace("<?php require PHANTEKS_EX6_PATH . 'templates/sections/telemetry-simulator.php'; ?>", telemetryTemplate)
        .replace(/^<\?php[\s\S]*?\?>\s*/, '');

      return html.replace('<!-- EX6_TEMPLATE -->', template);
    },
  };
}

module.exports = defineConfig({
  plugins: [wordpressTemplatePreview()],
});
