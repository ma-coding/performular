import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Subscription } from 'rxjs';

import { Container, IContainer } from '../../models/container';
import { FormComponent, IOnInitFramework } from '../../models/framework';

export const PERFORMULAR_FORMCOMPONENT_FIELDSET: 'fieldset' = 'fieldset';

export interface FieldsetAttrs {
    legend: string;
}

export type FieldsetStyles = 'fieldset' | 'legend';

export type IFieldset = IContainer<typeof PERFORMULAR_FORMCOMPONENT_FIELDSET, FieldsetAttrs, FieldsetStyles>;
export type Fieldset = Container<typeof PERFORMULAR_FORMCOMPONENT_FIELDSET, FieldsetAttrs, FieldsetStyles>;

@FormComponent({
    name: PERFORMULAR_FORMCOMPONENT_FIELDSET
})
@Component({
    selector: 'performular-fieldset',
    template: `<fieldset [id]="field?.uuid">
                    <legend>{{(field?.attrs$ | async)?.legend}}</legend>
                    <ng-container *ngFor="let child of field?.children$ | async">
                        <ng-container [performularRenderer]="child"></ng-container>
                    </ng-container>
               </fieldset>`,
    styles: [`
        :host {
            width: 100%;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FieldsetComponent implements IOnInitFramework<Fieldset> {

    private _textareaSub: Subscription | undefined;

    public field: Fieldset = <any>undefined;

    public onInitFramework(field: Fieldset): void {
        this.field = field;
    }
}
