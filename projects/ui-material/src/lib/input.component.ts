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

export const PERFORMULAR_FORMCOMPONENT_MATINPUT: 'matInput' = 'matInput';

export interface MatInputAttrs extends MatFormFieldAttrs {
    readonly?: boolean;
    type: string;
    debounce?: number;
}

export type MatInputStyles = MatFormFieldStyles;

export class MatInput extends Control<MatInputAttrs, MatInputStyles> {
    public patchValue(value: any, emitUpdate: boolean = true): void {
        super.patchValue(InputValueHandler.validateValue(value, this.attrs.type), emitUpdate);
    }

    public setValue(value: any, emitUpdate: boolean = true): void {
        super.setValue(InputValueHandler.validateValue(value, this.attrs.type), emitUpdate);
    }
}

export function MatInputBuilder(context: BuildContext<TControl>): Abstract {
    return new MatInput(context.params);
}

@ControlComponent({
    name: PERFORMULAR_FORMCOMPONENT_MATINPUT,
    builder: MatInputBuilder
})
@Component({
    selector: 'performular-mat-input',
    template: MatFormFieldTemplate(`
        <input matInput
        [ngStyle]="(field?.styles$ | async)?.control"
        (input)="inputValueHandler?.setValue($event.target.value)"
        [value]="field?.value"
        [type]="(field?.attrs$ | async)?.type"
        [placeholder]="(field?.attrs$ | async)?.placeholder"
        [disabled]="field?.disabled$ | async"
        [readonly]="(field?.attrs$ | async)?.readonly">
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

export class PerformularMatInputComponent extends MatFormField<MatInput> implements IPerformularOnInit<MatInput>, OnDestroy {
    private _inputSub: Subscription | undefined;
    public inputValueHandler: InputValueHandler = <any>undefined;

    public performularOnInit(field: MatInput): void {
        super.performularOnInit(field);
        this.inputValueHandler = new InputValueHandler(field.attrs.type, field.attrs.debounce || 0);
        this._inputSub = this.inputValueHandler.valueChanges
            .subscribe((value: any) => {
                if (this.field) {
                    this.field.setValue(value);
                }
            });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this._inputSub) {
            this._inputSub.unsubscribe();
        }
    }
}
