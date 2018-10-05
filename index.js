#! /usr/bin/env node
const commandLineArgs = require('command-line-args');

const inquirer = require('inquirer');
const dot = require('dot');

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const filepath = require('path');

const questions = require('./questions');
const usage = require('./help');

const tjDir = filepath.join(os.homedir(), 'Desktop', 'tjbot', 'recipes', 'conversation');
const configDest = filepath.join(tjDir, 'config.js');

const settings = filepath.join(__dirname, 'settings');
const templates = filepath.join(__dirname, 'templates');

const commands = [
  { name: 'command', defaultOption: true },
];

// const addOptions = [
//   { name: 'workspace', alias: 'w', type: String },
//   { name: 'user', alias: 'u', type: String },
// ];

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
  readFile(filepath.join(settings, `${name}.json`)).then(data => JSON.parse(data))
);
const writeJson = (name, data) => (
  writeFile(filepath.join(settings, `${name}.json`), JSON.stringify(data))
);

const render = (name, data, opts) => (
  readFile(filepath.join(templates, `${name}.dot`)).then(template => dot.template(template.toString(), opts)(data))
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
const confirm = (message = 'Would you like to continue?') => inquirer.prompt({
  type: 'list',
  name: 'confirmed',
  message,
  choices: ['Yes', 'No'],
  filter: val => val === 'Yes',
});

const saveWorkspaces = data => (
  writeJson('workspaces', data)
);

const saveConfig = config => render('config', config, dotSettings)
  .then(configFile => writeFile(configDest, configFile)
    .then(dest => console.log(`Saved your configuration to ${dest}\n`))
    .catch(e => console.error('We couldn\'t save your configuration\n', e.message)))
  .catch(e => console.error('We had some trouble generating your configuration file\n', e.message));


const loadWorkspaces = () => loadJson('workspaces');

const handleConfig = (overwrite = true) => (
  prepareConfig().then((config) => {
    const saveWorkspace = data => (
      saveWorkspaces(data).then((path) => {
        console.log(`Saved your workspace to ${path}`);
        if (overwrite) saveConfig(config);
        return data;
      }).catch((error) => {
        console.warn('We couldn\'t save your workspace');
        console.warn(`\t${error.message}`);
        confirm('Should we still try to create your configuration?').then(({ confirmed }) => {
          if (confirmed) {
            saveConfig(config);
          } else {
            console.log('Could not save configuration, operation cancelled by user');
          }
          return data;
        }).catch(e => console.error(e.message));
      })
    );
    console.log('Opening workspaces');
    return loadWorkspaces().then((workspaces) => {
      const updated = { ...workspaces, [config.user]: config };
      console.log('Updating your workspace');
      return saveWorkspace(updated);
    }).catch(() => {
      const ws = { [config.user]: config };
      return saveWorkspace(ws);
    });
  }).catch(e => console.error(e))
);

const handleWorkspaces = () => (
  new Promise((resolve, reject) => {
    loadWorkspaces().then(resolve).catch((error) => {
      console.warn('We couldn\'t find any workspaces');
      console.warn(`\t${error.message}`);
      confirm('Should we try to create one?').then(({ confirmed }) => {
        if (confirmed) {
          handleConfig().then(resolve);
        } else {
          reject(new Error('Could not load workspaces, operation cancelled by user'));
        }
      });
    });
  })
);
/**
 * Writes a new configuration file using the provided user's workspace
 * @param {String} user The workspace to switch to
 * @param {Object} users The available workspaces
 */
const switchWorkplace = (user, users) => {
  if (typeof users[user] === 'undefined') {
    confirm(`We couldn't find ${user}. Would you like to create a new workspace for them?`).then(({ confirmed }) => {
      if (confirmed) handleConfig();
      else console.log('Could not switch to workspace, user cancelled the operation');
    });
  } else {
    console.log(`Switching to ${user}'s workspace`);
    saveConfig(users[user]);
  }
};

const { command, _unknown: argv } = commandLineArgs(commands, { stopAtFirstUnknown: true });

switch (command) {
  case 'config': {
    handleConfig();
    break;
  }
  case 'add': {
    handleConfig(false);
    break;
  }
  case 'switch': {
    handleWorkspaces().then((users) => {
      if (typeof argv === 'undefined' || argv === '') {
        promptUsers(users).then(({ user }) => switchWorkplace(user, users));
      } else {
        const { user } = commandLineArgs(switchOptions, { argv });
        if (!user) {
          promptUsers(users).then(({ user: selected }) => switchWorkplace(selected, users));
        } else {
          switchWorkplace(user, users);
        }
      }
    }).catch(error => console.error(error.message));
    break;
  }
  case 'install': {
    console.log('Installing');
    const child = spawn('npm', ['install'], { cwd: tjDir });
    const interval = setInterval(() => {
      process.stdout.write('.');
    }, 300);
    child.stdout.on('data', chunk => console.log(`\n${chunk}`));
    child.stderr.on('data', chunk => console.error(`\n${chunk.toString()}`));
    child.on('close', (code) => {
      clearInterval(interval);
      if (code === 0) console.log('You are ready to go!');
      else console.error('Something isn\'t quite right...');
    });
    break;
  }
  default: {
    console.log(usage);
    break;
  }
}
