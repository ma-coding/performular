import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Abstract, TControl } from '../../models/abstract';
import { Control } from '../../models/control';
import { BuildContext, ControlComponent, IPerformularOnInit } from '../../models/framework/decorator';
import { InputValueHandler } from '../cdk/input-value-handler';

export const PERFORMULAR_FORMCOMPONENT_INPUT: 'input' = 'input';

export interface InputAttrs {
    type: string;
    debounce?: number;
}

export type InputStyles = 'input';

export class Input extends Control<InputAttrs, InputStyles> {

    public patchValue(value: any, emitUpdate: boolean = true): void {
        super.patchValue(InputValueHandler.validateValue(value, this.attrs.type), emitUpdate);
    }

    public setValue(value: any, emitUpdate: boolean = true): void {
        super.setValue(InputValueHandler.validateValue(value, this.attrs.type), emitUpdate);
    }
}

export function InputBuilder(context: BuildContext<TControl>): Abstract {
    return new Input(context.params);
}

@ControlComponent({
    name: PERFORMULAR_FORMCOMPONENT_INPUT,
    builder: InputBuilder
})
@Component({
    selector: 'performular-input',
    template: `<input
        [id]="field?.uuid"
        [value]="field?.value$ | async"
        (input)="inputValueHandler?.setValue($event.target.value)"
        [ngStyle]="(field?.styles$ | async)?.input"
        [type]="(field?.attrs$ | async)?.type">`,
    styles: [`
        :host {
            width: 100%;
            display: block;
        }
        input {
            width: 100%;
            box-sizing: border-box;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InputComponent implements IPerformularOnInit<Input>, OnDestroy {

    private _inputSub: Subscription | undefined;

    public field: Input = <any>undefined;
    public inputValueHandler: InputValueHandler = <any>undefined;

    public ngOnDestroy(): void {
        if (this._inputSub) {
            this._inputSub.unsubscribe();
        }
    }

    public performularOnInit(field: Input): void {
        this.field = field;
        this.inputValueHandler = new InputValueHandler(field.attrs.type, field.attrs.debounce || 0);
        this._inputSub = this.inputValueHandler.valueChanges
            .subscribe((value: any) => {
                this.field.setValue(value);
            });
    }
}
