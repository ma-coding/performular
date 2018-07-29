import { AbstractModel } from '../model/abstract-model';
import { GroupFieldModel } from '../model/group-field-model';
import { InstanceDef } from '../util/types/instance-def';
import { JsonBuilder } from './json-builder';
import { TypeBuilder } from './type-builder';
import { JsonUnionOptions } from './types/json-unions-options';

export class Builder {

    public static buildFromJson<T extends AbstractModel, K = any>(
        json: JsonUnionOptions,
        value: K
    ): T {
        return <T>JsonBuilder.build(json, value);
    }

    public static buildFromTarget<K>(
        target: InstanceDef<K>,
        value: K
    ): GroupFieldModel {
        return TypeBuilder.build<K>(target, value);
    }
}
