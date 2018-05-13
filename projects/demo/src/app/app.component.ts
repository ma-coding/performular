import { Component } from '@angular/core';

import { Field } from '../../../core/src/lib/field';
import { FieldType } from '../../../core/src/lib/types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(
    ) {
        const loader: Field = new Field({
            component: '',
            bindings: {},
            type: FieldType.Control
        }, 1);
        loader.setValue(50);
        console.log(loader);
    }

}
