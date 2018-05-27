import { Component } from '@angular/core';

import { Control } from '@performular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(
    ) {

        const c: Control = new Control({
            id: 'test',
            type: 'control',
            framework: {
                attrs: null,
                field: ''
            },
            item: {
                flex: {
                    main: 50
                }
            }
        }, {
                errorWhen: true
            });

        console.log(c);

    }

}
