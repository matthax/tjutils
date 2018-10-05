const fs = require('fs');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const sections = [
    {
        header: 'TJUtils',
        content: 'Helpful utilities for the {TJBOT}.'
    },
    {
        header: 'Commands',
        content: [
            '$ add -u matt -w my-workspace-id',
            '$ switch -u matt'
        ],
    },
    {
        header: 'Add',
        optionList: [
        {
            name: 'user',
            typeLabel: '{name}',
            description: 'The user to add (pick a simple name!)'
        },
        {
            name: 'workspace',
            description: 'The workspace ID',
        },
        ],
    },
];
const usage = commandLineUsage(sections);
console.log(usage);

const commands = [
    { name: 'command', defaultOption: true },
];

const addOptions = [
    { name: 'workspace', alias: 'w', type: String },
    { name: 'user', alias: 'u', type: String },
];

const switchOptions = [
    { name: 'user', alias: 'u', type: String },
];

const loadJson = name => (
    new Promise((resolve, reject) => {
        fs.readFile(`./settings/${name}.json`, (error, data) => {
            if (error) reject(error);
            try {
                const settings = JSON.parse(data);
                resolve(settings);
            } catch (e) {
                reject(e);
            }
        });
    })
);
const writeJson = (name, data) => (
    new Promise((resolve, reject) => {
        fs.writeFile(`./settings/${name}.json`, JSON.stringify(data), error => {
            if (error) reject(error);
            else resolve(`./settings/${name}.json`);
        })
    })
);

const { command, _unknown: argv } = commandLineArgs(commands, { stopAtFirstUnknown: true });
switch (command) {
    case 'add': {
        const options = commandLineArgs(addOptions, { argv });
        writeJson('users', { [options.user]: options.workspace }).then(() => console.log('saved')).catch(e => console.error(e.message));
        break;
    }
    case 'switch': {
        const options = commandLineArgs(switchOptions, { argv });
        loadJson('users').then(users => console.log(users[options.user])).catch((e) => {
            console.log(`Could not load user configurations. ${e.message}`);
        });
    }
    default: {
        console.log(command);
        break;
    }
}