import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { Injector, NgModule, Provider, Type } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AutoFocusDirective } from './auto-focus.directive';
import { CoreFieldsetComponent } from './build-in/field/core-fieldset';
import { CoreGroupComponent } from './build-in/field/core-group';
import { CoreInputComponent } from './build-in/field/core-input';
import { CoreItemComponent } from './build-in/field/core-item';
import { CoreLayoutComponent } from './build-in/field/core-layout';
import { CoreTextareaComponent } from './build-in/field/core-textarea';
import { EmailTrigger } from './build-in/trigger/email.trigger';
import { MaxLengthTrigger } from './build-in/trigger/max-length.trigger';
import { MaxTrigger } from './build-in/trigger/max.trigger';
import { MinLengthTrigger } from './build-in/trigger/min-length.trigger';
import { MinTrigger } from './build-in/trigger/min.trigger';
import { PatternTrigger } from './build-in/trigger/pattern.trigger';
import { RequiredTrigger } from './build-in/trigger/required.trigger';
import { FormComponent } from './form.component';
import { LoaderService } from './loader.service';
import { ConverterLoaderInjectionToken, SchemaLoaderInjectionToken, TriggerLoaderInjectionToken } from './loaders';
import { SchemaDirective } from './schema.directive';

/**
 * Function that creates an Component Provider.
 */
export function componentExporter(component: Type<any>): Provider {
    return {
        provide: SchemaLoaderInjectionToken,
        useValue: component,
        multi: true
    };
}

/**
 * Function that creates an Trigger Provider.
 */
export function triggerExporter(trigger: Type<any>): Provider {
    return {
        provide: TriggerLoaderInjectionToken,
        useValue: trigger,
        multi: true
    };
}

/**
 * Function that creates an Converter Provider.
 */
export function converterExporter(converter: Type<any>): Provider {
    return {
        provide: ConverterLoaderInjectionToken,
        useValue: converter,
        multi: true
    };
}

export interface IPerformularCoreConfig {
    fields?: Type<any>[];
    triggers?: Type<any>[];
    converters?: Type<any>[];
}

export const declarations: any[] = [
    FormComponent,
    SchemaDirective,
    AutoFocusDirective
];

export const buildInFields: Type<any>[] = [
    CoreInputComponent,
    CoreTextareaComponent,
    CoreGroupComponent,
    CoreFieldsetComponent,
    CoreLayoutComponent,
    CoreItemComponent
];

export const buildInTriggers: Type<any>[] = [
    RequiredTrigger,
    MinTrigger,
    MaxTrigger,
    MinLengthTrigger,
    MaxLengthTrigger,
    EmailTrigger,
    PatternTrigger
];

export const buildInConverters: Type<any>[] = [
    // DefaultConverter
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
        CommonModule,
        FlexLayoutModule
    ],
    providers: [
        LoaderService,
        buildInFields.map(componentExporter),
        buildInTriggers.map(triggerExporter),
        buildInConverters.map(converterExporter),
        buildInTriggers,
        buildInConverters
    ], exports: [
        CommonModule,
        FlexLayoutModule,
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
                (config.triggers || []),
                (config.converters || [])
            ],
            ngModule: PerformulerCoreModule
        };
    }
}
