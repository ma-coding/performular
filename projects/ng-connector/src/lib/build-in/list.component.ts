import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import {
    ListFieldModel,
    ListFieldModelOptions,
    Model,
    RemoveKey
} from '@performular/core';

import { PerformularModel } from '../performular.model';

export type CoreListAttrs = undefined;

export class CoreList extends ListFieldModel<CoreListAttrs> {
    constructor(
        options: RemoveKey<ListFieldModelOptions<CoreListAttrs>, 'model'>
    ) {
        super({
            ...options,
            model: CoreListComponent
        });
    }
}

export function CoreListBuilder(
    options: ListFieldModelOptions<CoreListAttrs>
): CoreList {
    return new CoreList(options);
}

export const PERFORMULAR_MODEL_LIST: string = 'PERFORMULAR_MODEL_LIST';

@Model({
    name: PERFORMULAR_MODEL_LIST,
    builder: CoreListBuilder
})
@Component({
    selector: 'performular-list',
    template: `
    <ng-container *ngFor="let child of field?.children$ | async" [performularRenderer]="child"></ng-container>
        `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreListComponent {
    constructor(@Inject(PerformularModel) public field: CoreList) {}
}
