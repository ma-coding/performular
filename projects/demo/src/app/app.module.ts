import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

import { PerformularModule } from '@performular/ng-common';

import { AppComponent } from './app.component';
import { PerformularUiMaterialModule } from '@performular/ui-material';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        FlexLayoutModule,
        MatNativeDateModule,
        BrowserModule,
        PerformularModule,
        PerformularUiMaterialModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
