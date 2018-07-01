import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Abstract, TContainer } from '../../models/abstract';
import { Container } from '../../models/container';
import { BuildContext, ContainerComponent, IPerformularOnInit } from '../../models/framework/decorator';

export const PERFORMULAR_FORMCOMPONENT_FIELDSET: 'fieldset' = 'fieldset';

export interface FieldsetAttrs {
    legend: string;
}

export type FieldsetStyles = 'fieldset' | 'legend';

export class Fieldset extends Container<FieldsetAttrs, FieldsetStyles> { }

export function FieldsetBuilder(context: BuildContext<TContainer>): Abstract {
    return new Fieldset(context.params);
}

@ContainerComponent({
    name: PERFORMULAR_FORMCOMPONENT_FIELDSET,
    builder: FieldsetBuilder
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
        fieldset {
            width: 100%
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FieldsetComponent implements IPerformularOnInit<Fieldset> {

    public field: Fieldset = <any>undefined;

    public performularOnInit(field: Fieldset): void {
        this.field = field;
    }
}
