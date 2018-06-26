import { Component } from '@angular/core';

import { CoreGroup } from '../../../core/src/lib/build-in/components/group.component';
import { Performular } from '../../../core/src/lib/form/form';
import { IEffectProperty } from '../../../core/src/lib/models/effects/effect';
import { EffectTypes } from '../../../core/src/lib/utils/misc';

export interface ETypes extends EffectTypes {
    0: IEffectProperty<'required', number>;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor() {
        const g: CoreGroup = <CoreGroup>Performular.build({
            value: {
                test: 10,
                test2: 90,
                test3: 490,
                lst: [15, 20]
            },
            form: {
                id: 'g',
                attrs: undefined,
                field: 'group',
                type: 'group',
                children: [
                    {
                        id: 'test',
                        attrs: {
                            type: 'text'
                        },
                        field: 'input',
                        type: 'control',
                        focus: true
                    }, {
                        id: 'fieldg',
                        attrs: {
                            legend: 'test'
                        },
                        field: 'fieldset',
                        type: 'container',
                        children: [
                            {
                                id: 'test2',
                                attrs: {
                                    type: 'text'
                                },
                                field: 'input',
                                type: 'control'
                            }, {
                                id: 'fieldg2',
                                attrs: {
                                    legend: 'test'
                                },
                                field: 'fieldset',
                                type: 'container',
                                children: [
                                    {
                                        id: 'test3',
                                        attrs: {
                                            type: 'text'
                                        },
                                        field: 'input',
                                        type: 'control'
                                    }, {
                                        id: 'lst',
                                        type: 'list',
                                        field: 'list',
                                        attrs: undefined,
                                        childDef: {
                                            id: 'fieldg2',
                                            attrs: {
                                                legend: 'test'
                                            },
                                            field: 'fieldset',
                                            type: 'container',
                                            children: [{
                                                id: 'test4',
                                                attrs: {
                                                    type: 'text'
                                                },
                                                field: 'input',
                                                type: 'control'
                                            }]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
        console.log(g);
    }

}
