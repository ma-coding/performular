import { Component } from '@angular/core';

import { GroupFieldModel } from '@performular/core';
import { getJsonForm } from './json.form';
import { getClassForm } from './class.form';
import { getTypedForm } from './type.form';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public jsonForm: GroupFieldModel = getJsonForm({
        slider: 33,
        select: 2
    });

    public classForm: GroupFieldModel = getClassForm();
    public typedForm: GroupFieldModel = getTypedForm();

    constructor() {}
}
