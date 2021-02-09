#!/usr/bin/env node
'use strict';

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
const { buildDockerImages, pushDockerImage } = require('./docker-utils');

async function main() {
  const argv = yargs(hideBin(process.argv))
      .option('latest', {
        describe:
            'Whether to tag with latest or with version from package.json',
        default: false,
        type: 'boolean'
      }).option('defaultNodeDockerVersion', {
        alias: 'default-node-docker-version',
        describe: 'Node Docker version for latest tag',
        demandOption: true,
    }).option('nodeDockerVersions', {
      alias: 'node-docker-versions',
      describe:
        'Comma-separated list of Node Docker tag versions (e.g., "12-alpine,14-alpine")',
      demandOption: true,
      coerce: (opt) => {
        return opt.split(',');
      },
    })
    .check(({ nodeDockerVersions, defaultNodeDockerVersion }) => {
      if (nodeDockerVersions.includes(defaultNodeDockerVersion)) {
        return true;
      }

      throw new Error(
        `defaultNodeDockerVersion "${defaultNodeDockerVersion}" was not in list of versions "${nodeDockerVersions}"`,
      );
    })

    .command({
      command: 'build',
      desc: 'Build Docker image(s) based on Node version(s)',
      async handler(args) {
        const artifacts = await buildDockerImages(args);

        const formattedResults = artifacts.map(
          (result) =>
            `${result.tag} (based on node:${result.nodeDockerVersion})`,
        );

        console.log(`\nBuilt tags: \n- ${formattedResults.join('\n- ')}`);
        process.exit(0);
      },
    })
    .command({
      command: 'publish',
      desc: 'Build & push Docker image(s) to Docker Hub',
      async handler(args) {
        const artifacts = await buildDockerImages(args);

        const formattedResults = artifacts.map(
          (result) =>
            `${result.tag} (based on node:${result.nodeDockerVersion})`,
        );

        console.log(`\nBuilt tags: \n- ${formattedResults.join('\n- ')}`);

        readline.setPrompt('\nDo you want to push these tags? (y/N) ');
        readline.prompt();
        readline.once('line', async (input) => {
          switch (input) {
            case 'n':
            case '':
              console.log('Aborted');
              break;
            case 'y':
              for (const artifact of artifacts) {
                await pushDockerImage(artifact);
              }
              break;
            default:
              console.error(`Invalid input: "${input}"`);
              readline.prompt();
          }

          console.log('Bye!');
          process.exit(0);
        });
      },
    })
    .demandCommand(1, 'You have to specify a command.')
    .strict(true)
    .version(false)
    .wrap(120)
    .help().argv;
}

main().catch(console.error);
