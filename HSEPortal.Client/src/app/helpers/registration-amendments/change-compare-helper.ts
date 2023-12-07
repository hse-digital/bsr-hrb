export class ChangeCompareHelper {

  static deepEqual(changedFrom: any, changedTo: any): boolean {

    if (!changedFrom && !changedTo) {
      return true;
    }
    
    const keys1 = Object.keys(changedFrom);
    const keys2 = Object.keys(changedTo);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      const val1 = changedFrom[key];
      const val2 = changedTo[key];

      const areObjects = this.isObject(val1) && this.isObject(val2);
      if (
        (areObjects && !this.deepEqual(val1, val2)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }

    return true;
  }

  static isObject(object: any) {
    return object != null && typeof object === 'object';
  }
}
