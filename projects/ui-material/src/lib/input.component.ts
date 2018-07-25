import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnDestroy
} from '@angular/core';
import {
    ControlFieldModel,
    ControlFieldModelOptions,
    InputValueBuilder,
    Model
} from '@performular/core';
import { PerformularModel } from '@performular/ng-common';
import { Subscription } from 'rxjs';
import {
    MaterialFormField,
    MaterialFormFieldAttrs,
    MaterialFormFieldTemplate
} from './form-field';

export const PERFORMULAR_MODEL_MATERIALINPUT: string =
    'PERFORMULAR_MODEL_MATERIALINPUT';

export interface MaterialInputAttrs extends MaterialFormFieldAttrs {
    readonly?: boolean;
    type: string;
    debounce?: number;
}

export class MaterialInput extends ControlFieldModel<MaterialInputAttrs> {
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

export function MaterialInputBuilder(
    options: ControlFieldModelOptions<MaterialInputAttrs>
): MaterialInput {
    return new MaterialInput(options);
}

@Model({
    name: PERFORMULAR_MODEL_MATERIALINPUT,
    builder: MaterialInputBuilder
})
@Component({
    selector: 'performular-material-input',
    template: MaterialFormFieldTemplate(`
        <input matInput
        (input)="inputValueHandler?.setValue($event.target.value)"
        [value]="field?.value"
        [type]="(field?.attrs$ | async)?.type"
        [placeholder]="(field?.attrs$ | async)?.placeholder"
        [disabled]="field?.disabled$ | async"
        [readonly]="(field?.attrs$ | async)?.readonly">
        `),
    styles: [
        `
            :host {
                width: 100%;
                display: block;
            }
            mat-form-field {
                width: 100%;
                display: block;
            }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialInputComponent extends MaterialFormField<MaterialInput>
    implements OnDestroy {
    private _inputSub: Subscription | undefined;
    public inputValueHandler: InputValueBuilder;

    constructor(@Inject(PerformularModel) public field: MaterialInput) {
        super(field);
        this.inputValueHandler = new InputValueBuilder(
            field.attrs.type,
            field.attrs.debounce || 0
        );
        this._inputSub = this.inputValueHandler.valueChanges.subscribe(
            (value: any) => {
                if (this.field) {
                    this.field.setValue(value);
                }
            }
        );
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this._inputSub) {
            this._inputSub.unsubscribe();
        }
    }
}
