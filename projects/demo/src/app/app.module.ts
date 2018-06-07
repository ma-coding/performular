import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { PerformulerCoreModule } from '@performular/core';

import { AppComponent } from './app.component';
import { DefaultRunDetector } from './default.run-detector';
import { CoreGroupComponent } from './group.component';
import { CoreListComponent } from './list.component';
import { RequiredValidator } from './required.validation';

@NgModule({
    declarations: [
        AppComponent,
        CoreGroupComponent,
        CoreListComponent
    ],
    imports: [
        FormsModule,
        FlexLayoutModule,
        BrowserModule,
        PerformulerCoreModule.withConfig({
            formComponents: [
                CoreGroupComponent,
                CoreListComponent
            ],
            runDetectors: [
                DefaultRunDetector
            ],
            effects: [
                RequiredValidator
            ]
        })
    ],
    entryComponents: [
        CoreGroupComponent,
        CoreListComponent
    ],
    providers: [
        DefaultRunDetector,
        RequiredValidator
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
