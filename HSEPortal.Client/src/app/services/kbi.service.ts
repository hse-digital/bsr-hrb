import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KbiService {

  model: KbiModel;

  constructor() {
    this.model = new KbiModel();
  }
}

export class KbiModel {
  roofMaterial?: string;
  roofInsulation?: string;
  roofType?: string;
  totalNumberStaircases?: number;
  internalStaircasesAllFloors?: number;
}
