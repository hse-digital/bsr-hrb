import { AccountablePersonModel } from "../services/application.service";

export class CloneHelper {
    public static DeepCopy(obj: any): any {
        let copy: any;
    
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;
        
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = CloneHelper.DeepCopy(obj[i]);
            }
            return copy;
        }
    
        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = CloneHelper.DeepCopy(obj[attr]);
            }
            return copy;
        }
    }
}