import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PerformulerCoreModule } from '../../../core/src/public_api';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        PerformulerCoreModule,
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
