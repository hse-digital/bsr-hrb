export class LocalStorage {

  private constructor() {
  }

  static getJSON(key: string) {
    if (typeof sessionStorage !== 'undefined') {
      var localStorageModel = sessionStorage.getItem(key);
      if (localStorageModel) {
        return JSON.parse(atob(localStorageModel));
      }
    }

    return undefined;
  }

  static setJSON(key: string, value: any) {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, btoa(JSON.stringify(value)));
    }
  }

  static remove(key: string) {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(key);
    }
  }
}