export function isInstance<InstanceType>(
    value: any,
    keys: Array<keyof InstanceType>
): value is InstanceType {
    return value && keys.every((k: keyof InstanceType) => !!value[k]);
}
