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
    MatSlideToggleModule
} from '@angular/material';
import { PerformularModule } from '@performular/ng-common';
import { MaterialCheckboxComponent } from './checkbox.component';
import { MaterialDatepickerComponent } from './datepicker.component';
import { MaterialInputComponent } from './input.component';
import { PerformularMatRadioComponent } from './radio.component';
import { PerformularMatSelectComponent } from './select.component';
import { MaterialSliderComponent } from './slider.component';
import { MaterialTextareaComponent } from './textarea.component';
import { MaterialToggleComponent } from './toggle.component';

export const buildInFormComponents: any[] = [
    MaterialCheckboxComponent,
    MaterialSliderComponent,
    MaterialToggleComponent,
    MaterialInputComponent,
    MaterialTextareaComponent,
    MaterialDatepickerComponent,
    PerformularMatRadioComponent,
    PerformularMatSelectComponent
];

/**
 * Main module class that handle all build-in and custom form elements.
 * @export
 */
@NgModule({
    declarations: [...buildInFormComponents],
    entryComponents: [...buildInFormComponents],
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
        PerformularModule.withConfig({
            models: buildInFormComponents
        })
    ]
})
export class PerformularUiMaterialModule {}
