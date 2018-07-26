import { Component } from '@angular/core';

import { GroupFieldModel, Builder, Framework } from '@performular/core';
import {
    CoreGroupComponent,
    FieldsetComponent,
    Input,
    InputComponent,
    Fieldset,
    CoreGroup,
    PERFORMULAR_MODEL_CORE_GROUP
} from '@performular/ng-common';
import {
    MaterialInput,
    MaterialSliderComponent,
    MaterialSlider,
    MaterialCheckbox,
    MaterialTextarea,
    MaterialToggle,
    MaterialDatepicker,
    PERFORMULAR_MODEL_MATERIALSLIDER,
    PERFORMULAR_MODEL_MATERIALCHECKBOX,
    PERFORMULAR_MODEL_MATERIALTOGGLE,
    PERFORMULAR_MODEL_MATERIALINPUT,
    PERFORMULAR_FORMCOMPONENT_MATERIALTEXTAREA,
    PERFORMULAR_MODEL_MATERIALDATEPICKER,
    MaterialCheckboxComponent,
    MaterialTextareaComponent,
    MaterialToggleComponent,
    MaterialInputComponent,
    MaterialSliderAttrs
} from '@performular/ui-material';
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
        this.jsonForm.value$.subscribe((value: any) => {
            this.classForm.setValue(value);
            this.typedForm.setValue(value);
        });
    }
}
