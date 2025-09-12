const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CI ? 'https://recipe-sharing-hub-97ef44b34b8f.herokuapp.com/' : 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: true,
    retries: {
      runMode: 1,
      openMode: 0
    }
  }
})
