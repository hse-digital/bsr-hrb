import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { BlockBlobClient } from "@azure/storage-blob";
import { PageComponent } from "src/app/helpers/page.component";
import { ApplicationService } from "src/app/services/application.service";
import { FileUploadService } from "src/app/services/file-upload.service";
import { ChargesOverviewComponent } from '../charges-overview/charges-overview.component';

type error = { hasError: boolean, message?: string }

@Component({
  templateUrl: './upload-documents.component.html'
})
export class UploadDocumentsComponent extends PageComponent<{ Filename: string, Uploaded: boolean }[]> {
  static route: string = 'upload-documents';
  static title: string = 'Upload documents - building assessment certificate - Register a high-rise building - GOV.UK';

  constructor(activatedRoute: ActivatedRoute, private fileUploadService: FileUploadService) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.model = this.applicationService.model.ApplicationCertificate?.Files;
    if (this.model) {
      this.fileUploads = this.model.map(item => { return { status: 'uploaded', file: new File([], item.Filename), alreadyUploaded: item.Uploaded }; })
    }
  }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): Promise<void> {
    this.processing = true;

    await Promise.all(this.fileUploads.filter(x => x.status == 'uploaded' && !x.alreadyUploaded).map(async upload => {
      await this.fileUploadService.uploadToSharepoint(this.applicationService.model.id!, upload.file.name);
    }));

    this.model?.forEach(mod => { mod.Uploaded = true; });
    this.applicationService.model.ApplicationCertificate!.Files = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    this.errorMessage = undefined;

    if (this.fileUploads.length == 0) {
      this.errorMessage = this.errors.empty.message;
    } else if (this.fileUploads.find(x => x.status == 'toolarge')) {
      this.errorMessage = this.errors.size.message;
    } else if (this.fileUploads.find(x => x.status == 'invalid')) {
      this.errorMessage = this.errors.extension.message;
    } else if (this.fileUploads.filter(x => x.status != 'uploaded' && x.status != 'invalid' && x.status != 'toolarge').length > 0) {
      this.errorMessage = 'Document upload is in progress';
    }

    return this.errorMessage == null;
  }

  override async navigateNext(): Promise<boolean | void> {
    this.processing = false;
    return this.navigationService.navigateRelative(ChargesOverviewComponent.route, this.activatedRoute);
  }

  static allowedExtensions = ['.pdf', '.jpg', '.tif', '.bmp', '.png', '.doc', '.docx', '.jpeg'];

  errorMessage?: string;
  errors = {
    empty: { hasError: false, message: `Upload the documents for ${this.buildingOrSectionName}` } as error,
    extension: { hasError: false, message: "The selected file must be PDF, JPG, TIF, BMP, PNG, DOC, DOCX OR JPEG" } as error,
    size: { hasError: false, message: "The selected file must be smaller than 3GB" } as error,
    issue: { hasError: false, message: "The selected file could not be uploaded - try again" } as error
  };

  progressMap = new Map<File, number>();
  fileUploads: { status: string, file: File, alreadyUploaded: boolean }[] = [];
  async fileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    const newFiles = Array.from(files).map((file: any) => { return { status: this.getInitialFileStatus(file), file: file, alreadyUploaded: false }; });
    this.fileUploads.push(...newFiles);

    this.model = this.fileUploads.map(upload => { return { Filename: upload.file.name, Uploaded: false }; });

    await Promise.all(this.fileUploads.filter(x => x.status != 'uploaded' && x.status != 'invalid' && x.status != 'toolarge').map(async (upload) => {
      upload.status = 'uploading';

      const fileUrl = await this.fileUploadService.getSasUrl(upload.file.name);

      const client = new BlockBlobClient(fileUrl);
      await client.uploadData(upload.file, {
        onProgress: (progress) => this.onProgress(progress, upload.file),
        blockSize: 4 * 1024 * 1024, // 4 MiB max block size
        concurrency: 2, // maximum number of parallel transfer workers
        blobHTTPHeaders: {
          blobContentType: upload.file.type
        },
      });

      upload.status = 'scanning';
      const fileScanId = await this.fileUploadService.scanFile(upload.file.name);
      const scanResultInterval = setInterval(async () => {
        var scanResult = await this.fileUploadService.getFileScanResult(fileScanId.scanId);
        if (scanResult != null) {
          clearInterval(scanResultInterval);
          upload.status = scanResult.Success == true ? 'uploaded' : 'error';
        }
      }, 3000);
    }));
  }

  onProgress(progressEvent: any, file: File) {
    var percent = Math.round(100 * progressEvent.loadedBytes / file.size);
    this.progressMap.set(file, percent);
  }

  getInitialFileStatus(file: File) {
    var status = 'ready';
    if (UploadDocumentsComponent.allowedExtensions.find(ext => file.name.toLowerCase().indexOf(ext) > -1) === void 0) {
      status = 'invalid';
    } else if (file.size > 3_221_225_472) { // 3GB
      status = 'toolarge';
    }

    return status;
  }

  getFileProgress(upload: { status: string, file: File }) {
    return `--progress: ${this.progressMap.get(upload.file)}%`;
  }

  getUploadError() {
    var failedUpload = this.fileUploads.find(x => x.status == 'invalid' || x.status == 'toolarge');
    if (!failedUpload) return 'hint-upload-file-hint';

    return `hint-upload-file-hint upload-tag-${this.fileUploads.indexOf(failedUpload)}`;
  }
}