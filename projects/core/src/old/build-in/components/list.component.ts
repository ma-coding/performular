import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Abstract, TList } from '../../models/abstract';
import { BuildContext, IPerformularOnInit, ListComponent } from '../../models/framework/decorator';
import { List } from '../../models/list';

export const PERFORMULAR_FORMCOMPONENT_LIST: 'list' = 'list';

export type CoreList = List<any, ''>;

export function ListBuilder(context: BuildContext<TList>): Abstract {
    return new List(context.params);
}

@ListComponent({
    name: PERFORMULAR_FORMCOMPONENT_LIST,
    builder: ListBuilder
})
@Component({
    selector: 'performular-list',
    template: `
    <ng-container *ngFor="let child of list?.children$ | async">
        <ng-container [performularRenderer]="child"></ng-container>
    </ng-container>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreListComponent implements IPerformularOnInit<CoreList> {

    public list: CoreList | undefined;

    public performularOnInit(field: CoreList): void {
        this.list = field;
    }
}
