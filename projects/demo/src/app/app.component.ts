import { Component } from '@angular/core';

import {
    GroupFieldModel,
    PERFORMULAR_VALIDATOR_REQUIRED,
    AbstractFieldModel
} from '@performular/core';
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
        input: 900,
        slider: 33
    });

    public classForm: GroupFieldModel = getClassForm();
    public typedForm: GroupFieldModel = getTypedForm();

    constructor() {
        this.classForm.updates$.subscribe(() => console.log(this.classForm));
        this.jsonForm.value$.subscribe((value: any) => {
            this.classForm.setValue(value);
            this.typedForm.setValue(value);
            const input: AbstractFieldModel | undefined = this.classForm.find(
                'input'
            );
            if (input) {
                input.addValidation('required', {
                    target: PERFORMULAR_VALIDATOR_REQUIRED,
                    errorMsg: 'FEHLER'
                });
            }
        });
    }
}
