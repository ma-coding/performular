import { Component } from '@angular/core';

import {
    GroupFieldModel,
    PERFORMULAR_VALIDATOR_REQUIRED,
    AbstractFieldModel
} from '@performular/core';
import { getJsonForm } from './json.form';
import { getClassForm } from './class.form';
import { getTypedForm } from './type.form';
import { MaterialDatepicker } from '@performular/ui-material';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public jsonForm: GroupFieldModel = getJsonForm({
        input: 900,
        slider: 33
    });

    public classForm: GroupFieldModel = getClassForm();
    public typedForm: GroupFieldModel = getTypedForm();

    constructor() {}
}
