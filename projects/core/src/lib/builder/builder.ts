import { AbstractModel } from '../model/abstract-model';
import { InstanceDef } from '../util/types/instance-def';
import { JsonBuilder } from './json-builder';
import { JsonUnionOptions } from './types/json-unions-options';

export class Builder {
    public static build<T extends AbstractModel, K = any>(
        targetOrJson: JsonUnionOptions | InstanceDef<K>,
        value: K
    ): T {
        if ('type' in targetOrJson) {
            return <T>JsonBuilder.build(targetOrJson, value);
        } else {
            return <T>{}; // Todo: add Type builder
        }
    }
}
