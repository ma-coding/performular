import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Schema, SchemaType } from '../../decorators';
import { IOnSchemaInit } from '../../loaders';
import { ControlSchema } from '../../schemas';

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

@Schema({
    id: 'Input',
    type: SchemaType.Control
})
@Component({
    selector: 'performular-core-input',
    template: `
        <input
            [id]="control?.id$ | async"
            [performularAutoFocus]="control?.focus$ | async"
            [placeholder]="(control?.bindings$ | async)?.placeholder"
            [type]="(control?.bindings$ | async)?.type"
            [readonly]="(control?.bindings$ | async)?.readonly"
            [value]="control?.value$ | async"
            [disabled]="control?.disabled$ | async"
            (input)="onInput($event)">
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreInputComponent implements IOnSchemaInit, OnDestroy {

    private _valueChanged$: Subject<any> = new Subject();
    private _valueChangedSubscription: Subscription | undefined;
    public control: ControlSchema | undefined;

    constructor() {
        this._valueChangedSubscription = this._valueChanged$.pipe(
            // tslint:disable-next-line:no-magic-numbers
            debounceTime(200)
        ).subscribe((value: any) => this.control ? this.control.setValue(value) : null);
    }

    public onSchemaInit(control: ControlSchema): void {
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
        if (this.control && newValue !== this.control.value) {
            const type: string = this.control.bindings ? this.control.bindings.type : 'text';
            this._valueChanged$.next(convertInputTypeValue(newValue, type));
        }
    }
}
