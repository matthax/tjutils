const commandLineUsage = require('command-line-usage');

const sections = [
  {
    header: 'TJUtils',
    content: 'Helpful utilities for the TJBOT',
  },
  {
    header: 'Commands',
    content: [
      '$ add -u matt -w my-workspace-id',
      '$ switch -u matt',
    ],
  },
  {
    header: 'Add',
    optionList: [
      {
        name: 'user',
        description: 'The user to add (pick a simple name!)',
      },
      {
        name: 'workspace',
        description: 'The workspace ID',
      },
    ],
  },
];

module.exports = commandLineUsage(sections);
