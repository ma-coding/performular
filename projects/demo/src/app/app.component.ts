import { Component } from '@angular/core';

import { Abstract, FormTypes, Performular } from '@performular/core';

import { CoreGroupProperty } from './group.component';
import { InputProperty } from './input.component';

export interface Props extends FormTypes {
    0: InputProperty;
    1: CoreGroupProperty<Props>;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public c: Abstract = new Performular<Props>({
        property: {
            id: 'group',
            type: 'group',
            framework: {
                field: 'coregroup',
                attrs: undefined
            },
            item: {
                flex: {
                    main: 100
                }
            },
            children: [
                {
                    id: 'test3',
                    type: 'control',
                    framework: {
                        field: 'input',
                        attrs: {
                            type: 'text'
                        }
                    },
                    focus: true,
                },
            ]
        },
        value: {
            test3: 5
        }
    }).form;

    constructor(
    ) {
        console.log(this.c);
    }
}
