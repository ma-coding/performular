import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        FormsModule,
        FlexLayoutModule,
        BrowserModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
