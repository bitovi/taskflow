/**
 * Playwright Bootstrap - Pipes browser console logs to terminal
 * 
 * This file patches the @playwright/test module to automatically attach
 * console and error listeners to all pages during test execution.
 * 
 * Load this via NODE_OPTIONS: NODE_OPTIONS='--require ./tests/playwright-bootstrap.js'
 */

const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function (id) {
    // eslint-disable-next-line
    const module = originalRequire.apply(this, arguments);

    if (id === '@playwright/test') {
        const originalTest = module.test;

        // Extend the test.extend functionality
        const patchedTest = originalTest.extend({
            page: async ({ page }, use) => {
                // Attach console listener
                page.on('console', msg => {
                    const type = msg.type().toUpperCase();
                    const text = msg.text();
                    if(type === "LOG" && text.includes("🪲"))
                        console.log(`[Browser ${type}] ${text}`);
                });

                // Attach page error listener
                page.on('pageerror', error => {
                    console.error(`[Browser ERROR] ${error.message}`);
                    console.error(error.stack);
                });

                // eslint-disable-next-line
                await use(page);
            }
        });

        // Copy all properties from original test to patched test
        Object.keys(originalTest).forEach(key => {
            if (!(key in patchedTest)) {
                patchedTest[key] = originalTest[key];
            }
        });

        // Replace test with patched version
        module.test = patchedTest;
    }

    return module;
};