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
import { MaterialRadioComponent } from './radio.component';
import { MaterialSelectComponent } from './select.component';
import { MaterialSliderComponent } from './slider.component';
import { MaterialTextareaComponent } from './textarea.component';
import { MaterialToggleComponent } from './toggle.component';
import { FlexLayoutModule } from '../../../../node_modules/@angular/flex-layout';

export const buildInModels: any[] = [
    MaterialCheckboxComponent,
    MaterialSliderComponent,
    MaterialToggleComponent,
    MaterialToggleComponent,
    MaterialInputComponent,
    MaterialTextareaComponent,
    MaterialDatepickerComponent,
    MaterialRadioComponent,
    MaterialSelectComponent
];

/**
 * Main module class that handle all build-in and custom form elements.
 * @export
 */
@NgModule({
    declarations: [...buildInModels],
    entryComponents: [...buildInModels],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatDatepickerModule,
        MatSelectModule,
        PerformularModule.withConfig({
            models: buildInModels
        })
    ]
})
export class PerformularUiMaterialModule {}
