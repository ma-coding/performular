import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

import { PerformularCoreModule } from '@performular/core';
import { PerformularUiMaterialModule } from '@performular/ui-material';

import { AppComponent } from './app.component';
import { TestDatasource } from './test.datasource';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        FlexLayoutModule,
        MatNativeDateModule,
        BrowserModule,
        PerformularCoreModule.withConfig({
            controlDatasources: [
                TestDatasource
            ]
        }),
        PerformularUiMaterialModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
