import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
    ContainerModel,
    ContainerModelOptions,
    Model,
    RemoveKey
} from '@performular/core';
import { PerformularModel } from '../performular.model';

export interface FieldsetAttrs {
    legend: string;
}

export class Fieldset extends ContainerModel<FieldsetAttrs> {
    constructor(
        options: RemoveKey<ContainerModelOptions<FieldsetAttrs>, 'model'>
    ) {
        super({
            ...options,
            model: FieldsetComponent
        });
    }
}

export function FieldsetBuilder(
    options: ContainerModelOptions<FieldsetAttrs>
): Fieldset {
    return new Fieldset(options);
}

export const PERFORMULAR_MODEL_FIELDSET: string = 'PERFORMULAR_MODEL_FIELDSET';

@Model({
    name: PERFORMULAR_MODEL_FIELDSET,
    builder: FieldsetBuilder
})
@Component({
    selector: 'performular-fieldset',
    template: `
        <fieldset [id]="field?.uuid">
            <legend>{{ (field?.attrs$ | async)?.legend }}</legend>
            <ng-container
                *ngFor="let child of (field?.children$ | async)"
                [performularRenderer]="child"
            ></ng-container>
        </fieldset>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldsetComponent {
    constructor(@Inject(PerformularModel) public field: Fieldset) {}
}
