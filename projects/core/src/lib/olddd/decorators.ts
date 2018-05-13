import { IComponentDecoration, IConverterDecoration, ITriggerDecoration } from './types';

export const TRIGGER_METADATA: string = '__TRIGGER_METADATA_PERFORMULAR__';

export function Trigger(decoration: ITriggerDecoration): ClassDecorator {
    return (target: Function): void => {
        Reflect.defineMetadata(
            TRIGGER_METADATA, {
                ...decoration,
                target: target
            },
            target
        );
    };
}

export const FIELD_METADATA: string = '__FIELD_METADATA_PERFORMULAR__';

export function Field(decoration: IComponentDecoration): ClassDecorator {
    return (target: Function): void => {
        Reflect.defineMetadata(
            FIELD_METADATA, {
                ...decoration,
                target: target
            },
            target
        );
    };
}

export const CONVERTER_METADATA: string = '__FIELD_METADATA_PERFORMULAR__';

export function Converter(decoration: IConverterDecoration): ClassDecorator {
    return (target: Function): void => {
        Reflect.defineMetadata(
            CONVERTER_METADATA, {
                ...decoration,
                target: target
            },
            target
        );
    };
}
