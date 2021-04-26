export default class LocalStorage {
  static saveStore(store) {
    window?.localStorage &&
      Object.entries(store).forEach(([key, value]) =>
        window.localStorage.setItem(key, JSON.stringify(value))
      );
  }

  static getStore(key) {
    return window?.localStorage && JSON.parse(window.localStorage.getItem(key));
  }
}
