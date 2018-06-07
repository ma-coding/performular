import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { Injector, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FieldsetComponent } from './build-in/components/fieldset.component';
import { InputComponent } from './build-in/components/input.component';
import { TextareaComponent } from './build-in/components/textarea.component';
import { DefaultRunDetector } from './build-in/run-detectors/default.run-detector';
import { OnChangeRunDetector } from './build-in/run-detectors/on-change.run-detector';
import { FormComponent } from './form';
import { Loader } from './loader';
import { EffectType } from './models/effect';
import { FrameworkType } from './models/framework';
import { RunDetectorType } from './models/run-detector';
import { RendererDirective } from './renderer';
import { TemplateDirective } from './template';

export interface IPerformularCoreConfig {
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
    FieldsetComponent
];

export const buildInEffects: EffectType[] = [
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

    public static withConfig(config: IPerformularCoreConfig): ModuleWithProviders {
        return {
            providers: [],
            ngModule: PerformulerCoreModule
        };
    }
}
