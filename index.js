const commandLineArgs = require('command-line-args');

const inquirer = require('inquirer');
const dot = require('dot');
const fs = require('fs');

const questions = require('./questions');
const usage = require('./help');

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

const writeFile = (path, content) => (
  new Promise((resolve, reject) => {
    fs.writeFile(path, content, (error) => {
      if (error) reject(error);
      else resolve(path);
    });
  })
);

const readFile = path => (
  new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  })
);

const loadJson = name => (
  readFile(`./settings/${name}.json`).then(data => JSON.parse(data))
);
const writeJson = (name, data) => (
  writeFile(`./settings/${name}.json`, JSON.stringify(data))
);

const render = (name, data, opts) => (
  readFile(`./templates/${name}.dot`).then(template => dot.template(template.toString(), opts)(data))
);

const dotSettings = {
  ...dot.templateSettings,
  strip: false,
};

const prepareConfig = () => (
  inquirer.prompt(questions.config)
);
const promptUsers = users => (
  inquirer.prompt({
    type: 'list',
    name: 'user',
    message: 'Whose workspace would you like to use?',
    choices: Object.keys(users),
  })
);

const { command, _unknown: argv } = commandLineArgs(commands, { stopAtFirstUnknown: true });

switch (command) {
  case 'config': {
    prepareConfig().then((config) => {
      render('config', config, dotSettings).then(configFile => writeFile('config.js', configFile)).catch(e => console.error(e.message));
    }).catch(e => console.error(e));
    break;
  }
  case 'add': {
    const options = commandLineArgs(addOptions, { argv });
    writeJson('users', { [options.user]: options.workspace }).then(() => console.log('saved')).catch(e => console.error(e.message));
    break;
  }
  case 'switch': {
    loadJson('users').then((users) => {
      if (typeof argv === 'undefined' || argv === '') {
        promptUsers(users).then(({ user }) => console.log(users[user]));
      } else {
        const { user } = commandLineArgs(switchOptions, { argv });
        if (!user) {
          promptUsers(users).then(({ user: selected }) => console.log(users[selected]));
        } else {
          console.log(users[user]);
        }
      }
    });

    const options = commandLineArgs(switchOptions, { argv });
    loadJson('users').then(users => console.log(users[options.user])).catch((e) => {
      console.log(`Could not load user configurations. ${e.message}`);
    });
    break;
  }
  default: {
    console.log(usage);
    break;
  }
}
