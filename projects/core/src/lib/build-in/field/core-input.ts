import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IOnInitField } from '../../core/loaders/component-loader';
import { RemoveKeys } from '../../core/misc/remove-keys';
import { FormField } from '../../decorators/field.decorator';
import { ControlField, IControlFieldInitState } from '../../fields/control-field';

export enum InputValueType {
    text = 'text',
    number = 'number'
}

export function convertInputTypeValue(value: any, type: InputValueType): any {
    if (type === InputValueType.number) {
        const numValue: number = parseFloat(value);
        if (numValue !== NaN) {
            return numValue;
        }
    }
    return value;
}

@FormField({
    key: 'CORE_INPUT'
})
@Component({
    selector: 'performular-core-input',
    template: `
        <input
            [id]="field?.id$ | async"
            [performularAutoFocus]="field?.focus$ | async"
            [type]="(field?.bindings$ | async)?.type"
            [value]="field?.value$ | async"
            [disabled]="field?.disabled$ | async"
            (input)="onInput($event)">
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreInputComponent implements IOnInitField<CoreInput>, OnDestroy {

    private _valueChanged$: Subject<any> = new Subject();
    private _valueChangedSubscription: Subscription | undefined;
    public field: CoreInput | undefined;

    constructor() {
        this._valueChangedSubscription = this._valueChanged$.pipe(
            // tslint:disable-next-line:no-magic-numbers
            debounceTime(200)
        ).subscribe((value: any) => this.field ? this.field.setValue(value) : null);
    }

    public performularOnInit(field: CoreInput): void {
        this.field = field;
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
        if (this.field && newValue !== this.field.value) {
            const type: InputValueType = this.field.bindings ? this.field.bindings.type : InputValueType.text;
            this._valueChanged$.next(convertInputTypeValue(newValue, type));
        }
    }
}

export interface ICoreInputBindings {
    type: InputValueType;
}

export type ICoreInput = RemoveKeys<IControlFieldInitState<ICoreInputBindings>, 'component'>;

export class CoreInput extends ControlField<ICoreInputBindings> {
    constructor(initial: ICoreInput) {
        super({
            ...initial,
            component: CoreInputComponent
        });
    }
}
