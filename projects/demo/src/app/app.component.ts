import { Component } from '@angular/core';

import { ItemModel, LayoutModel } from '@performular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public form: LayoutModel = new LayoutModel({
        layout: 'row',
        layoutGap: '18px',
        children: [
            new ItemModel({
                child: new LayoutModel({
                    layout: 'column',
                    children: []
                })
            }),
            new ItemModel({
                child: new LayoutModel({
                    layout: 'column',
                    children: []
                })
            })
        ]
    });
    constructor() {}
}
