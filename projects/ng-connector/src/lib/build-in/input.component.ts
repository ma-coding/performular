import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnDestroy
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
    ControlFieldModel,
    ControlFieldModelOptions,
    InputValueBuilder,
    Model,
    RemoveKey
} from '@performular/core';

import { PerformularModel } from '../performular.model';

export interface InputAttrs {
    type: string;
    debounce?: number;
}

export class Input extends ControlFieldModel<InputAttrs> {
    constructor(
        options: RemoveKey<ControlFieldModelOptions<InputAttrs>, 'model'>
    ) {
        super({
            ...options,
            model: InputComponent
        });
    }

    public patchValue(value: any, emitUpdate: boolean = true): void {
        super.patchValue(
            InputValueBuilder.validateValue(value, this.attrs.type),
            emitUpdate
        );
    }

    public setValue(value: any, emitUpdate: boolean = true): void {
        super.setValue(
            InputValueBuilder.validateValue(value, this.attrs.type),
            emitUpdate
        );
    }
}

export function InputBuilder(
    options: ControlFieldModelOptions<InputAttrs>
): Input {
    return new Input(options);
}

export const PERFORMULAR_MODEL_INPUT: string = 'PERFORMULAR_MODEL_INPUT';

@Model({
    name: PERFORMULAR_MODEL_INPUT,
    builder: InputBuilder
})
@Component({
    selector: 'performular-input',
    template: `
    <input
        [id]="field?.uuid"
        [value]="field?.value$ | async"
        (input)="inputValueBuilder?.setValue($event.target.value)"
        [type]="(field?.attrs$ | async)?.type">
        `,
    styles: [
        `
            input {
                width: 100%;
                box-sizing: border-box;
            }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnDestroy {
    private _destroyed$: Subject<void> = new Subject();
    public inputValueBuilder: InputValueBuilder;

    constructor(@Inject(PerformularModel) public field: Input) {
        this.inputValueBuilder = new InputValueBuilder(
            field.attrs.type,
            field.attrs.debounce || 0
        );
        this.inputValueBuilder.valueChanges
            .pipe(takeUntil(this._destroyed$))
            .subscribe((value: any) => {
                this.field.setValue(value);
            });
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
    }
}
