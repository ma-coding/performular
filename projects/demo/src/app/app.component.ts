import { Component } from '@angular/core';

import { Control } from '../../../core/src/lib/models/control';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor() {
        console.log(new Control({
            id: 'test',
            attrs: null,
            field: 'test',
            options: {},
            type: 'control'
        }));
    }

}
