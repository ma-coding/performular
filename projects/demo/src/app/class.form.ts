import { GroupFieldModel, LayoutModel, ItemModel } from '@performular/core';
import {
    MaterialDatepicker,
    MaterialTextarea,
    MaterialInput,
    MaterialToggle,
    MaterialCheckbox,
    MaterialSlider
} from '@performular/ui-material';
import { CoreGroup } from '@performular/ng-common';

export function getClassForm(): GroupFieldModel {
    return new CoreGroup({
        id: 'group',
        attrs: undefined,
        children: [
            new LayoutModel({
                layout: 'row',
                layoutGap: '18px',
                children: [
                    new ItemModel({
                        child: new MaterialSlider({
                            id: 'slider',
                            attrs: {
                                max: 100,
                                min: 0
                            },
                            defaultValue: 5
                        })
                    }),
                    new ItemModel({
                        child: new MaterialCheckbox({
                            id: 'checkbox',
                            attrs: {
                                placeholder: 'Checkbox'
                            },
                            defaultValue: false
                        })
                    }),
                    new ItemModel({
                        child: new MaterialToggle({
                            id: 'toggle',
                            attrs: {
                                placeholder: 'Toggle'
                            },
                            defaultValue: 5
                        })
                    })
                ]
            }),
            new LayoutModel({
                layout: 'row',
                layoutGap: '18px',
                children: [
                    new MaterialInput({
                        id: 'input',
                        attrs: {
                            type: 'number',
                            debounce: 1000,
                            placeholder: 'Input',
                            label: 'Input'
                        },
                        defaultValue: 5
                    }),
                    new MaterialTextarea({
                        id: 'textarea',
                        attrs: {
                            placeholder: 'Textarea',
                            label: 'Textarea',
                            debounce: 500,
                            maxRows: 5,
                            minRows: 5
                        },
                        defaultValue: 5
                    }),
                    new MaterialDatepicker({
                        id: 'datepicker',
                        attrs: {
                            label: 'Datepicker'
                        },
                        defaultValue: false
                    })
                ]
            })
        ]
    });
}
