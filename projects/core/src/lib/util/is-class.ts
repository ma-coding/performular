import { InstanceDef } from './types/instance-def';

export function isClass<InstanceType>(
    value: any,
    keys: Array<keyof InstanceType>
): value is InstanceDef<InstanceType> {
    return (
        value &&
        value.prototype &&
        keys.every(
            (k: keyof InstanceType) =>
                !!Object.keys(value.prototype).find((ok: string) => ok === k)
        )
    );
}
