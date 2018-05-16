import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Field, IOnInitField } from '../../handler/field.handler';
import { ControlSchema } from '../../schemas/schemas';

export function convertInputTypeValue(value: any, type: string): any {
    if (type === 'number') {
        const numValue: number = parseFloat(value);
        if (numValue !== NaN) {
            return numValue;
        }
    }
    return value;
}

export interface ICoreInput {
    placeholder?: string;
    type?: string;
    readonly?: boolean;
}

@Field({
    id: 'Input'
})
@Component({
    selector: 'performular-core-input',
    template: `
        <input
            [id]="control?.get$('id') | async"
            [performularAutoFocus]="control?.get$('focus') | async"
            [placeholder]="(control?.get$('bindings') | async)?.placeholder"
            [type]="(control?.get$('bindings') | async)?.type"
            [readonly]="(control?.get$('bindings') | async)?.readonly"
            [value]="control?.get$('value') | async"
            [disabled]="control?.get$('disabled') | async"
            (input)="onInput($event)">
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreInputComponent implements IOnInitField, OnDestroy {

    private _valueChanged$: Subject<any> = new Subject();
    private _valueChangedSubscription: Subscription | undefined;
    public control: ControlSchema<ICoreInput> | undefined;

    constructor() {
        this._valueChangedSubscription = this._valueChanged$.pipe(
            // tslint:disable-next-line:no-magic-numbers
            debounceTime(200)
        ).subscribe((value: any) => this.control ? this.control.setValue(value) : null);
    }

    public onInitField(control: ControlSchema<ICoreInput>): void {
        this.control = control;
    }

    public ngOnDestroy(): void {
        if (this._valueChangedSubscription) {
            this._valueChangedSubscription.unsubscribe();
        }
    }

    public onInput(event: KeyboardEvent): void {
        const newValue: any = (<any>event.target).value;
        this._handleValue(newValue);
    }

    private _handleValue(newValue: any): void {
        if (this.control && newValue !== this.control.get('value')) {
            const type: string = this.control.get('bindings').type || 'text';
            this._valueChanged$.next(convertInputTypeValue(newValue, type));
        }
    }
}
