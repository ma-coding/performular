import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
} from '@angular/material';

import { PerformularCoreModule } from '@performular/core';

import { PerformularMatCheckboxComponent } from './checkbox.component';
import { PerformularMatDatepickerComponent } from './datepicker.component';
import { PerformularMatInputComponent } from './input.component';
import { PerformularMatRadioComponent } from './radio.component';
import { PerformularMatSelectComponent } from './select.component';
import { PerformularMatSliderComponent } from './slider.component';
import { PerformularMatTextareaComponent } from './textarea.component';
import { PerformularMatToggleComponent } from './toggle.component';

export const buildInFormComponents: any[] = [
    PerformularMatCheckboxComponent,
    PerformularMatSliderComponent,
    PerformularMatToggleComponent,
    PerformularMatRadioComponent,
    PerformularMatInputComponent,
    PerformularMatTextareaComponent,
    PerformularMatDatepickerComponent,
    PerformularMatSelectComponent
];

/**
 * Main module class that handle all build-in and custom form elements.
 * @export
 */
@NgModule({
    declarations: [
        ...buildInFormComponents
    ],
    entryComponents: [
        ...buildInFormComponents,
    ],
    imports: [
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatDatepickerModule,
        MatSelectModule,
        PerformularCoreModule.withConfig({
            formComponents: buildInFormComponents
        })
    ]
})
export class PerformularUiMaterialModule { }
