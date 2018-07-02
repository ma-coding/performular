import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import {
    Abstract,
    BuildContext,
    Control,
    ControlComponent,
    InputValueHandler,
    IPerformularOnInit,
    TControl,
} from '@performular/core';

import { MatFormField, MatFormFieldAttrs, MatFormFieldStyles, MatFormFieldTemplate } from './form-field';

export const PERFORMULAR_FORMCOMPONENT_MATTEXTAREA: 'matTextarea' = 'matTextarea';

export interface MatTextareaAttrs extends MatFormFieldAttrs {
    readonly?: boolean;
    debounce?: number;
    autoResize?: boolean;
    maxRows?: number;
    minRows?: number;
}

export type MatTextareaStyles = MatFormFieldStyles;

export class MatTextarea extends Control<MatTextareaAttrs, MatTextareaStyles> { }

export function MatTextareaBuilder(context: BuildContext<TControl>): Abstract {
    return new MatTextarea(context.params);
}

@ControlComponent({
    name: PERFORMULAR_FORMCOMPONENT_MATTEXTAREA,
    builder: MatTextareaBuilder
})
@Component({
    selector: 'performular-mat-textarea',
    template: MatFormFieldTemplate(`
        <textarea matInput
        [performularAutoFocus]="field?.focus$ | async"
        [ngStyle]="(field?.styles$ | async)?.control"
        (input)="textareaValueHandler?.setValue($event.target.value)"
        [value]="field?.value"
        [matTextareaAutosize]="(field?.attrs$ | async)?.autoResize"
        [matAutosizeMaxRows]="(field?.attrs$ | async)?.maxRows"
        [matAutosizeMinRows]="(field?.attrs$ | async)?.minRows"
        [placeholder]="(field?.attrs$ | async)?.placeholder"
        [disabled]="field?.disabled$ | async"
        [readonly]="(field?.attrs$ | async)?.readonly">
        </textarea>
        `),
    styles: [`
        :host {
            width: 100%;
            display: block;
        }
        mat-form-field {
            width: 100%;
            display: block;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PerformularMatTextareaComponent extends MatFormField<MatTextarea> implements IPerformularOnInit<MatTextarea>, OnDestroy {
    private _textareaSub: Subscription | undefined;
    public textareaValueHandler: InputValueHandler = <any>undefined;

    public performularOnInit(field: MatTextarea): void {
        super.performularOnInit(field);
        this.textareaValueHandler = new InputValueHandler('text', field.attrs.debounce || 0);
        this._textareaSub = this.textareaValueHandler.valueChanges
            .subscribe((value: any) => {
                if (this.field) {
                    this.field.setValue(value);
                }
            });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this._textareaSub) {
            this._textareaSub.unsubscribe();
        }
    }
}
