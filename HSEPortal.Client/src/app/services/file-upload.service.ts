import { HttpClient } from "@angular/common/http";
import { TransferProgressEvent } from "@azure/core-http";
import { Injectable } from "@angular/core";
import { firstValueFrom, from, Observable, Subscriber } from "rxjs";
import { BlockBlobClient } from "@azure/storage-blob";
import { ApplicationService } from "./application.service";

@Injectable()
export class FileUploadService {

  constructor(private httpClient: HttpClient) { }

  async getSASUri(blobName: string): Promise<string> {
    return await firstValueFrom(this.httpClient.get<string>(`api/GetSASUri/${blobName}`));
  }

  async getSasUrl(fileName: string): Promise<string> {
    var response = await firstValueFrom(this.httpClient.get<any>(`api/GetSasUri/${fileName}`));
    return response.blobUri;
  }

  async scanFile(fileName: string): Promise<any> {
    return await firstValueFrom(this.httpClient.post('api/TriggerFileScan', { BlobName: fileName }));
  }


  async getFileScanResult(id: string): Promise<any> {
    return await firstValueFrom(this.httpClient.get<any>(`api/GetFileScanResult?id=${id}`));
  }

  async uploadToSharepoint(applicationId: string, fileName: string): Promise<any> {
    return await firstValueFrom(this.httpClient.post('api/UploadToSharepoint', { ApplicationId: applicationId, BlobName: fileName }));
  }

  deleteBlobItem(sasUrl: string) {
    const blockBlobClient = new BlockBlobClient(sasUrl);
    return from(blockBlobClient.deleteIfExists());
  }
}


export class BlobItem {
  filename?: string;
  progress?: number;
  uploading?: boolean;
  uploaded?: boolean;
}

export type Dictionary<T> = { [key: string]: T };
