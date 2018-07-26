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
    Model,
    RemoveKey
} from '@performular/core';
import { PerformularModel } from '@performular/ng-common';
import { Subscription } from 'rxjs';
import {
    MaterialFormField,
    MaterialFormFieldAttrs,
    MaterialFormFieldTemplate
} from './form-field';

export const PERFORMULAR_MODEL_MATERIALTEXTAREA: string =
    'PERFORMULAR_MODEL_MATERIALTEXTAREA';

export interface MaterialTextareaAttrs extends MaterialFormFieldAttrs {
    readonly?: boolean;
    debounce?: number;
    autoResize?: boolean;
    maxRows?: number;
    minRows?: number;
}

export class MaterialTextarea extends ControlFieldModel<MaterialTextareaAttrs> {
    constructor(
        options: RemoveKey<
            ControlFieldModelOptions<MaterialTextareaAttrs>,
            'model'
        >
    ) {
        super({
            ...options,
            model: MaterialTextareaComponent
        });
    }
}

export function MaterialTextareaBuilder(
    options: ControlFieldModelOptions<MaterialTextareaAttrs>
): MaterialTextarea {
    return new MaterialTextarea(options);
}

@Model({
    name: PERFORMULAR_MODEL_MATERIALTEXTAREA,
    builder: MaterialTextareaBuilder
})
@Component({
    selector: 'performular-material-textarea',
    template: MaterialFormFieldTemplate(`
        <textarea matInput
        (input)="textareaValueHandler?.setValue($event.target.value)"
        [value]="field?.value$ | async"
        [matTextareaAutosize]="(field?.attrs$ | async)?.autoResize"
        [matAutosizeMaxRows]="(field?.attrs$ | async)?.maxRows"
        [matAutosizeMinRows]="(field?.attrs$ | async)?.minRows"
        [placeholder]="(field?.attrs$ | async)?.placeholder"
        [disabled]="field?.disabled$ | async"
        [readonly]="(field?.attrs$ | async)?.readonly">
        </textarea>
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
export class MaterialTextareaComponent
    extends MaterialFormField<MaterialTextarea>
    implements OnDestroy {
    private _textareaSub: Subscription | undefined;
    public textareaValueHandler: InputValueBuilder;

    constructor(@Inject(PerformularModel) public field: MaterialTextarea) {
        super(field);
        this.textareaValueHandler = new InputValueBuilder(
            'text',
            field.attrs.debounce || 0
        );
        this._textareaSub = this.textareaValueHandler.valueChanges.subscribe(
            (value: any) => {
                if (this.field) {
                    this.field.setValue(value);
                }
            }
        );
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this._textareaSub) {
            this._textareaSub.unsubscribe();
        }
    }
}
