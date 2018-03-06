class Storage {
  static get(keyName) {
    return window.localStorage.getItem(keyName);
  }
  static set(keyName, value) {
    window.localStorage.setItem(keyName, value);
  }
  static remove(keyName) {
    window.localStorage.removeItem(keyName);
  }
  static clear() {
    window.localStorage.clear();
  }
}

module.exports = Storage;