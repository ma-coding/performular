import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { PerformulerCoreModule } from '@performular/core';

import { AppComponent } from './app.component';
import { CoreGroupComponent } from './group.component';
import { InputComponent } from './input.component';

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
            ]
        })
    ],
    entryComponents: [
        InputComponent,
        CoreGroupComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
