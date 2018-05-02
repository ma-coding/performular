import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { Injector, NgModule, Provider, Type } from '@angular/core';

import { DefaultConverter } from './build-in/converter/default.converter';
import { FormComponent } from './components/form.component';
import { ComponentLoaderInjectionToken, IOnInitField } from './core/loaders/component-loader';
import { ConverterLoaderInjectionToken, IOnConvert } from './core/loaders/converter-loader';
import { GeneratorLoaderInjectionToken, IOnGenerate } from './core/loaders/generator-loader';
import { IOnRun, TriggerLoaderInjectionToken } from './core/loaders/trigger-loader';
import { FieldDirective } from './directives/field-directive';
import { LoaderService } from './services/loader.service';

/**
 * Function that creates an Component Provider.
 */
export function componentExporter(component: Type<IOnInitField<any>>): Provider {
    return {
        provide: ComponentLoaderInjectionToken,
        useValue: component,
        multi: true
    };
}

/**
 * Function that creates an Trigger Provider.
 */
export function triggerExporter(trigger: Type<IOnRun<any, any>>): Provider {
    return {
        provide: TriggerLoaderInjectionToken,
        useValue: trigger,
        multi: true
    };
}

/**
 * Function that creates an Converter Provider.
 */
export function converterExporter(converter: Type<IOnConvert<any, any, any>>): Provider {
    return {
        provide: ConverterLoaderInjectionToken,
        useValue: converter,
        multi: true
    };
}

/**
 * Function that creates an Generator Provider.
 */
export function generatorExporter(converter: Type<IOnGenerate<any, any, any>>): Provider {
    return {
        provide: GeneratorLoaderInjectionToken,
        useValue: converter,
        multi: true
    };
}

export interface IPerformularCoreConfig {
    fields?: Type<IOnInitField<any>>[];
    triggers?: Type<IOnRun<any, any>>[];
    converters?: Type<IOnConvert<any, any, any>>[];
    generators?: Type<IOnGenerate<any, any, any>>[];
}

export const declarations: any[] = [
    FormComponent,
    FieldDirective
];

export const buildInFields: Type<IOnInitField<any>>[] = [
];

export const buildInTriggers: Type<IOnRun<any, any>>[] = [
];

export const buildInConverters: Type<IOnConvert<any, any, any>>[] = [
    DefaultConverter
];

export const buildInGenerators: Type<IOnGenerate<any, any, any>>[] = [
];

/**
 * Main module class that handle all build-in and custom form elements.
 * @export
 */
@NgModule({
    declarations: [
        ...buildInFields,
        ...declarations
    ],
    entryComponents: [
        ...buildInFields,
    ],
    imports: [
        CommonModule
    ],
    providers: [
        LoaderService,
        buildInFields.map(componentExporter),
        buildInTriggers.map(triggerExporter),
        buildInConverters.map(converterExporter),
        buildInGenerators.map(generatorExporter),
        buildInTriggers,
        buildInConverters
    ], exports: [
        CommonModule,
        ...declarations
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
                (config.fields || []).map(componentExporter),
                (config.triggers || []).map(triggerExporter),
                (config.converters || []).map(converterExporter),
                (config.generators || []).map(generatorExporter),
                (config.triggers || []),
                (config.converters || []),
                (config.generators || [])
            ],
            ngModule: PerformulerCoreModule
        };
    }
}
