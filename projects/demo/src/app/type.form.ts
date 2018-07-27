import {
    Control,
    Group,
    GroupFieldModel,
    Builder,
    SubGroup,
    List
} from '@performular/core';
import {
    MaterialSliderComponent,
    MaterialCheckboxComponent,
    MaterialToggleComponent,
    MaterialInputComponent,
    MaterialTextareaComponent,
    MaterialDatepickerComponent
} from '@performular/ui-material';
import {
    CoreGroupComponent,
    CoreListComponent,
    FieldsetComponent
} from '@performular/ng-common';

@Group<keyof SubForm>({
    id: 'SUB',
    attrs: undefined,
    model: CoreGroupComponent,
    layout: 'column',
    children: ['checkbox']
})
export class SubForm {
    @Control({
        attrs: {
            placeholder: 'Checkbox'
        },
        model: MaterialCheckboxComponent
    })
    public checkbox?: boolean;
}

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
        },
        'sub',
        {
            id: 'f',
            model: FieldsetComponent,
            attrs: {
                legend: 'test'
            },
            children: ['subs']
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

    @SubGroup({
        childTarget: SubForm
    })
    public sub?: SubForm;

    @List({
        childTarget: SubForm,
        model: CoreListComponent,
        attrs: undefined
    })
    public subs?: SubForm[];
}

export function getTypedForm(): GroupFieldModel {
    return Builder.buildFromTarget(FormType, {
        input: 800,
        sub: { checkbox: true },
        subs: [{ checkbox: true }, { checkbox: false }]
    });
}
