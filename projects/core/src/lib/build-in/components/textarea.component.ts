import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Abstract, TControl } from '../../models/abstract';
import { Control } from '../../models/control';
import { BuildContext, ControlComponent, IPerformularOnInit } from '../../models/framework/decorator';
import { InputValueHandler } from '../cdk/input-value-handler';

export const PERFORMULAR_FORMCOMPONENT_TEXTAREA: 'textarea' = 'textarea';

export interface TextareaAttrs {
    debounce?: number;
    rows?: number;
    cols?: number;
}

export type TextareaStyles = 'textarea';

export type Textarea = Control<TextareaAttrs, TextareaStyles>;

@ControlComponent({
    name: PERFORMULAR_FORMCOMPONENT_TEXTAREA,
    builder: (context: BuildContext<TControl>): Abstract => {
        return new Control(context.params);
    }
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

export class TextareaComponent implements IPerformularOnInit<Textarea>, OnDestroy {

    private _textareaSub: Subscription | undefined;

    public field: Textarea = <any>undefined;
    public textareaValueHandler: InputValueHandler = <any>undefined;

    public ngOnDestroy(): void {
        if (this._textareaSub) {
            this._textareaSub.unsubscribe();
        }
    }

    public performularOnInit(field: Textarea): void {
        this.field = field;
        this.textareaValueHandler = new InputValueHandler('text', field.attrs.debounce || 0);
        this._textareaSub = this.textareaValueHandler.valueChanges
            .subscribe((value: any) => {
                this.field.setValue(value);
            });
    }
}
