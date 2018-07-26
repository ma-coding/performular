import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnDestroy
} from '@angular/core';
import { ThemePalette } from '@angular/material';
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

export const PERFORMULAR_MODEL_MATERIALDATEPICKER: string =
    'PERFORMULAR_MODEL_MATERIALDATEPICKER';

export interface MaterialDatepickerAttrs extends MaterialFormFieldAttrs {
    readonly?: boolean;
    debounce?: number;
    calendarColor?: ThemePalette;
    calendarDisabled?: boolean;
    buttonDisabled?: boolean;
    opened?: boolean;
    panelClass?: string | string[];
    startAt?: Date | null;
    startView?: 'month' | 'year';
    touchUi?: boolean;
}

export class MaterialDatepicker extends ControlFieldModel<
    MaterialDatepickerAttrs
> {
    constructor(
        options: RemoveKey<
            ControlFieldModelOptions<MaterialDatepickerAttrs>,
            'model'
        >
    ) {
        super({
            ...options,
            model: MaterialDatepickerComponent,
            attrs: {
                ...options.attrs,
                startView: options.attrs.startView || 'month'
            }
        });
    }
}

export function MaterialDatepickerBuilder(
    options: ControlFieldModelOptions<MaterialDatepickerAttrs>
): MaterialDatepicker {
    return new MaterialDatepicker(options);
}

@Model({
    name: PERFORMULAR_MODEL_MATERIALDATEPICKER,
    builder: MaterialDatepickerBuilder
})
@Component({
    selector: 'performular-material-datepicker',
    template: MaterialFormFieldTemplate(`
        <input matInput
        [matDatepicker]="picker"
        (dateChange)="datepickerValueHandler?.setValue($event.value)"
        [value]="field?.value$ | async"
        [placeholder]="(field?.attrs$ | async)?.placeholder"
        [disabled]="field?.disabled$ | async"
        [readonly]="(field?.attrs$ | async)?.readonly">
        <mat-datepicker-toggle matSuffix
            [disabled]="(field?.attrs$ | async)?.buttonDisabled || (field?.disabled$ | async)"
            [for]="picker">
        </mat-datepicker-toggle>
        <mat-datepicker #picker
                   [opened]="(field?.attrs$ | async)?.opened"
                   [startView]="(field?.attrs$ | async)?.startView"
                   [panelClass]="(field?.attrs$ | async)?.panelClass"
                   [touchUi]="(field?.attrs$ | async)?.touchUi"
                   [disabled]="(field?.attrs$ | async)?.calendarDisabled || (field?.disabled$ | async)"
                   [startAt]="(field?.attrs$ | async)?.startAt">
        </mat-datepicker>
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
export class MaterialDatepickerComponent
    extends MaterialFormField<MaterialDatepicker>
    implements OnDestroy {
    private _datepickerSub: Subscription | undefined;

    public datepickerValueHandler: InputValueBuilder;

    constructor(@Inject(PerformularModel) public field: MaterialDatepicker) {
        super(field);
        this.datepickerValueHandler = new InputValueBuilder(
            'date',
            field.attrs.debounce || 0
        );
        this._datepickerSub = this.datepickerValueHandler.valueChanges.subscribe(
            (value: any) => {
                if (this.field) {
                    this.field.setValue(value);
                }
            }
        );
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this._datepickerSub) {
            this._datepickerSub.unsubscribe();
        }
    }
}
