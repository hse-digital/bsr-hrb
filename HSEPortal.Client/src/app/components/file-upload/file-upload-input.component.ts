import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'file-upload-input',
  templateUrl: './file-upload-input.component.html'
})

export class FileUploadInputComponent  {

  @ViewChild('inputFile')
  inputFile?: ElementRef;

  @Input() public id?: string;
  @Input() public name?: string;
  @Input() public class?: string;
  @Input() public type?: string;

  @Output() onChange = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  @Input() public label!: string;
  @Input() public labelClass?: string;
  @Input() public isPageHeading?: boolean = false;
  @Input() public labelFor?: string;

  @Input() public hint?: string;
  @Input() public hintClass?: string;

  @Input() public errorText?: string;
  @Input() public errorClass?: string;

  @Input() public showUploadingInfo: boolean = false;

  @Input() public inputClass?: string;

  @Input() public fileInfoModel: any;


}
