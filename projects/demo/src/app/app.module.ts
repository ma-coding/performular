import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { PerformulerCoreModule } from '@performular/core';

import { AppComponent } from './app.component';
import { DefaultRunDetector } from './default.run-detector';
import { CoreGroupComponent } from './group.component';
import { InputComponent } from './input.component';
import { RequiredValidator } from './required.validation';

@NgModule({
    declarations: [
        AppComponent,
        InputComponent,
        CoreGroupComponent
    ],
    imports: [
        FormsModule,
        FlexLayoutModule,
        BrowserModule,
        PerformulerCoreModule.withConfig({
            formComponents: [
                InputComponent,
                CoreGroupComponent
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
        InputComponent,
        CoreGroupComponent
    ],
    providers: [
        DefaultRunDetector,
        RequiredValidator
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
