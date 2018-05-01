import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { Injector, NgModule, Provider, Type } from '@angular/core';

import { DefaultConverter } from './buildin/converter/default.converter';
import { ComponentLoaderInjectionToken, IOnInitField } from './core/loaders/component-loader';
import { ConverterLoaderInjectionToken, IOnConvert } from './core/loaders/converter-loader';
import { IOnRun, TriggerLoaderInjectionToken } from './core/loaders/trigger-loader';
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

export const declarations: any[] = [
];

export const buildInFields: Type<IOnInitField<any>>[] = [
];

export const buildInTriggers: Type<IOnRun<any, any>>[] = [
];

export const buildInConverters: Type<IOnConvert<any, any, any>>[] = [
    DefaultConverter
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
        ...buildInTriggers,
        ...buildInConverters
    ], exports: [
        declarations
    ]
})
export class PerformulerCoreModule {

    constructor(
        private _injector: Injector,
        private _loaderService: LoaderService
    ) {
        this._loaderService.connect(this._injector);
    }

    public static withConfig(): ModuleWithProviders {
        return {
            providers: [],
            ngModule: PerformulerCoreModule
        };
    }
}
