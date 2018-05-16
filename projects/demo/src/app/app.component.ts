import { Component } from '@angular/core';

import { CoreGroupComponent, CoreInputComponent, GroupSchema, IControlSchema, SchemaType } from '@performular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public group: GroupSchema;

    constructor(
    ) {
        this.group = new GroupSchema({
            bindings: undefined,
            component: CoreGroupComponent,
            id: 'group',
            type: SchemaType.Group,
            children: [
                <IControlSchema>{
                    id: 'control',
                    type: SchemaType.Control,
                    component: CoreInputComponent,
                    bindings: {

                    },
                    value: '10'
                }
            ]
        });
        console.log(this.group);
    }

}
