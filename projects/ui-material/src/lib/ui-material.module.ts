import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material';

import { PerformularCoreModule } from '@performular/core';

import { PerformularMatCheckboxComponent } from './checkbox.component';

export const buildInFormComponents: any[] = [
    PerformularMatCheckboxComponent
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
        MatCheckboxModule,
        PerformularCoreModule.withConfig({
            formComponents: buildInFormComponents
        })
    ],
    providers: [
    ],
    exports: []
})
export class PerformularUiMaterialModule { }
