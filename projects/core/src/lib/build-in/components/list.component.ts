import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Abstract, TList } from '../../models/abstract';
import { FormComponent, IBuildContext, IOnInitFramework } from '../../models/framework';
import { IList, List } from '../../models/list';
import { FormTypes } from '../../performular';

export const PERFORMULAR_FORMCOMPONENT_LIST: 'list' = 'list';

export type ICoreList<P extends FormTypes> = IList<typeof PERFORMULAR_FORMCOMPONENT_LIST, undefined, '', P>;
export type CoreList = List<typeof PERFORMULAR_FORMCOMPONENT_LIST, undefined, ''>;

@FormComponent<TList>({
    name: PERFORMULAR_FORMCOMPONENT_LIST,
    builder: (context: IBuildContext<TList>): Abstract => {
        return new List(context.params);
    }
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
export class CoreListComponent implements IOnInitFramework<CoreList> {

    public list: CoreList | undefined;

    public onInitFramework(field: CoreList): void {
        this.list = field;
    }
}
