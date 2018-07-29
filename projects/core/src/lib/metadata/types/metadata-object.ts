import { AbstractDecoratorOptions } from '../../decorator/types/abstract-decorator.options';
import { InstanceDef } from '../../util/types/instance-def';
import { ObjectType } from '../../util/types/object-type';
import { MetadataType } from './metadata-type';

export type MetadataObject<
    D extends AbstractDecoratorOptions,
    T extends InstanceDef<any>
    > = ObjectType<MetadataType<D, T>>;
