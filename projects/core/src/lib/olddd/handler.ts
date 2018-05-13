import { Type } from '@angular/core';

import { ComponentSchema, ConverterSchema, EffectSchema, ITriggerDecoration } from './types';

export class EffectHandler {

    public schema: EffectSchema;
    public metadata: ITriggerDecoration | undefined;

    constructor(schema: EffectSchema) {
        this.schema = schema;
        if (typeof schema.trigger === 'string') {
            // TODO Handle string
            console.log('STRING');
        } else {
            console.log('FUNCTION');
        }
    }
}

export class ComponentHandler {
    public component: Type<any>;

    constructor(schema: ComponentSchema) {
        if (schema instanceof Type) {
            this.component = schema;
        } else {
            // TODO Handle string
            this.component = class { };
        }
    }
}

export class ConverterHandler {
    public converter: Type<any>;

    constructor(schema: ConverterSchema) {
        if (schema instanceof Type) {
            this.converter = schema;
        } else {
            // TODO Handle string
            this.converter = class { };
        }
    }
}
