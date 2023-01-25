import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from './services/headertitle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  
  constructor(private headerTitleService: HeaderTitleService) {}

  get headerTitle(): string | undefined {
    return this.headerTitleService.headerTitle;
  }
}
