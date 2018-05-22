// ***********************************************************
// This file support/index.js is processed and
// loaded automatically before each test files.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// General api routes stubs
import './stubs'

// Workaround to support fetch
Cypress.on("window:before:load", win => {
  win.fetch = null;
});
