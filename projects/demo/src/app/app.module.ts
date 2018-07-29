import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

import { PerformularModule } from '@performular/ng-connector';
import { PerformularUiMaterialModule } from '@performular/ng-ui-material';

import { AppComponent } from './app.component';
import { TestDatasource } from './datsource';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FlexLayoutModule,
        MatNativeDateModule,
        BrowserModule,
        PerformularModule.forRoot({
            datasources: [TestDatasource]
        }),
        PerformularUiMaterialModule
    ],
    declarations: [AppComponent],
    providers: [TestDatasource],
    bootstrap: [AppComponent]
})
export class AppModule {}
