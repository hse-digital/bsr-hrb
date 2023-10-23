import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';
import { SectionAddressComponent } from '../address/address.component';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { BlockBlobClient } from '@azure/storage-blob';
import { TransferProgressEvent } from "@azure/core-http";
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';

type error = { hasError: boolean, message?: string }

@Component({
  selector: 'hse-upload-completion-certificate',
  templateUrl: './upload-completion-certificate.component.html'
})
export class UploadCompletionCertificateComponent extends PageComponent<{ Filename: string, Uploaded: boolean }> {
  static route: string = 'upload-completion-certificate';
  static title: string = "Upload completion certificate - Register a high-rise building - GOV.UK";

  static allowedExtensions = ['.ods', '.pdf', '.jpeg', '.tif', '.bmp', '.png'];

  isOptional: boolean = true;
  certificateHasErrors: boolean = false;

  errorMessage?: string;
  errors = {
    empty: { hasError: false, message: `Upload the completion certificate for ${this.sectionBuildingName()}` } as error,
    extension: { hasError: false, message: "The selected file must be ODS, PDF, JPG, TIF, BMP or PNG" } as error,
    size: { hasError: false, message: "The selected file must be smaller than 25mb" } as error,
    issue: { hasError: false, message: "The selected file could not be uploaded - try again" } as error
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
    this.model = this.applicationService.currentSection.CompletionCertificateFile;
    if (this.model) {
      this.selectedFileUpload = { status: 'uploaded', file: new File([], this.model.Filename), alreadyUploaded: this.model.Uploaded };
    }

    this.isPageOptional(this.applicationService.currentSection.CompletionCertificateDate);
  }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue: boolean): Promise<void> {
    this.applicationService.currentSection.CompletionCertificateFile = this.model;

    if (this.selectedFileUpload && !this.model!.Uploaded && isSaveAndContinue) {
      this.model!.Uploaded = true;
      await this.fileUploadService.uploadToSharepoint(this.applicationService.model.id!, this.selectedFileUpload.file.name)
    }
  }

  override onInitChange(applicationService: ApplicationService): void | Promise<void> {
    if (!this.applicationService.currentChangedSection.SectionModel?.CompletionCertificateFile) this.onInit(this.applicationService);
    else {
      this.model = this.applicationService.currentChangedSection.SectionModel?.CompletionCertificateFile;
      this.selectedFileUpload = { status: 'uploaded', file: new File([], this.model.Filename), alreadyUploaded: this.model.Uploaded };
    }

    let completionCertificateDate = FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentChangedSection.SectionModel?.CompletionCertificateDate)
      ? this.applicationService.currentChangedSection.SectionModel?.CompletionCertificateDate
      : this.applicationService.currentSection.CompletionCertificateDate;
      
    this.isPageOptional(completionCertificateDate);
  }

  override async onChange(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentChangedSection!.SectionModel!.CompletionCertificateFile = this.model;

    if (this.selectedFileUpload && !this.model!.Uploaded) {
      this.model!.Uploaded = true;
      await this.fileUploadService.uploadToSharepoint(this.applicationService.model.id!, this.selectedFileUpload.file.name)
    }
  }

  isPageOptional(completionCertificateDate?: string) {
    let date = new Date(Number(completionCertificateDate));
    let FirstOctober2023 = new Date(2023, 9, 1); // Month is October, but index is 9 -> "The month as a number between 0 and 11 (January to December)."
    this.isOptional = date < FirstOctober2023;
  }

  override isValid(): boolean {
    this.errorMessage = undefined;

    if (!this.selectedFileUpload && !this.isOptional) {
      this.errorMessage = `Upload the completion certificate for ${this.sectionBuildingName()}`;
    } else if (this.selectedFileUpload) {
      if (this.selectedFileUpload.status == 'toolarge') {
        this.errorMessage = this.errors.size.message;
      } else if (this.selectedFileUpload.status == 'invalid') {
        this.errorMessage = this.errors.extension.message;
      }
    }
    
    return !this.errorMessage;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(SectionAddressComponent.route, this.activatedRoute);
  }

  progressMap = new Map<File, number>();
  selectedFileUpload?: { status: string, file: File, alreadyUploaded: boolean };
  async fileSelected(event: Event) {
    this.errorMessage = undefined;

    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files.item(0);

    if (file != null) {
      this.selectedFileUpload = { status: this.getInitialFileStatus(file), file: file, alreadyUploaded: false };
      if (this.selectedFileUpload.status != 'invalid' && this.selectedFileUpload.status != 'toolarge') {
        this.selectedFileUpload.status = 'uploading';
        this.model = { Filename: file.name, Uploaded: false };

        const fileUrl = await this.fileUploadService.getSasUrl(this.selectedFileUpload.file.name);

        const client = new BlockBlobClient(fileUrl);
        await client.uploadData(this.selectedFileUpload.file, {
          onProgress: (progress: any) => this.onProgress(progress, this.selectedFileUpload!.file),
          blockSize: 4 * 1024 * 1024, // 4 MiB max block size
          concurrency: 2, // maximum number of parallel transfer workers
          blobHTTPHeaders: {
            blobContentType: this.selectedFileUpload.file.type
          }
        });

        this.selectedFileUpload.status = 'scanning';
        const fileScanId = await this.fileUploadService.scanFile(this.selectedFileUpload.file.name);
        const scanResultInterval = setInterval(async () => {
          var scanResult = await this.fileUploadService.getFileScanResult(fileScanId.scanId);
          if (scanResult != null) {
            clearInterval(scanResultInterval);
            this.selectedFileUpload!.status = scanResult.Success == true ? 'uploaded' : 'error';
          }
        }, 3000);
      }
    }
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
    var failedUpload = this.selectedFileUpload?.status == 'invalid' || this.selectedFileUpload?.status == 'toolarge';
    if (!failedUpload) return null;

    return `hint-upload-file-hint upload-tag-0`;
  }

}
