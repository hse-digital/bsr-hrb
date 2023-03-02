import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CompaniesService {
    constructor(private httpClient: HttpClient) { }

    async SearchCompany(company: string): Promise<CompanySearchResponseModel> {
        return await firstValueFrom(this.httpClient.get<CompanySearchResponseModel>(`api/SearchCompany/${company}`));
    }
}

export class CompanySearchResponseModel {
    Companies!: Company[];
    Results!: number;
}

export class Company {
    Name!: string;
    Number!: string;
    Status!: string;
    Type!: string;
}