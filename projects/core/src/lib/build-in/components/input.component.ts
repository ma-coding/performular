import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Abstract, TControl } from '../../models/abstract';
import { Control, IControl } from '../../models/control';
import { FormComponent, IBuildContext, IOnInitFramework } from '../../models/framework';
import { InputValueHandler } from '../cdk/input-value-handler';

export const PERFORMULAR_FORMCOMPONENT_INPUT: 'input' = 'input';

export interface InputAttrs {
    type: string;
    debounce?: number;
}

export type InputStyles = 'input';

export type IInput = IControl<typeof PERFORMULAR_FORMCOMPONENT_INPUT, InputAttrs, InputStyles>;

export class Input extends Control<typeof PERFORMULAR_FORMCOMPONENT_INPUT, InputAttrs, InputStyles> {
    public patchValue(value: any, emitUpdate: boolean = true): void {
        super.patchValue(InputValueHandler.validateValue(value, this.attrs.type), emitUpdate);
    }

    public setValue(value: any, emitUpdate: boolean = true): void {
        super.setValue(InputValueHandler.validateValue(value, this.attrs.type), emitUpdate);
    }
}

@FormComponent<TControl>({
    name: PERFORMULAR_FORMCOMPONENT_INPUT,
    builder: (context: IBuildContext<TControl>): Abstract => {
        return new Input(context.params);
    }
})
@Component({
    selector: 'performular-input',
    template: `<input
        [id]="field?.uuid"
        [value]="field?.value$ | async"
        (input)="inputValueHandler.setValue($event.target.value)"
        [ngStyle]="(field?.styles$ | async)?.input"
        [type]="(field?.attrs$ | async).type"
        style="width: 100%">`,
    styles: [`
        :host {
            width: 100%;
            display: block;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InputComponent implements IOnInitFramework<Input>, OnDestroy {

    private _inputSub: Subscription | undefined;

    public field: Input = <any>undefined;
    public inputValueHandler: InputValueHandler = <any>undefined;

    public ngOnDestroy(): void {
        if (this._inputSub) {
            this._inputSub.unsubscribe();
        }
    }

    public onInitFramework(field: Input): void {
        this.field = field;
        this.inputValueHandler = new InputValueHandler(field.attrs.type, field.attrs.debounce || 0);
        this._inputSub = this.inputValueHandler.valueChanges
            .subscribe((value: any) => {
                this.field.setValue(value);
            });
    }
}
