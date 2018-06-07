import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Control, IControl } from '../../models/control';
import { FormComponent, IOnInitFramework } from '../../models/framework';
import { InputValueHandler } from '../cdk/input-value-handler';

export const PERFORMULAR_FORMCOMPONENT_TEXTAREA: 'textarea' = 'textarea';

export interface TextareaAttrs {
    rows?: number;
    cols?: number;
}

export type TextareaStyles = 'textarea';

export type ITextarea = IControl<typeof PERFORMULAR_FORMCOMPONENT_TEXTAREA, TextareaAttrs, TextareaStyles>;
export type Textarea = Control<typeof PERFORMULAR_FORMCOMPONENT_TEXTAREA, TextareaAttrs, TextareaStyles>;

@FormComponent({
    name: PERFORMULAR_FORMCOMPONENT_TEXTAREA
})
@Component({
    selector: 'performular-textarea',
    template: `<textarea
        [id]="field?.uuid"
        [rows]="(field?.attrs$ | async).rows"
        [cols]="(field?.attrs$ | async).cols"
        [value]="field?.value$ | async"
        (input)="textareaValueHandler.setValue($event.target.value)"
        [ngStyle]="(field?.styles$ | async)?.textarea"
        style="width: 100%"></textarea>`,
    styles: [`
        :host {
            width: 100%;
            display: block;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TextareaComponent implements IOnInitFramework<Textarea>, OnDestroy {

    private _textareaSub: Subscription | undefined;

    public field: Textarea = <any>undefined;
    public textareaValueHandler: InputValueHandler = <any>undefined;

    public ngOnDestroy(): void {
        if (this._textareaSub) {
            this._textareaSub.unsubscribe();
        }
    }

    public onInitFramework(field: Textarea): void {
        this.field = field;
        this.textareaValueHandler = new InputValueHandler('text');
        this._textareaSub = this.textareaValueHandler.valueChanges
            .subscribe((value: any) => {
                this.field.setValue(value);
            });
    }
}
