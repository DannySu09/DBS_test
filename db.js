const { argv } = require('node:process');
const fs = require('node:fs');

// basic structure of the db
const db = {
  books: [],
  users: [],
  session: {}
}

module.exports = class DB {
  constructor() {
    if (fs.existsSync('./db.json')) {
      return;
    }

    fs.writeFileSync('./db.json', JSON.stringify(db));
  }

  _connectDb() {
    const db = JSON.parse(fs.readFileSync('./db.json', { encoding: 'utf-8' }));
    function applyChangesToDb() {
      fs.writeFileSync('./db.json', JSON.stringify(db, undefined, 4), { encoding: 'utf-8' });
    }

    return {
      db,
      applyChangesToDb
    };
  }

  borrowBook(userId, title, author) {
    const { db, applyChangesToDb } = this._connectDb();
    const book = db.books.find(book => book.metadata.title === title && book.metadata.author === author);

    if (book.borrowers.includes(userId)) {
      throw new Error('The user already borrowed the book');
    }

    book.inventory -= 1;
    book.borrowers.push(userId);

    applyChangesToDb();
    return book.metadata;
  }

  returnBook(username, title, author) {
    const { db, applyChangesToDb } = this._connectDb();
    const book = db.books.find(book => book.metadata.title === title && book.metadata.author === author);

    if (!book) {
      throw new Error(`Cannot find the book ${title} ${author}`);
    }

    const targetBorrowerIdIdx = book.borrowers.findIndex((id) => id === username);
    if (targetBorrowerIdIdx === -1) {
      throw new Error('The book is not borrowed by the user');
    }

    // remove user id from the borrower list
    book.borrowers.splice(targetBorrowerIdIdx, 1);
    book.inventory += 1;
    applyChangesToDb();

    return book.metadata;
  }

  addBook(title, author, amount) {
    const { db, applyChangesToDb } = this._connectDb();
    let existedBook = db.books.find((book) => {
      return book.metadata.title === title && book.metadata.author === author;
    });

    if (!existedBook) {
      const newBook = {
        id: bookIdGenerator(title, author),
        metadata: {
          title,
          author
        },
        borrowers: [],
        inventory: amount
      };

      db.books.push(newBook);
      applyChangesToDb();
      return newBook;
    }

    existedBook.inventory += amount;
    applyChangesToDb();

    return existedBook;
  }

  deleteBook(title, author) {
    const { db, applyChangesToDb } = this._connectDb();
    const existedBookIdx = db.books.findIndex((book) => {
      return book.metadata.title === title && book.metadata.author === author;
    });

    if (existedBookIdx === -1) {
      throw new Error('Cannot delete an book that doesn\'t exist');
    }

    const existedBook = db.books[existedBookIdx];
    if (existedBook.borrowers.length > 0) {
      throw new Error(`Cannot delete book "${existedBook.metadata.title}" because it is currently borrowed.`);
    }

    // delete book from database;
    db.books.splice(existedBookIdx, 1);
    applyChangesToDb();
  }

  listBook() {
    const { db } = this._connectDb();
    return db.books;
  }

  searchBook(title, author) {
    const { db } = this._connectDb();
    return db.books.find((book) => {
      return book.metadata.title === title && book.metadata.author === author;
    });
  }

  registerUser(role, username, password) {
    const { db, applyChangesToDb } = this._connectDb();
    const existedUser = db.users.find(user => user.username === username);

    if (existedUser) {
      throw new Error(`An user with the name ${username} has already existed.`);
    }

    db.users.push({
      role,
      username,
      password // storing the password directly will have security issues, for simplify let's just do this for now
    });

    applyChangesToDb();
  }

  // In a more robust way, login session should be maintained separately using DBs like Redis,
  // but for simplify, let's just use the DB which also stores the data of books and users.
  loginUser(username, password) {
    const { db, applyChangesToDb } = this._connectDb();
    const existedUser = db.users.find(user => user.username === username);

    if (!existedUser || existedUser?.password !== password) {
      throw new Error('The username or password is incorrect');
    }

    // already logged in
    if (db.session.username === username && db.session.expiredTime > Date.now()) {
      return;
    }

    // overwrite the session info to make sure only one user at a time can login
    db.session = {
      username,
      expiredTime: Date.now() + 1000 * 60 * 60 // the milliseconds for 1 hour, maybe the value should be assigned to a constant variable, for simplify, let's write it here for now
    }

    applyChangesToDb();

    return existedUser;
  }

  getSessions() {
    const { db } = this._connectDb();
    return db.session;
  }

  getUser(username) {
    const { db } = this._connectDb();
    return db.users.find(user => user.username === username);
  }
}

function bookIdGenerator(title, author) {
  return `${title}+${author}`;
}
