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
import { FormComponent } from './form';
import { Loader } from './loader';
import { EffectType } from './models/effect';
import { FrameworkType } from './models/framework';
import { RunDetectorType } from './models/run-detector';
import { RendererDirective } from './renderer';
import { TemplateDirective } from './template';

export interface IPerformularModuleConfig {
    formComponents?: FrameworkType[];
    effects?: EffectType[];
    runDetectors?: RunDetectorType[];
}

export const declarations: any[] = [
    FormComponent,
    RendererDirective,
    TemplateDirective
];

export const buildInFormComponents: FrameworkType[] = [
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
        Loader,
        ...buildInEffects,
        ...buildInRunDetectors
    ],
    exports: [
        CommonModule,
        FlexLayoutModule,
        ...declarations
    ]
})
export class PerformulerCoreModule {

    constructor(
        private _injector: Injector,
        private _loader: Loader
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
                ...(config.runDetectors || [])
            ],
            ngModule: PerformulerCoreModule
        };
    }
}
