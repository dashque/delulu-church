const { Languages } = require('./src/app/core/models/languages.model.ts');
module.exports = {
  rootTranslationsPath: './public/i18n/',
  langs: Object.values(Languages),
  keysManager: {
    output: './public/i18n/',
    unflat: true,
  },
};
