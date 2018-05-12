import { ChangeDetectorRef, Component } from '@angular/core';

import { IGroupSchema } from 'dist/core/lib/schemas/group.schema';
import { ILayoutSchema } from 'dist/core/lib/schemas/layout.schema';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { IControlSchema, TriggerAction } from '../../../core/src/lib/schemas';
import { SchemaBuilder } from '../../../core/src/public_api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public schema$: BehaviorSubject<any | undefined>;

    public config: string;

    constructor(
        private _cd: ChangeDetectorRef
    ) {
        const config: IGroupSchema = {
            id: 'main',
            component: 'Group',
            bindings: {},
            children: [
                <ILayoutSchema>{
                    component: 'Fieldset',
                    bindings: {
                        legend: 'test'
                    },
                    children: [
                        <IControlSchema>{
                            id: 'test',
                            component: 'Input',
                            bindings: {
                                type: 'text'
                            },
                            focus: true,
                            value: 5,
                            effects: [
                                {
                                    type: 'Required',
                                    action: TriggerAction.Error,
                                    errorMsg: 'FEHLER'
                                }, {
                                    type: 'Min',
                                    action: TriggerAction.Error,
                                    errorMsg: 'FEHLER',
                                    params: 5
                                }
                            ]
                        },
                        <IControlSchema>{
                            id: 'test2',
                            component: 'Input',
                            bindings: {
                                type: 'number'
                            },
                            value: 5
                        }
                    ]
                }
            ]
        };
        this.config = JSON.stringify(config, undefined, 4);
        this.schema$ = new BehaviorSubject(SchemaBuilder.create(config));
        this.schema$.pipe(
            switchMap((schema: any) => schema.errors$)
        ).subscribe(console.log);
    }

    public changed(): void {
        try {
            const config: any = JSON.parse(this.config);
            this.schema$.next(SchemaBuilder.create(config));
            this.config = JSON.stringify(config, undefined, 4);
            this._cd.markForCheck();
        } catch (err) {
            console.log(err);
        }
    }

    public log(): void {
        console.log(this.schema$.getValue());
    }
}
