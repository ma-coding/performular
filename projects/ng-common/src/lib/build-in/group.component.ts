import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { GroupFieldModel, GroupFieldModelOptions, Model } from '@performular/core';

import { PerformularModel } from '../performular.model';

export type CoreGroupAttrs = undefined;

export class CoreGroup extends GroupFieldModel<CoreGroupAttrs> {}

export function CoreGroupBuilder(
    options: GroupFieldModelOptions<CoreGroupAttrs>
): CoreGroup {
    return new CoreGroup(options);
}

export const PERFORMULAR_MODEL_CORE_GROUP: string =
    'PERFORMULAR_MODEL_CORE_GROUP';

@Model({
    name: PERFORMULAR_MODEL_CORE_GROUP,
    builder: CoreGroupBuilder
})
@Component({
    selector: 'performular-core-group',
    template: `
    <ng-container *ngFor="let child of field?.children$ | async" [performularRenderer]="child"></ng-container>
        `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreGroupComponent {
    constructor(@Inject(PerformularModel) public field: CoreGroup) {}
}
