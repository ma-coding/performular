import { AbstractDecoratorOptions } from '../decorator/types/abstract-decorator.options';
import { Framework } from '../framework/framework';
import { Metadata } from '../metadata/metadata';
import { MetadataState } from '../metadata/types/metadata-state';
import { MetadataType } from '../metadata/types/metadata-type';
import { isClass } from '../util/is-class';
import { isFunction } from '../util/is-function';
import { isInstance } from '../util/is-instance';
import { isString } from '../util/is-string';
import { InstanceDef } from '../util/types/instance-def';
import { RunContext } from '../util/types/run-context';

export abstract class AbstractHandlerWithFunc<
    InstanceType extends any,
    FunctionType extends (...t: any[]) => any
> {
    public runKey: keyof InstanceType;
    public target: InstanceDef<InstanceType> | FunctionType;
    public metadata?: MetadataType<AbstractDecoratorOptions, any>;
    public instance: FunctionType | InstanceType;
    public params?: any;

    constructor(
        metadataKey: keyof MetadataState,
        runKey: keyof InstanceType,
        target: InstanceDef<InstanceType> | FunctionType | string,
        keys: Array<keyof InstanceType>,
        params?: any
    ) {
        this.runKey = runKey;
        this.params = params;
        if (isString(target)) {
            this.metadata = Metadata.getItem(metadataKey, target);
            if (this.metadata) {
                this.target = this.metadata.target;
                this.instance = Framework.getInjector().createInstance<
                    InstanceType
                >(<InstanceDef<InstanceType>>this.target);
            } else {
                throw new Error('Todo:');
            }
        } else if (isClass<InstanceType>(target, keys)) {
            this.target = target;
            this.instance = Framework.getInjector().createInstance<
                InstanceType
            >(<InstanceDef<InstanceType>>this.target);
        } else if (isFunction<FunctionType>(target)) {
            this.target = target;
            this.instance = this.target;
        } else {
            throw new Error('Todo:');
        }
    }

    public run(context: RunContext): ReturnType<FunctionType> {
        if (isInstance<InstanceType>(this.instance, [this.runKey])) {
            return this.instance[this.runKey](context, this.params);
        } else if (isFunction<FunctionType>(this.instance)) {
            return this.instance(context, this.params);
        } else {
            throw new Error('Todo:');
        }
    }
}
