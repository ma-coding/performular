import { InjectionToken, Type } from '@angular/core';

import { IMetadataTarget, LoaderService } from '../ng/loader.service';
import { AbstractSchema } from '../schemas/abstract.schema';

export interface IFieldDecoration {
    id: string;
}

export const FieldMetadataKey: string = '__PERFORMULAR_FIELD_META__';

export function Field(decoration: IFieldDecoration): ClassDecorator {
    return (target: Function): void => {
        Reflect.defineMetadata(FieldMetadataKey, decoration, target);
    };
}

export interface IOnInitField<FType extends AbstractSchema = any> {
    onInitField(field: FType): void;
}

export type FieldType = Type<IOnInitField>;

export const FieldToken: InjectionToken<FieldType> =
    new InjectionToken('__PERFORMULAR_FIELD_TOKEN__');

export type FieldSchema = FieldType | string;

export class FieldHandler {
    private target: FieldType;

    constructor(schema: FieldSchema) {
        if (typeof schema === 'string') {
            const metadataTarget: IMetadataTarget | undefined =
                LoaderService.getFromString(schema, FieldMetadataKey, FieldToken);
            if (!metadataTarget) {
                throw new Error('Not Provided');
            }
            this.target = metadataTarget.target;
        } else {
            this.target = schema;
        }
    }

}
