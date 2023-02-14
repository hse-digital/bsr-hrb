export class LocalStorage {

  getJSON(key: string) {
    var localStorageModel = localStorage.getItem(key);
    if (localStorageModel) {
      return JSON.parse(atob(localStorageModel));
    }
  }

  setJSON(key: string, value: any) {
    localStorage.setItem(key, btoa(JSON.stringify(value)));
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

}
