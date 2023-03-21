import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(private titleService: Title) {
  }

  setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
  }

  getTitle(): string {
    return this.titleService.getTitle();
  }

  setTitleError(): void {
    this.titleService.setTitle(this.titleService.getTitle().startsWith("Error: ")
      ? this.titleService.getTitle()
      : `Error: ${this.titleService.getTitle()}`);
  }


}
