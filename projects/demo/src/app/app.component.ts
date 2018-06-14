import { Component } from '@angular/core';

import { Control } from '../../../core/src/lib/models/control';
import { Group } from '../../../core/src/lib/models/group';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor() {
        const g: Group = new Group({
            id: 'g',
            attrs: null,
            field: 'f',
            options: {},
            type: 'group',
            value: null,
            children: [
                new Control({
                    id: 'test',
                    attrs: null,
                    field: 'test',
                    options: {},
                    type: 'control',
                    value: 2
                })
            ]
        });
        console.log(g);
    }

}
