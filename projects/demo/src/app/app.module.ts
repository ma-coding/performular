import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { PerformulerCoreModule } from '../../../core/src/lib/module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        FormsModule,
        FlexLayoutModule,
        BrowserModule,
        PerformulerCoreModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
