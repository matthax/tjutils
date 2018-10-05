module.exports = [
  {
    type: 'input',
    name: 'workspaceId',
    message: 'What is your workspace id?',
  },
  // {
  //   type: 'list',
  //   name: 'hasCamera',
  //   message: 'Will you be using a camera?',
  //   choices: ['Yes', 'No'],
  //   filter: val => val === 'Yes',
  // },
  {
    type: 'input',
    name: 'assistantUsername',
    message: 'What is your Watson Assistant username?',
  },
  {
    type: 'input',
    name: 'assistantPassword',
    message: 'And your Watson Assistant password?',
  },
  {
    type: 'input',
    name: 'speechToTextUsername',
    message: 'Let\'s configure speech to text. What is your Speech to Text username?',
  },
  {
    type: 'input',
    name: 'speechToTextPassword',
    message: 'And the password?',
  },
  {
    type: 'input',
    name: 'textToSpeechUsername',
    message: 'Almost done! What is your Text to Speech username?',
  },
  {
    type: 'input',
    name: 'textToSpeechPassword',
    message: 'And the password?',
  },
  {
    type: 'input',
    name: 'visualRecognitionKey',
    message: 'Last one! What is your Visual Recognition API Key?',
  },
];
