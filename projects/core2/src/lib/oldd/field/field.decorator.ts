import { MetadataStore } from '../helpers/metadata-store';

export function Field(name: string): ClassDecorator {
    return (target: Function): void => {
        MetadataStore.addField(name, <any>target);
    };
}
