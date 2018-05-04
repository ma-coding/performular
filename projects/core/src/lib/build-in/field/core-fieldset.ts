import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IOnInitField } from '../../core/loaders/component-loader';
import { RemoveKeys } from '../../core/misc/remove-keys';
import { FormField } from '../../decorators/field.decorator';
import { ILayoutFieldInitState, LayoutField } from '../../fields/layout-field';

@FormField({
    key: 'CORE_FIELDSET'
})
@Component({
    selector: 'performular-core-fieldset',
    template: `
    <fieldset [id]="layout?.id$ | async">
        <legend>{{(layout?.bindings$ | async)?.legend}}</legend>
        <ng-container *ngFor="let child of layout?.children$ | async">
            <ng-container performularField [field]="child"></ng-container>
        </ng-container>
    </fieldset>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreFieldsetComponent implements IOnInitField<CoreFieldset> {

    public layout: CoreFieldset | undefined;

    public performularOnInit(field: CoreFieldset): void {
        this.layout = field;
    }
}

export interface ICoreFieldsetBindings {
    legend: string;
}

export type ICoreFieldset = RemoveKeys<ILayoutFieldInitState<ICoreFieldsetBindings>, 'component'>;

export class CoreFieldset extends LayoutField<ICoreFieldsetBindings> {
    constructor(initial: ICoreFieldset) {
        super({
            ...initial,
            component: CoreFieldsetComponent
        });
    }
}
