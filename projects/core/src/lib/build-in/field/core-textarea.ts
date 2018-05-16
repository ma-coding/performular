import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Field, IOnInitField } from '../../handler/field.handler';
import { ControlSchema } from '../../schemas/schemas';

export interface ICoreTextarea {
    placeholder?: string;
    cols?: number;
    rows?: number;
    readonly?: boolean;
}

@Field({
    id: 'Textarea'
})
@Component({
    selector: 'performular-core-textarea',
    template: `
        <textarea
            [id]="control?.get$('id') | async"
            [performularAutoFocus]="control?.get$('focus') | async"
            [value]="control?.get$('value') | async"
            [disabled]="control?.get$('disabled') | async"
            [placeholder]="(control?.get$('bindings') | async)?.placeholder"
            [cols]="(control?.get$('bindings') | async)?.cols"
            [rows]="(control?.get$('bindings') | async)?.rows"
            [readonly]="(control?.get$('bindings') | async)?.readonly"
            (input)="onInput($event)"></textarea>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreTextareaComponent implements IOnInitField, OnDestroy {

    private _valueChanged$: Subject<any> = new Subject();
    private _valueChangedSubscription: Subscription | undefined;
    public control: ControlSchema<ICoreTextarea> | undefined;

    constructor() {
        this._valueChangedSubscription = this._valueChanged$.pipe(
            // tslint:disable-next-line:no-magic-numbers
            debounceTime(200)
        ).subscribe((value: any) => this.control ? this.control.setValue(value) : null);
    }

    public onInitField(control: ControlSchema<ICoreTextarea>): void {
        this.control = control;
    }

    public ngOnDestroy(): void {
        if (this._valueChangedSubscription) {
            this._valueChangedSubscription.unsubscribe();
        }
    }

    public onInput(event: KeyboardEvent): void {
        const newValue: any = (<any>event.target).value;
        this._valueChanged$.next(newValue);
    }
}
