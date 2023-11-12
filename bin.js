const Controller = require('./controller');
const process = require('node:process');

const ctrl = new Controller();

function exec(args, stdout = defaultStdout) {
  args = args.map(str => str ? str.trim() : '');
  const action = args[0];

  switch (action) {
    case 'register': {
      const role = args[1];
      const username = args[2];
      const password = args[3];

      stdout(() => ctrl.register(role, username, password));
      break;
    }

    case 'login': {
      const username = args[1];
      const password = args[2];

      stdout(() => ctrl.login(username, password));
      break;
    }

    case 'add': {
      const title = args[1];
      const author = args[2];
      const amount = args[3] ?? '1';
      stdout(() => ctrl.add(title, author, parseInt(amount)));
      break;
    }

    case 'delete': {
      const title = args[1];
      const author = args[2];

      stdout(() => ctrl.delete(title, author));
      break;
    }

    case 'list': {
      stdout(() => ctrl.list());
      break;
    }

    case 'search': {
      const title = args[1];
      const author = args[2];

      stdout(() => ctrl.search(title, author));
      break;
    }

    case 'borrow': {
      const title = args[1];
      const author = args[2];

      stdout(() => ctrl.borrow(title, author));
      break;
    }

    case 'return': {
      const title = args[1];
      const author = args[2];

      stdout(() => ctrl.returnBook(title, author));
      break;
    }
  }
}

module.exports = exec;
exec(process.argv.slice(2).map(str => str.trim()), defaultStdout)


function defaultStdout(action) {
  try {
    const msg = action();
    console.log(msg);
  } catch(e) {
    console.log(e);
  }
}