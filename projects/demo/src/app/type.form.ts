import { Control, Group, GroupFieldModel, Builder } from '@performular/core';
import {
    MaterialSliderComponent,
    MaterialCheckboxComponent,
    MaterialToggleComponent,
    MaterialInputComponent
} from '@performular/ui-material';
import { CoreGroupComponent } from '@performular/ng-common';

@Group({
    id: 'GROUP',
    attrs: undefined,
    model: CoreGroupComponent,
    layout: 'column',
    children: [
        {
            child: {
                layout: 'row',
                layoutGap: '18px',
                children: ['slider', 'checkbox', 'toggle', 'input']
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
            placeholder: 'test'
        },
        model: MaterialCheckboxComponent
    })
    public checkbox?: boolean;

    @Control({
        attrs: {
            placeholder: 'test'
        },
        model: MaterialToggleComponent
    })
    public toggle?: boolean;

    @Control({
        attrs: {
            placeholder: 'test',
            label: 'test'
        },
        model: MaterialInputComponent
    })
    public input?: number;
}

export function getTypedForm(): GroupFieldModel {
    return Builder.buildFromTarget(FormType, { input: 800 });
}
