/*
 * Public API Surface of core
 */
export { CoreFieldsetComponent } from './lib/build-in/field/core-fieldset';
export { CoreGroupComponent } from './lib/build-in/field/core-group';
export { CoreInputComponent } from './lib/build-in/field/core-input';
export { CoreItemComponent } from './lib/build-in/field/core-item';
export { CoreLayoutComponent } from './lib/build-in/field/core-layout';

export { FormComponent } from './lib/form.component';

export {
    Converter, IConverterDecoration, Schema, ISchemaDecoration,
    SchemaType, Trigger, TriggerStrategy, ITriggerDecoration
} from './lib/decorators';

export { AutoFocusDirective } from './lib/auto-focus.directive';
export { SchemaDirective } from './lib/schema.directive';

export {
    ConverterLoader, IOnConvert, SchemaLoader, IOnSchemaInit,
    TriggerLoader, IOnTrigger
} from './lib/loaders';

export { IPerformularCoreConfig, PerformulerCoreModule } from './lib/module';

export {
    ArraySchema, GroupSchema, ControlSchema, LayoutSchema,
    ISchemaBuildOptions, SchemaBuilder
} from './lib/schemas';
