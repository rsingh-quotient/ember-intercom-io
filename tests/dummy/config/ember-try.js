'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: 'ember-lts-4.12',
        npm: {
          devDependencies: {
            'ember-source': '~4.12.0',
          },
        },
      },
      {
        name: 'ember-lts-5.4',
        npm: {
          devDependencies: {
            'ember-source': '~5.4.0',
          },
        },
        resolutions: {
          'ember': '~2.0.0'
        }
      }
    },
    {
      name: 'ember-2.1',
      bower: {
        dependencies: {
          'ember': '~2.1.0'
        },
        resolutions: {
          'ember': '~2.1.0'
        }
      }
    },
    {
      name: 'ember-2.2',
      bower: {
        dependencies: {
          'ember': '~2.2.0'
        },
        resolutions: {
          'ember': '~2.2.0'
        }
      }
    },
    {
      name: 'ember-2.3',
      bower: {
        dependencies: {
          'ember': '~2.3.0'
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
