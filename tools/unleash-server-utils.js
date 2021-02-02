'use strict';

const execa = require('execa');

/**
 * Gets the installed version of unleash-server.
 *
 * @returns {Promise<string>}
 */
async function getUnleashServerVersion() {
  const { stdout: npmListOutput } = await execa.command(
    'npm list unleash-server',
  );
  const versionLine = npmListOutput.split('\n')[1];
  return versionLine.split('@')[1].trim();
}

module.exports = { getUnleashServerVersion };
