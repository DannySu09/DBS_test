const DB = require('./db');

module.exports = class Authentication {
  constructor() {
    this.db = new DB();
  }

  isLoggedIn() {
    const session = this.db.getSessions();
    const isLoggedIn = Boolean(session.username) && session?.expiredTime > Date.now();

    if (!isLoggedIn) {
      throw new Error('Please login first');
    }

    return session;
  }

  checkActionPermission(username, action) {
    const user = this.db.getUser(username);

    // an admin role can perform all kinds of action
    if (user.role === 'admin') {
      return;
    }

    if (['delete', 'add'].includes(action)) {
      throw new Error('The user role can only perform "borrow", "return", "search", "list" actions');
    }

    return;
  }
}
