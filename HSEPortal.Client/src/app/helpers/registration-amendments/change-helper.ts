import { AddressModel } from "src/app/services/address.service";
import { FieldValidations } from "../validators/fieldvalidations";

export class ChangeHelper {
    getFieldChange(field: any, changedfield: any, fieldName: string, title: string, route: string, sectionName: string, sectionIndex: number): ChangedAnswersModel | undefined {
        return this.hasChanged(field, changedfield) ? {
            Title: title,
            Field: fieldName,
            NewValue: changedfield,
            OldValue: field,
            Route: route,
            SectionName: sectionName,
            SectionIndex: sectionIndex,
            IsAddress: false
        } : undefined;
    }

    getAddressChanges(originalAddresses: AddressModel[], newAddresses: AddressModel[], fieldName: string, title: string, route: string, sectionName: string, sectionIndex: number): ChangedAnswersModel | undefined {
        if (!originalAddresses || originalAddresses.length == 0 || originalAddresses.every(x => x == null || x == undefined)) return undefined;
        if (!newAddresses || newAddresses.length == 0 || newAddresses.every(x => x == null || x == undefined)) return undefined;

        let hasAddressesChanged = originalAddresses.length != newAddresses.length;
        if (!hasAddressesChanged) hasAddressesChanged = this.hasAddressChanged(originalAddresses, newAddresses);

        return hasAddressesChanged ? {
            Title: title,
            Field: fieldName,
            NewAddresses: newAddresses,
            OldAddresses: originalAddresses,
            Route: route,
            SectionName: sectionName,
            SectionIndex: sectionIndex,
            IsAddress: true
        } : undefined;
    }

    getLatestValueOf(field?: any, changedField?: any) {
        let hasChanged = this.hasChanged(field, changedField);
        return hasChanged ? changedField : field;
    }

    hasChanged(field?: any, changedField?: any) {
        let hasNewValue = typeof changedField == "string" ? FieldValidations.IsNotNullOrWhitespace(changedField) : changedField != undefined;
        let areEqual = field instanceof Array ? this.areArraysEqual(field, changedField) : field == changedField;
        return hasNewValue && !areEqual;
    }

    private areArraysEqual(field?: any[], changedField?: any[]) {
        if (!field || !changedField) return false;
        const changedFieldSorted = changedField.slice().sort();
        return field.length === changedField.length && field.slice().sort().every((value, index) => value === changedFieldSorted[index]);
    }

    hasAddressChanged(CurrentAddresses: AddressModel[], OriginalAddresses: AddressModel[]) { 
        return CurrentAddresses.map(address => address.Postcode).some(current => {
            return OriginalAddresses.map(original => original.Postcode).findIndex(original => original == current) == -1;
        });
    }
}

export type ChangedAnswersModel = {
    SectionName?: string,
    SectionIndex?: number,
    OldValue?: any,
    NewValue?: any,
    Title?: string,
    Field?: string,
    Route?: string,
    IsAddress?: boolean,
    OldAddresses?: AddressModel[],
    NewAddresses?: AddressModel[]
}