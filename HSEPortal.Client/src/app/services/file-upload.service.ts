import { HttpClient } from "@angular/common/http";
import { TransferProgressEvent } from "@azure/core-http";
import { Injectable } from "@angular/core";
import { distinctUntilChanged, firstValueFrom, from, Observable, Subscriber } from "rxjs";
import { BlockBlobClient} from "@azure/storage-blob";
import { ApplicationService } from "./application.service";

@Injectable()
export class FileUploadService {

  constructor(private httpClient: HttpClient, private applicationService: ApplicationService) { }
 
  async getSASUri(blobName: string): Promise<string> {
    return await firstValueFrom(this.httpClient.get<string>(`api/GetSASUri/${blobName}`)); 
  }

  async getSasUrl(taskId: string, fileName: string): Promise<string> {
    var response = await fetch(`api/GetSasUri/${fileName}`).then(resp => resp.json());
    return response.blobUri;
  }

  async scanFile(buildingControlApplicationId: string, fileName: string): Promise<any> {
    return await fetch('api/TriggerFileScan', {
      method: 'POST',
      body: {
        BuildingControlApplicationId: buildingControlApplicationId,
        BlobName: fileName
      } as any
    }).then(e => e.json());
  }


  async getFileScanResult(id: string): Promise<any> {
    return await fetch(`api/GetFileScanResult?id=${id}`).then(resp => resp.json());
  }

  async uploadToSharepoint(buildingControlApplicationId: string, fileName: string): Promise<any> {
    return await fetch('api/UploadToSharepoint', {
      method: 'POST',
      body: {
        BuildingControlApplicationId: buildingControlApplicationId,
        BlobName: fileName
      } as any
    }).then(e => e.status);
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
