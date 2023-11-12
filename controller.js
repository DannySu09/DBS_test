const DB = require('./db');
const Authentication = require('./authentication');
const utils = require('./utils');

module.exports = class Controller {
  constructor() {
    this.auth = new Authentication();
    this.db = new DB();
  }

  register(role, username, password) {
    this.db.registerUser(role, username, password);
    return (`${utils.capitalizedFirstChar(role)} ${username} successfully registered.`);
  }

  login(username, password) {
    const userInfo = this.db.loginUser(username, password);
    return (`${utils.capitalizedFirstChar(userInfo.role)} ${userInfo.username} successfully logged in.`);
  }

  list() {
    const currentSession = this.auth.isLoggedIn();
    this.auth.checkActionPermission(currentSession.username, 'list');

    const bookList = this.db.listBook();
    const output = bookList.map((book) => `${book.metadata.title} - ${book.metadata.author} - Inventory: ${book.inventory}.`)

    return [
      'Book List:',
      ...output
    ].join('\n')
  }

  search(title, author) {
    const currentSession = this.auth.isLoggedIn();
    this.auth.checkActionPermission(currentSession.username, 'search');

    const book = this.db.searchBook(title, author);

    if (!book) {
      return (`Cannot find the book ${title} - ${author}.`);
    }

    return (`${title} - ${author} - Inventory: ${book.inventory}.`);
  }

  borrow(title, author) {
    const currentSession = this.auth.isLoggedIn();
    this.auth.checkActionPermission(currentSession.username, 'borrow');
    this.db.borrowBook(currentSession.username, title, author);
    return `Book "${title}" successfully borrowed.`;
  }

  returnBook(title, author) {
    const currentSession = this.auth.isLoggedIn();
    this.auth.checkActionPermission(currentSession.username, 'borrow');

    this.db.returnBook(currentSession.username, title, author);
    return (`Book "Clean Code" successfully returned.`)
  }

  add(title, author, amount) {
    const currentSession = this.auth.isLoggedIn();
    this.auth.checkActionPermission(currentSession.username, 'add');

    const book = this.db.addBook(title, author, amount);
    // the book is just added
    if (book.inventory === amount) {
      return `Book "${book.metadata.title}" by ${book.metadata.author} added successfully, inventory: ${book.inventory}.`;
    }
    return `Book "${book.metadata.title}" inventory successfully updated, new inventory: ${book.inventory}.`
  }

  delete(title, author) {
    const currentSession = this.auth.isLoggedIn();
    this.auth.checkActionPermission(currentSession.username, 'delete');

    this.db.deleteBook(title, author);
    return `Book "${title}" by ${author} deleted successfully.`
  }
}