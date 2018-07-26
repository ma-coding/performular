import { Control, Group, GroupFieldModel, Builder } from '@performular/core';
import {
    MaterialSliderComponent,
    MaterialCheckboxComponent,
    MaterialToggleComponent,
    MaterialInputComponent,
    MaterialTextareaComponent,
    MaterialDatepickerComponent
} from '@performular/ui-material';
import { CoreGroupComponent } from '@performular/ng-common';

@Group<keyof FormType>({
    id: 'GROUP',
    attrs: undefined,
    model: CoreGroupComponent,
    layout: 'column',
    children: [
        {
            child: {
                layout: 'row',
                layoutGap: '18px',
                children: ['slider', 'checkbox', 'toggle']
            }
        },
        {
            child: {
                layout: 'row',
                layoutGap: '18px',
                children: ['input', 'textarea', 'datepicker']
            }
        }
    ]
})
export class FormType {
    @Control({
        attrs: {
            min: 0,
            max: 100
        },
        model: MaterialSliderComponent
    })
    public slider?: number;

    @Control({
        attrs: {
            placeholder: 'Checkbox'
        },
        model: MaterialCheckboxComponent
    })
    public checkbox?: boolean;

    @Control({
        attrs: {
            placeholder: 'Toggle'
        },
        model: MaterialToggleComponent
    })
    public toggle?: boolean;

    @Control({
        attrs: {
            placeholder: 'Input',
            label: 'Input'
        },
        model: MaterialInputComponent
    })
    public input?: number;

    @Control({
        attrs: {
            placeholder: 'Textarea',
            label: 'Textarea',
            autoResize: true,
            minRows: 1,
            maxRows: 5
        },
        model: MaterialTextareaComponent
    })
    public textarea?: number;

    @Control({
        attrs: {
            placeholder: 'Datepicker',
            label: 'Datepicker'
        },
        model: MaterialDatepickerComponent
    })
    public datepicker?: Date;
}

export function getTypedForm(): GroupFieldModel {
    return Builder.buildFromTarget(FormType, { input: 800 });
}
