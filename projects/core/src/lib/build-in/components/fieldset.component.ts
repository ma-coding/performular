import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Subscription } from 'rxjs';

import { Abstract, TContainer } from '../../models/abstract';
import { Container } from '../../models/container';
import { BuildContext, ContainerComponent, IPerformularOnInit } from '../../models/framework/decorator';

export const PERFORMULAR_FORMCOMPONENT_FIELDSET: 'fieldset' = 'fieldset';

export interface FieldsetAttrs {
    legend: string;
}

export type FieldsetStyles = 'fieldset' | 'legend';

export class Fieldset extends Container<FieldsetAttrs, FieldsetStyles> { }

@ContainerComponent({
    name: PERFORMULAR_FORMCOMPONENT_FIELDSET,
    builder: (context: BuildContext<TContainer>): Abstract => {
        return new Fieldset(context.params);
    }
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

export class FieldsetComponent implements IPerformularOnInit<Fieldset> {

    private _textareaSub: Subscription | undefined;

    public field: Fieldset = <any>undefined;

    public performularOnInit(field: Fieldset): void {
        this.field = field;
    }
}
