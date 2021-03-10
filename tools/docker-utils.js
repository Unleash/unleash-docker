'use strict';

const fs = require('fs');
const path = require('path');
const tempy = require('tempy');
const execa = require('execa');

const tempDirPath = tempy.directory();

/** @type {string} */
const dockerfileTemplate = fs.readFileSync(
  path.resolve(__dirname, '../Dockerfile'),
  'utf8',
);

const fromStatementRegExp = /FROM node:.*?(\s|\n)/g;

/**
 * Render a Dockerfile with the correct base image.
 *
 * @param nodeDockerVersion {string}
 * @returns {string} the Dockerfile content with the correct base image
 */
function renderDockerfile({ nodeDockerVersion }) {
  return dockerfileTemplate.replace(
    fromStatementRegExp,
      // We need a trailing space for the first step(s) in the multi-stage build
      // (between "FROM node:<version>" and e.g., "as builder").
      // This also adds a trailing space to the end of the final
      // FROM statement, but it doesn't make a difference.
      `FROM node:${nodeDockerVersion} `
  );
}

const unleashImageName = `unleashorg/unleash-server`;

/**
 * Renders a Dockerfile to a temporary location on disk
 * with the specified content.
 *
 * @param unleashServerVersion {string} the version of unleash-server that will be included in the image
 * @param nodeDockerVersion {string} the Node Docker image tag version to base this image on
 * @returns {Promise<{dockerfilePath: string, unleashDockerTag: string}>}
 */
async function createDockerfile({ unleashServerVersion, nodeDockerVersion , latest}) {
  let unleashDockerTagVersion;
  if (!latest) {
    unleashDockerTagVersion = `${unleashServerVersion}-node${nodeDockerVersion}`;
  } else {
    unleashDockerTagVersion = `latest-node${nodeDockerVersion}`
  }
  const unleashDockerTag = `unleashorg/unleash-server:${unleashDockerTagVersion}`;

  const dockerfilePath = path.join(
    tempDirPath,
    `Dockerfile.${unleashDockerTagVersion}`,
  );
  await fs.promises.writeFile(
    dockerfilePath,
    renderDockerfile({ nodeDockerVersion }),
  );

  return {
    unleashDockerTag,
    dockerfilePath,
  };
}

/**
 * Builds an unleash-server Docker image based on a Node docker tag version.
 *
 * @param nodeDockerVersion {string} the version of the Node docker image to base this image on
 * @param unleashServerVersion {string} the version of unleash-server that will be included
 * @param isDefaultNodeVersion {boolean} whether this version should be used for the tags `latest` and without `-nodeXY-distro`
 * @returns {Promise<{unleashDockerTags: string[]}>}
 */
async function buildDockerImage({
  nodeDockerVersion,
  unleashServerVersion,
  isDefaultNodeVersion,
  latest,
}) {
  console.log(`\nBuilding Docker image based on node:${nodeDockerVersion}`);

  const { dockerfilePath, unleashDockerTag } = await createDockerfile({
    unleashServerVersion,
    nodeDockerVersion,
    latest,
  });

  const contextDirectory = path.resolve(__dirname, '..');

  await execa(
    'docker',
    ['build', '-f', dockerfilePath, '-t', unleashDockerTag, contextDirectory],
    { stdio: 'inherit' },
  );

  const additionalUnleashDockerTags = [];

  if (isDefaultNodeVersion) {
    if (latest) {
      additionalUnleashDockerTags.push(`${unleashImageName}:latest`);
    } else {
      additionalUnleashDockerTags.push(
          `${unleashImageName}:${unleashServerVersion}`,
      );
    }
  }

  for (const tag of additionalUnleashDockerTags) {
    await execa('docker', ['tag', unleashDockerTag, tag], { stdio: 'inherit' });
  }

  const unleashDockerTags = [unleashDockerTag, ...additionalUnleashDockerTags];

  return {
    unleashDockerTags,
  };
}

/**
 * Builds unleash-server Docker images for the given Node Docker versions.
 *
 * @param nodeDockerVersions {string[]} the versions of the Node docker image to base the unleash-server images on
 * @param defaultNodeDockerVersion {string} any additional Docker tags for unleash-server
 * @returns {Promise<{tag: string, nodeDockerVersion: string}[]>}
 */
async function buildDockerImages({
  nodeDockerVersions,
  defaultNodeDockerVersion, latest
}) {
  /** @type string */
  const unleashServerVersion = require('unleash-server/package.json').version;

  /** @type {{tag: string, nodeDockerVersion: string}[]} */
  const artifacts = [];

    for (const nodeDockerVersion of nodeDockerVersions) {
      const buildResult = await buildDockerImage({
        nodeDockerVersion,
        unleashServerVersion,
        isDefaultNodeVersion: nodeDockerVersion === defaultNodeDockerVersion,
        latest
      });

      for (const tag of buildResult.unleashDockerTags) {
        artifacts.push({ tag, nodeDockerVersion });
      }
  }


  return artifacts;
}

/**
 * Pushes a Docker image to the registry.
 * @param tag the Docker image tag to push.
 * @returns {Promise<void>}
 */
async function pushDockerImage({ tag }) {
  await execa('docker', ['push', tag], { stdio: 'inherit' });
}

module.exports = {
  buildDockerImages,
  pushDockerImage,
};
