import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { ANALYZE_FOR_ENTRY_COMPONENTS, Injector, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ValidatorType } from './effects/validation/models/validator.type';
import { VisibleType } from './effects/visibility/models/visible.type';
import { FieldType } from './field/models/field.type';
import { LoaderService } from './helpers/loader.service';

export interface IPerformularCoreConfig {
    fields?: FieldType[];
    validators?: ValidatorType[];
    visibles?: VisibleType[];
}

export const buildInValidators: ValidatorType[] = [];

export const buildInVisibles: VisibleType[] = [];

export const buildInFields: FieldType[] = [];

/**
 * Main module class that handle all build-in and custom form elements.
 * @export
 */
@NgModule({
    declarations: [
        ...buildInFields
    ],
    entryComponents: [
        ...buildInFields
    ],
    imports: [
        CommonModule,
        FlexLayoutModule
    ],
    providers: [
        LoaderService,
        buildInValidators,
        buildInVisibles
    ],
    exports: [
        CommonModule,
        FlexLayoutModule
    ]
})
export class PerformulerCoreModule {

    constructor(
        private _injector: Injector,
        private _loaderService: LoaderService
    ) {
        this._loaderService.connect(this._injector);
    }

    public static withConfig(config: IPerformularCoreConfig): ModuleWithProviders {
        return {
            providers: [
                {
                    provide: ANALYZE_FOR_ENTRY_COMPONENTS,
                    useValue: config.fields || [],
                    multi: true
                },
                ...(config.validators || []),
                ...(config.visibles || [])
            ],
            ngModule: PerformulerCoreModule
        };
    }
}
