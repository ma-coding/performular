import { Component } from '@angular/core';

import { AbstractField, CoreGroup, Performular } from '@performular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public form: CoreGroup = <CoreGroup>Performular.build({
        options: {
            errorStateWhen: (field: AbstractField): boolean => field.invalid && field.dirty
        },
        value: {
            test: 10,
            testDate: new Date(),
            textarea: 'abc',
            testt: false,
            testt3: false,
            test9: '123',
            test10: null,
            testt2: 0,
            test2: 90,
            test3: 490,
            lst: [15, 20, 30]
        },
        form: {
            id: 'g',
            attrs: undefined,
            field: 'group',
            type: 'group',
            layout: {
                main: 'column'
            },
            layoutGap: {
                main: '18px'
            },
            children: [
                {
                    id: 'test',
                    validators: [
                        {
                            errorMsg: 'testtt',
                            params: null,
                            name: 'required'
                        }
                    ],
                    attrs: {
                        type: 'number',
                        label: 'Zahl',
                        placeholder: 'test'
                        // appearance: 'outline'
                    },
                    field: 'matInput',
                    type: 'control',
                    focus: true
                },
                {
                    id: 'testDate',
                    validators: [
                        {
                            errorMsg: 'testtt',
                            params: null,
                            name: 'required'
                        }
                    ],
                    attrs: {
                        label: 'Date',
                        placeholder: 'test',
                        debounce: 200,
                        // appearance: 'outline'
                    },
                    field: 'matDatepicker',
                    type: 'control',
                    focus: true
                },
                {
                    id: 'textarea',
                    validators: [
                        {
                            errorMsg: 'testtt',
                            params: null,
                            name: 'required'
                        }
                    ],
                    attrs: {
                        label: 'Test',
                        placeholder: 'test',
                        appearance: 'outline',
                        autoResize: false,
                        maxRows: 5,
                        minRows: 1
                    },
                    field: 'matTextarea',
                    type: 'control',
                    focus: true
                },
                {
                    id: 'test9',
                    attrs: {
                        options: {
                            datasource: 'test',
                            resetInvisibleValue: true
                        },
                        name: 'test9',
                        buttonDirection: 'horizontal'
                    },
                    field: 'matRadio',
                    type: 'control'
                },
                {
                    id: 'test10',
                    validators: [
                        {
                            errorMsg: 'testtt',
                            params: null,
                            name: 'required'
                        }
                    ],
                    attrs: {
                        addNoneValue: true,
                        label: 'Select',
                        multiple: false,
                        options: {
                            datasource: 'test',
                            resetInvisibleValue: true
                        }
                    },
                    field: 'matSelect',
                    type: 'control'
                },
                {
                    id: 'testt',
                    attrs: {
                        placeholder: 'ABC'
                    },
                    field: 'matCheckbox',
                    type: 'control'
                },
                {
                    id: 'testt3',
                    attrs: {
                        placeholder: 'ABC'
                    },
                    field: 'matToggle',
                    type: 'control'
                },
                {
                    id: 'testt2',
                    attrs: {
                        min: 0,
                        max: 100
                    },
                    field: 'matSlider',
                    type: 'control'
                },
                // {
                //     id: 'fieldg',
                //     attrs: {
                //         legend: 'test'
                //     },
                //     layout: {
                //         main: 'row'
                //     },
                //     field: 'fieldset',
                //     type: 'container',
                //     children: [
                //         {
                //             id: 'test2',
                //             attrs: {
                //                 type: 'number'
                //             },
                //             field: 'input',
                //             type: 'control'
                //         }, {
                //             id: 'fieldg2',
                //             attrs: {
                //                 legend: 'test'
                //             },
                //             field: 'fieldset',
                //             type: 'container',
                //             children: [
                //                 {
                //                     id: 'test3',
                //                     attrs: {
                //                         type: 'text'
                //                     },
                //                     field: 'input',
                //                     type: 'control'
                //                 },
                //                 {
                //                     id: 'lst',
                //                     type: 'list',
                //                     field: 'list',
                //                     attrs: undefined,
                //                     childDef: {
                //                         id: 'fieldg2',
                //                         attrs: {
                //                             legend: 'test'
                //                         },
                //                         field: 'fieldset',
                //                         type: 'container',
                //                         children: [{
                //                             id: 'test4',
                //                             attrs: {
                //                                 type: 'number'
                //                             },
                //                             field: 'input',
                //                             type: 'control'
                //                         }]
                //                     }
                //                 }
                //             ]
                //         }
                //     ]
                // }
            ]
        }
    });

    constructor() {
    }

}
