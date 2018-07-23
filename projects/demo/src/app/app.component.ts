import { Component } from '@angular/core';

import { ContainerModel, GroupFieldModel, ItemModel, LayoutModel } from '@performular/core';
import { CoreGroupComponent, FieldsetComponent, Input, InputComponent } from '@performular/ng-common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public form: GroupFieldModel = new GroupFieldModel({
        id: 'G',
        model: CoreGroupComponent,
        attrs: undefined,
        children: [
            new ContainerModel({
                id: 'fieldset',
                model: FieldsetComponent,
                attrs: {
                    legend: 'ter'
                },
                children: [
                    new LayoutModel({
                        layout: 'column',
                        layoutGap: '18px',
                        children: [
                            new ItemModel({
                                child: new Input({
                                    id: 'test',
                                    attrs: {
                                        type: 'number',
                                        debounce: 1000
                                    },
                                    model: InputComponent,
                                    defaultValue: 5
                                })
                            })
                        ]
                    })
                ]
            })
        ]
    });
    constructor() {
        this.form.value$.subscribe(console.log);
    }
}
