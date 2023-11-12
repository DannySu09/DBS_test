const fs= require('node:fs');
const action = require('./bin');

const commandAndExpectedOutput = [
  {
    input: ['register', 'admin', 'Alice', 'password1'],
    output: 'Admin Alice successfully registered.'
  },
  {
    input: ['register', 'user', 'Bob' ,'password2'],
    output: 'User Bob successfully registered.'
  },
  {
    input: ['login', 'Alice', 'password1'],
    output: 'Admin Alice successfully logged in.'
  },
  {
    input: ['add', "Clean Code", "Robert C. Martin", '5'],
    output: 'Book "Clean Code" by Robert C. Martin added successfully, inventory: 5.'
  },
  {
    input: ['list'],
    output: 'Book List:\nClean Code - Robert C. Martin - Inventory: 5.'
  },
  {
    input: ['login', 'Bob', 'password2'],
    output: 'User Bob successfully logged in.'
  },
  {
    input: ['search', "Clean Code", " Robert C. Martin"],
    output: 'Clean Code - Robert C. Martin - Inventory: 5.'
  },
  {
    input: ['borrow', "Clean Code", " Robert C. Martin"],
    output: 'Book "Clean Code" successfully borrowed.'
  },
  {
    input: ['login', 'Alice', 'password1'],
    output: 'Admin Alice successfully logged in.'
  },
  {
    input: ['delete', "Clean Code", " Robert C. Martin"],
    output: 'Cannot delete book "Clean Code" because it is currently borrowed.'
  },
  {
    input: ['login', 'Bob', 'password2'],
    output: 'User Bob successfully logged in.'
  },
  {
    input: ['return', "Clean Code", " Robert C. Martin"],
    output: 'Book "Clean Code" successfully returned.'
  },
  {
    input: ['login', 'Alice', 'password1'],
    output: 'Admin Alice successfully logged in.'
  },
  {
    input: ['add', "Clean Code", "Robert C. Martin", '3'],
    output: 'Book "Clean Code" inventory successfully updated, new inventory: 8.'
  }
]

for(const cmd of commandAndExpectedOutput) {
  action(cmd.input, (fn) => {
    let msg = '';

    try {
      msg = fn();
    } catch(e) {
      msg = e.message;
    }

    if (msg !== cmd.output) {
      console.log('Failed test: \ninput: ' + cmd.input.join(' ') + '\nexpected output: ' + cmd.output + '\nreceived output: ' + msg);
    }
  });
}

// clear testing db file
try {
  fs.rmSync('./db.json');
} catch(e) {}