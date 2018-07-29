import { AbstractDecoratorOptions } from '../../decorator/types/abstract-decorator.options';
import { InstanceDef } from '../../util/types/instance-def';

export type MetadataType<
    D extends AbstractDecoratorOptions,
    T extends InstanceDef<any>
> = D & {
    target: T;
};
