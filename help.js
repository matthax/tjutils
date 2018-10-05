const commandLineUsage = require('command-line-usage');

const sections = [
  {
    header: 'TJUtils',
    content: 'Helpful utilities for the TJBOT',
  },
  {
    header: 'Commands',
    content: [
      '$ tj config',
      '$ tj add',
      '$ tj switch -u matt',
      '$ tj install',
    ],
  },
  {
    header: 'config',
    content: 'Build a configuration for the TJBot',
  },
  {
    header: 'switch',
    optionList: [
      {
        name: 'user',
        description: 'Switch to this users workspace',
      },
    ],
  },
  {
    header: 'add',
    content: 'Add a workspace for the given user',
  },
  {
    header: 'install',
    content: 'Install the TJBot dependencies',
  },
];

module.exports = commandLineUsage(sections);
