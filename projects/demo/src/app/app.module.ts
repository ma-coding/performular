import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

import { PerformularModule } from '@performular/ng-common';
import { PerformularUiMaterialModule } from '@performular/ui-material';

import { AppComponent } from './app.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FlexLayoutModule,
        MatNativeDateModule,
        BrowserModule,
        PerformularModule.withConfig({}),
        PerformularUiMaterialModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
