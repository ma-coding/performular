import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatCheckboxChange, ThemePalette } from '@angular/material';
import {
    ControlFieldModel,
    ControlFieldModelOptions,
    Model,
    RemoveKey
} from '@performular/core';
import { PerformularModel } from '@performular/ng-connector';

export const PERFORMULAR_MODEL_MATERIALCHECKBOX: string =
    'PERFORMULAR_MODEL_MATERIALCHECKBOX';

export interface MaterialCheckboxAttrs {
    ariaLabel?: string;
    ariaLabelledby?: string;
    disableRipple?: boolean;
    labelPosition?: 'before' | 'after';
    name?: string | null;
    placeholder?: string;
    color?: ThemePalette;
}

export class MaterialCheckbox extends ControlFieldModel<MaterialCheckboxAttrs> {
    constructor(
        options: RemoveKey<
            ControlFieldModelOptions<MaterialCheckboxAttrs>,
            'model'
        >
    ) {
        super({
            ...options,
            model: MaterialCheckboxComponent
        });
    }
}

export function MaterialCheckboxBuilder(
    options: ControlFieldModelOptions<MaterialCheckboxAttrs>
): MaterialCheckbox {
    return new MaterialCheckbox(options);
}

export function MaterialCheckboxEmptyValue(): any {
    return false;
}

@Model({
    name: PERFORMULAR_MODEL_MATERIALCHECKBOX,
    builder: MaterialCheckboxBuilder,
    emptyValue: MaterialCheckboxEmptyValue
})
@Component({
    selector: 'performular-material-checkbox',
    template: `
        <mat-checkbox
            [disabled]="field?.disabled$ | async"
            [aria-label]="(field?.attrs$ | async)?.ariaLabel"
            [aria-labelledby]="(field?.attrs$ | async)?.ariaLabelledby"
            [disableRipple]="(field?.attrs$ | async)?.disableRipple"
            [color]="(field?.attrs$ | async)?.color"
            [labelPosition]="(field?.attrs$ | async)?.labelPosition"
            [name]="(field?.attrs$ | async)?.name"
            (change)="change($event)"
            [value]="field?.value$ | async"
            [checked]="field?.value"
        >
            <span>
                {{ (field?.attrs$ | async)?.placeholder }}
            </span>
        </mat-checkbox>
    `,
    styles: [
        `
            :host {
                width: 100%;
                display: block;
            }
            mat-checkbox {
                width: 100%;
                display: block;
                padding-top: 12px;
                padding-bottom: 12px;
            }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialCheckboxComponent {
    constructor(@Inject(PerformularModel) public field: MaterialCheckbox) {}

    public change(event: MatCheckboxChange): void {
        this.field.setValue(event.checked);
    }
}
