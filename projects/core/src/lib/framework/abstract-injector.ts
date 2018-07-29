import { InstanceDef } from '../util/types/instance-def';

export abstract class AbstractInjector {
    public abstract createInstance<T>(instanceDef: InstanceDef<T>): T;
}
