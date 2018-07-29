import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatRadioChange, ThemePalette } from '@angular/material';

import { Observable } from 'rxjs';
import {
    ControlFieldModel,
    ControlFieldModelOptions,
    Model,
    RemoveKey,
    DataOption,
    DataConnection,
    DataConnectionOptions
} from '@performular/core';
import { PerformularModel } from '@performular/ng-connector';

export const PERFORMULAR_MODEL_MATERIALRADIO: string =
    'PERFORMULAR_MODEL_MATERIALRADIO';

export interface MaterialRadioAttrs {
    labelPosition?: 'before' | 'after';
    name?: string;
    color?: ThemePalette;
    buttonDirection?: 'vertical' | 'horizontal';
    options: DataConnectionOptions;
}

export class MaterialRadio extends ControlFieldModel<MaterialRadioAttrs> {
    public dataConnection: DataConnection;

    constructor(
        options: RemoveKey<
            ControlFieldModelOptions<MaterialRadioAttrs>,
            'model'
        >
    ) {
        super({
            ...options,
            model: MaterialRadioComponent
        });
        this.dataConnection = new DataConnection(options.attrs.options);
    }
}

export function MaterialRadioBuilder(
    options: ControlFieldModelOptions<MaterialRadioAttrs>
): MaterialRadio {
    return new MaterialRadio(options);
}

@Model({
    name: PERFORMULAR_MODEL_MATERIALRADIO,
    builder: MaterialRadioBuilder
})
@Component({
    selector: 'performular-material-radio',
    template: `
    <mat-radio-group
        (change)="change($event)"
        [name]="(field?.attrs$ | async)?.name"
        [value]="field?.value$ | async"
        [disabled]="field.disabled$ | async"
        [fxLayout]="field?.attrs.buttonDirection === 'vertical' ? 'column' : 'row'">
            <ng-container *ngFor="let option of options | async">
                <mat-radio-button [ngClass]="field?.attrs.buttonDirection === 'vertical' ? 'vertical' : 'horizontal'"
                    *ngIf="!(option.hidden$ | async)"
                    [disabled]="option.disabled$ | async"
                    [color]="(field?.attrs$ | async)?.color"
                    [value]="option.value">
                    <span>{{ option.viewValue }}</span>
                </mat-radio-button>
            </ng-container>
    </mat-radio-group>
    `,
    styles: [
        `
            :host {
                width: 100%;
                display: block;
            }
            mat-radio-group {
                width: 100%;
                display: block;
                padding-top: 12px;
                padding-bottom: 12px;
            }
            .vertical {
                padding-bottom: 9px;
            }
            .horizontal {
                padding-right: 9px;
            }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialRadioComponent {
    public options: Observable<DataOption[]>;

    constructor(@Inject(PerformularModel) public field: MaterialRadio) {
        this.options = this.field.dataConnection.getData$(this.field);
    }

    public change(event: MatRadioChange): void {
        this.field.setValue(event.value);
    }
}
