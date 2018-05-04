import { Component } from '@angular/core';

import { CoreFieldset, CoreGroup, CoreInput, InputValueType } from '../../../core/src/public_api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public group: CoreGroup = new CoreGroup({
        id: 'group',
        children: [
            new CoreFieldset({
                bindings: {
                    legend: 'test'
                },
                children: [
                    new CoreInput({
                        id: 'A',
                        bindings: {
                            type: InputValueType.number
                        },
                        value: 5
                    })
                ]
            })
        ]
    });

    constructor() {
        this.group.value$.subscribe(console.log);
    }
}
