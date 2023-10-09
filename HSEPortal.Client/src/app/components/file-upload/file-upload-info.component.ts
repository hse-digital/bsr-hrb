import { Component,  EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'file-upload-info',
  templateUrl: './file-upload-info.component.html'
})

export class FileUploadInfoComponent {

  @Output() onClick = new EventEmitter();
  @Output() onKeyupEnter = new EventEmitter();
  @Output() modelChange = new EventEmitter(); 

  @Input() public showUploadedFiles: boolean = false;
  @Input() public showUploadingInfo: boolean = false;

  @Input() public model: any;
  @Input() public fileInfoModel: any;
  @Input() public fileUploadingInfoModel: any;

}
