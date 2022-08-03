import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CancellationRequestFormComponent} from '../app/cancellation-request-form/cancellation-request-form.component'
import {HeaderComponent} from '../app/header/header.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TextMaskModule } from 'angular2-text-mask';
import {DatePipe} from '@angular/common';
import { NgxCaptureModule } from 'ngx-capture';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CancellationRequestFormComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    HttpClientModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgxCaptureModule,

  ],
  providers: [DatePipe],

  bootstrap: [AppComponent]
})
export class AppModule { }
