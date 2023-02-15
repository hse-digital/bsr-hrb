export class LocalStorage {

  private constructor() {
  }

  static getJSON(key: string) {
    if (typeof localStorage !== 'undefined') {
      var localStorageModel = localStorage.getItem(key);
      if (localStorageModel) {
        return JSON.parse(atob(localStorageModel));
      }
    }

    return undefined;
  }

  static setJSON(key: string, value: any) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, btoa(JSON.stringify(value)));
    }
  }

  static remove(key: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

}

