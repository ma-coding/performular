import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { Injector, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { Loader } from './loader';
import { EffectType } from './models/effect';
import { FrameworkType } from './models/framework';
import { RunDetectorType } from './models/run-detector';
import { RendererDirective } from './renderer';

export interface IPerformularCoreConfig {
    formComponents?: FrameworkType[];
    effects?: EffectType[];
    runDetectors?: RunDetectorType[];
}

export const declarations: any[] = [
    RendererDirective
];

export const buildInFormComponents: FrameworkType[] = [
];

export const buildInEffects: EffectType[] = [
];

export const buildInRunDetectors: RunDetectorType[] = [
    // DefaultConverter
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
        buildInEffects,
        buildInRunDetectors
    ], exports: [
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
