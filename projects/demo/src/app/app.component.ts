import { Component } from '@angular/core';

import { FormBuilder, GroupField } from '../../../core/src/public_api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public group: GroupField<any>;
    // public group: CoreGroup = new CoreGroup({
    //     id: 'group',
    //     children: [
    //         new CoreFieldset({
    //             bindings: {
    //                 legend: 'test'
    //             },
    //             children: [
    //                 new CoreInput({
    //                     id: 'A',
    //                     bindings: {
    //                         type: InputValueType.number
    //                     },
    //                     value: 5
    //                 })
    //             ]
    //         })
    //     ]
    // });

    constructor(
        private _formBuilder: FormBuilder
    ) {
        this.group = this._formBuilder.create({
            id: 'group',
            type: 'GROUP',
            bindings: undefined,
            component: 'CORE_GROUP',
            children: [
                {
                    type: 'LAYOUT',
                    component: 'CORE_FIELDSET',
                    bindings: {
                        legend: 'test'
                    },
                    children: [
                        {
                            type: 'CONTROL',
                            component: 'CORE_INPUT',
                            id: 'AB',
                            bindings: {
                                type: 'number'
                            },
                            value: 5
                        }
                    ]
                }
            ]
        }) as GroupField<any>;
        this.group.value$.subscribe(console.log);
    }
}
