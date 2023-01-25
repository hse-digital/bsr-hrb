import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HseAngularModule } from 'hse-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HseAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
