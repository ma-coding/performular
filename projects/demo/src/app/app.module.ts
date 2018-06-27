import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { PerformularCoreModule } from '@performular/core';

import { PerformularUiMaterialModule } from '../../../ui-material/src/lib/ui-material.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        FormsModule,
        FlexLayoutModule,
        BrowserModule,
        PerformularCoreModule,
        PerformularUiMaterialModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
