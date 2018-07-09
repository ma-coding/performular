import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { ANALYZE_FOR_ENTRY_COMPONENTS, Injector, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FieldsetComponent } from './build-in/components/fieldset.component';
import { CoreGroupComponent } from './build-in/components/group.component';
import { InputComponent } from './build-in/components/input.component';
import { CoreListComponent } from './build-in/components/list.component';
import { TextareaComponent } from './build-in/components/textarea.component';
import { DefaultRunDetector } from './build-in/run-detectors/default.run-detector';
import { OnChangeRunDetector } from './build-in/run-detectors/on-change.run-detector';
import { MaxLengthValidator } from './build-in/validators/max-length.validator';
import { MaxValidator } from './build-in/validators/max.validator';
import { MinLengthValidator } from './build-in/validators/min-length.validator';
import { MinValidator } from './build-in/validators/min.validator';
import { RequiredValidator } from './build-in/validators/required.validator';
import { AutoFocusDirective } from './form/auto-focus';
import { FormComponent } from './form/component';
import { RendererDirective } from './form/renderer';
import { Store } from './form/store';
import { TemplateDirective } from './form/template';
import { ControlDatasourceType } from './models/datasource/datasource';
import { EffectType } from './models/effects/effect';
import { RunDetectorType } from './models/effects/run-detection/run-detection';
import { FormComponentType } from './models/framework/decorator';

export interface IPerformularModuleConfig {
    formComponents?: FormComponentType[];
    effects?: EffectType[];
    runDetectors?: RunDetectorType[];
    controlDatasources?: ControlDatasourceType[];
}

export const declarations: any[] = [
    RendererDirective,
    TemplateDirective,
    AutoFocusDirective,
    FormComponent
];

export const buildInFormComponents: FormComponentType[] = [
    InputComponent,
    TextareaComponent,
    FieldsetComponent,
    CoreGroupComponent,
    CoreListComponent
];

export const buildInEffects: EffectType[] = [
    RequiredValidator,
    MinValidator,
    MaxValidator,
    MinLengthValidator,
    MaxLengthValidator,
];

export const buildInRunDetectors: RunDetectorType[] = [
    DefaultRunDetector,
    OnChangeRunDetector
];

/**
 * Main module class that handle all build-in and custom form elements.
 * @export
 */
@NgModule({
    declarations: [
        ...buildInFormComponents,
        ...declarations
    ],
    entryComponents: [
        ...buildInFormComponents,
    ],
    imports: [
        CommonModule,
        FlexLayoutModule
    ],
    providers: [
        Store,
        ...buildInEffects,
        ...buildInRunDetectors
    ],
    exports: [
        CommonModule,
        FlexLayoutModule,
        ...declarations
    ]
})
export class PerformularCoreModule {

    constructor(
        private _injector: Injector,
        private _loader: Store
    ) {
        this._loader.connect(this._injector);
    }

    public static withConfig(config: IPerformularModuleConfig): ModuleWithProviders {
        return {
            providers: [
                {
                    provide: ANALYZE_FOR_ENTRY_COMPONENTS,
                    useValue: (config.formComponents || []),
                    multi: true
                },
                ...(config.effects || []),
                ...(config.runDetectors || []),
                ...(config.controlDatasources || []),
            ],
            ngModule: PerformularCoreModule
        };
    }
}
