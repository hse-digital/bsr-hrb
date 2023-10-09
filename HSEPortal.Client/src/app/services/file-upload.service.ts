import { HttpClient } from "@angular/common/http";
import { TransferProgressEvent } from "@azure/core-http";
import { Injectable } from "@angular/core";
import { distinctUntilChanged, firstValueFrom, from, Observable, Subscriber } from "rxjs";
import { BlockBlobClient} from "@azure/storage-blob";

@Injectable()
export class FileUploadService {

  constructor(private httpClient: HttpClient) { }
 
  async uploadFile(file: File, sasUrl: string) {
    
    const blockBlobClient = new BlockBlobClient(sasUrl);

    return new Observable<number>(observer => {
      blockBlobClient
        .uploadData(file, {
          onProgress: this.onProgress(observer),
          blockSize: 4 * 1024 * 1024, // 4 MiB max block size
          concurrency: 2, // maximum number of parallel transfer workers
          blobHTTPHeaders: {
            blobContentType: file.type
          }
        })
        .then(
          this.onUploadComplete(observer, file),
          this.onUploadError(observer)
        );
    }).pipe(distinctUntilChanged());;
  }
  private onUploadError(observer: Subscriber<number>) {
    return (error: any) => observer.error(error);
  }

  private onUploadComplete(observer: Subscriber<number>, file: File) {
    return () => {
      observer.next(file.size);
      observer.complete();
    };
  }
  private onProgress(observer: Subscriber<number>) {
    return (progress: TransferProgressEvent) =>
      observer.next(progress.loadedBytes);
  }
  async getSASUri(blobName: string): Promise<string> {
    return await firstValueFrom(this.httpClient.get<string>(`api/GetSASUri/${blobName}`)); 
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
