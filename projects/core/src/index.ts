/*
 * Public API Surface of core
 */
export { CoreFieldsetComponent } from './lib/build-in/field/core-fieldset';
export { CoreGroupComponent } from './lib/build-in/field/core-group';
export { CoreInputComponent } from './lib/build-in/field/core-input';
export { CoreItemComponent } from './lib/build-in/field/core-item';
export { CoreLayoutComponent } from './lib/build-in/field/core-layout';

export { FormComponent } from './lib/ng/form.component';

export {
    ConverterToken, IOnConvert, IConverterDecoration, Converter, ConverterHandler,
    ConverterMetadataKey, ConverterSchema, ConverterType
} from './lib/handler/converter.handler';

export {
    Trigger, TriggerStrategy, ITriggerDecoration, IOnTrigger, ITriggerResult,
    TriggerToken, TriggerAction, TriggerFunction, TriggerHandler, TriggerMetadataKey,
    TriggerSchema, TriggerType
} from './lib/handler/trigger.handler';

export {
    IFieldDecoration, IOnInitField, Field, FieldHandler,
    FieldType, FieldToken, FieldSchema, FieldMetadataKey
} from './lib/handler/field.handler';

export { AutoFocusDirective } from './lib/ng/auto-focus.directive';
export { SchemaDirective } from './lib/ng/schema.directive';

export { IPerformularCoreConfig, PerformulerCoreModule } from './lib/ng/module';

export {
    ArraySchema, GroupSchema, ControlSchema, LayoutSchema, IControlSchema, IArraySchema, IGroupSchema, ILayoutSchema
} from './lib/schemas/schemas';

export {
    SchemaType
} from './lib/schemas/abstract.schema';
