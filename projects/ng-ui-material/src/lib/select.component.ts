import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    Inject
} from '@angular/core';
import { MatSelectChange } from '@angular/material';

import { Observable } from 'rxjs';
import {
    MaterialFormFieldAttrs,
    MaterialFormFieldTemplate,
    MaterialFormField
} from './form-field';
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

export const PERFORMULAR_MODEL_MATERIALSELECT: string =
    'PERFORMULAR_MODEL_MATERIALSELECT';

export interface MaterialSelectAttrs extends MaterialFormFieldAttrs {
    addNoneValue?: boolean;
    ariaLabel?: string;
    ariaLabelledby?: string;
    disableOptionCentering?: boolean;
    disableRipple?: boolean;
    multiple?: boolean;
    panelClass?: string | string[] | Set<string> | { [key: string]: any };
    options: DataConnectionOptions;
}

export class MaterialSelect extends ControlFieldModel<MaterialSelectAttrs> {
    public dataConnection: DataConnection;

    constructor(
        options: RemoveKey<
            ControlFieldModelOptions<MaterialSelectAttrs>,
            'model'
        >
    ) {
        super({
            ...options,
            model: MaterialSelectComponent
        });
        this.dataConnection = new DataConnection(options.attrs.options);
    }
}

export function MaterialSelectBuilder(
    options: ControlFieldModelOptions<MaterialSelectAttrs>
): MaterialSelect {
    return new MaterialSelect(options);
}

@Model({
    name: PERFORMULAR_MODEL_MATERIALSELECT,
    builder: MaterialSelectBuilder
})
@Component({
    selector: 'performular-material-select',
    template: MaterialFormFieldTemplate(`
            <mat-select
                (selectionChange)="change($event)"
                [disabled]="(field?.disabled$ | async)"
                [value]="field?.value$ | async"
                [disableOptionCentering]="(field?.attrs$ | async)?.disableOptionCentering"
                [disableRipple]="(field?.attrs$ | async)?.disableRipple"
                [multiple]="(field?.attrs$ | async)?.multiple"
                [panelClass]="(field?.attrs$ | async)?.panelClass"
                [placeholder]="(field?.attrs$ | async)?.placeholder">
                <mat-option *ngIf="(field?.attrs$ | async)?.addNoneValue && !(field?.attrs$ | async)?.multiple">--</mat-option>
                <ng-container *ngFor="let option of options | async">
                    <mat-option
                        *ngIf="!(option.hidden$ | async)"
                        [disabled]="option.disabled$ | async"
                        [value]="option.value">
                        <span>{{ option.viewValue }}</span>
                    </mat-option>
                </ng-container>
            </mat-select>
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
export class MaterialSelectComponent extends MaterialFormField<MaterialSelect>
    implements OnDestroy {
    public options: Observable<DataOption[]>;

    constructor(@Inject(PerformularModel) public field: MaterialSelect) {
        super(field);
        this.options = this.field.dataConnection.getData$(this.field);
    }

    public change(event: MatSelectChange): void {
        this.field.setValue(event.value);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
