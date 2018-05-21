import { ElementRef } from '@angular/core';

import { IField } from '../../field/models/field.interface';
import { FieldType } from '../../field/models/field.type';
import { PropertyType } from '../../properties/models/types';
import { AbstractSchema } from '../abstract.schema';

export interface IAbstractSchemaState<BType> {
    type: PropertyType;
    uuid: string;
    hidden: boolean;
    field: FieldType;
    bindings: BType;
    children: AbstractSchema[];
    parent?: AbstractSchema;
    elementRef?: ElementRef;
    instance?: IField;
}
