import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';
import { SectionAddressComponent } from '../address/address.component';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { BlockBlobClient } from '@azure/storage-blob';
import { TransferProgressEvent } from "@azure/core-http";

type error = { hasError: boolean, message?: string }

@Component({
  selector: 'hse-upload-completion-certificate',
  templateUrl: './upload-completion-certificate.component.html'
})
export class UploadCompletionCertificateComponent extends PageComponent<string> {
  static route: string = 'upload-completion-certificate';
  static title: string = "Upload completion certificate - Register a high-rise building - GOV.UK";

  static allowedExtensions = ['.ods','.pdf','.jpeg','.tif','.bmp','.png'];

  isOptional: boolean = true;
  certificateHasErrors: boolean = false;

  errors = {
    empty: { hasError: false, message: `Upload the completion certificate for ${this.sectionBuildingName()}` } as error,
    extension: { hasError: false, message: "The selected file must be ODS, PDF, JPG, TIF, BMP or PNG"} as error,
    size: { hasError: false, message: "The selected file must be smaller than 25mb"} as error,
    issue: { hasError: false, message: "The selected file could not be uploaded - try again"} as error
  };

  constructor(activatedRoute: ActivatedRoute, private fileUploadService: FileUploadService) {
    super(activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override onInit(applicationService: ApplicationService): void {
    let date =  new Date(Number(this.applicationService.currentSection.CompletionCertificateDate));
    let FirstOctober2023 = new Date(2023, 9, 1); // Month is October, but index is 9 -> "The month as a number between 0 and 11 (January to December)."
    this.isOptional = date < FirstOctober2023;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    
  }

  override isValid(): boolean {
    return true;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(SectionAddressComponent.route,  this.activatedRoute);
  }

  get errorMessage() {
    return `Upload the completion certificate for ${this.sectionBuildingName()}`;
  }

  progressMap = new Map<File, number>();
  fileUploads: { status: string, file: File }[] = [];
  async fileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    const newFiles = Array.from(files).map((file: any) => { return { status: this.getInitialFileStatus(file), file: file }; });
    this.fileUploads.push(...newFiles);

    await Promise.all(this.fileUploads.filter(x => x.status != 'uploaded' && x.status != 'invalid' && x.status != 'toolarge').map(async (upload) => {
      upload.status = 'uploading';

      const fileUrl = await this.fileUploadService.getSasUrl(this.applicationService.model.id!, upload.file.name);

      const client = new BlockBlobClient(fileUrl);
      await client.uploadData(upload.file, {
        onProgress: (progress) => this.onProgress(progress, upload.file),
        blockSize: 4 * 1024 * 1024, // 4 MiB max block size
        concurrency: 2, // maximum number of parallel transfer workers
        blobHTTPHeaders: {
          blobContentType: upload.file.type
        }
      });

      upload.status = 'scanning';
      const fileScanId = await this.fileUploadService.scanFile(this.applicationService.model.id!, upload.file.name);
      const scanResultInterval = setInterval(async () => {
        var scanResult = await this.fileUploadService.getFileScanResult(fileScanId.scanId);
        if (scanResult != null) {
          clearInterval(scanResultInterval);

          if (scanResult.Success == true) {
            upload.status = 'processing';

            await this.fileUploadService.uploadToSharepoint(this.applicationService.model.id!, upload.file.name)
              .then(_ => upload.status = 'uploaded')
              .catch(_ => upload.status = 'error');

          } else {
            upload.status = 'malware';
          }
        }
      }, 3000);
    }));
  }

  onProgress(progressEvent: TransferProgressEvent, file: File) {
    var percent = Math.round(100 * progressEvent.loadedBytes / file.size);
    this.progressMap.set(file, percent);
  }

  getInitialFileStatus(file: File) {
    var status = 'ready';
    if (UploadCompletionCertificateComponent.allowedExtensions.find(ext => file.name.toLowerCase().indexOf(ext) > -1) === void 0) {
      status = 'invalid';
    } else if (file.size > 26214400) { // 25mb
      status = 'toolarge';
    }

    return status;
  }

  getFileProgress(upload: { status: string, file: File }) {
    return `--progress: ${this.progressMap.get(upload.file)}%`;
  }

  getUploadError() {
    var failedUpload = this.fileUploads.find(x => x.status == 'invalid' || x.status == 'toolarge');
    if (!failedUpload) return null;

    return `hint-upload-file-hint upload-tag-${this.fileUploads.indexOf(failedUpload)}`;
  }

}
