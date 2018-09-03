import { isGroupFieldOptions, GroupField } from './group-field';
import { isListFieldOptions, ListField } from './list-field';
import { isControlFieldOptions, ControlField } from './control-field';
import { BuildContext } from './abstract-field';

export type FieldState = GroupField | ListField | ControlField;

export function addToPath(current: string, next: string): string {
    if (current === '') {
        return next;
    }
    return `${current}/${next}`;
}

export function buildEntities<Fieldoptions>(
    options: Fieldoptions,
    context: BuildContext
): void {
    if (isGroupFieldOptions(options)) {
        // tslint:disable-next-line:no-unused-expression
        new GroupField(options, context);
    } else if (isListFieldOptions(options)) {
        // tslint:disable-next-line:no-unused-expression
        new ListField(<any>options, context);
    } else if (isControlFieldOptions(options)) {
        // tslint:disable-next-line:no-unused-expression
        new ControlField(options, context);
    } else {
        console.error(options);
        throw new Error('Unknown Fieldoptions provided');
    }
}
