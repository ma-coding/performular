import { Component } from '@angular/core';

import { CoreGroup, Performular } from '@performular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public form: CoreGroup = <CoreGroup>Performular.build({
        value: {
            test: 10,
            testt: 8,
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
            children: [
                {
                    id: 'test',
                    attrs: {
                        type: 'text'
                    },
                    field: 'input',
                    type: 'control',
                    focus: true
                },
                {
                    id: 'testt',
                    attrs: {
                        type: 'text'
                    },
                    field: 'input',
                    type: 'control'
                },
                {
                    id: 'fieldg',
                    attrs: {
                        legend: 'test'
                    },
                    layout: {
                        main: 'row'
                    },
                    field: 'fieldset',
                    type: 'container',
                    children: [
                        {
                            id: 'test2',
                            attrs: {
                                type: 'text'
                            },
                            field: 'input',
                            type: 'control'
                        }, {
                            id: 'fieldg2',
                            attrs: {
                                legend: 'test'
                            },
                            field: 'fieldset',
                            type: 'container',
                            children: [
                                {
                                    id: 'test3',
                                    attrs: {
                                        type: 'text'
                                    },
                                    field: 'input',
                                    type: 'control'
                                }, {
                                    id: 'lst',
                                    type: 'list',
                                    field: 'list',
                                    attrs: undefined,
                                    childDef: {
                                        id: 'fieldg2',
                                        attrs: {
                                            legend: 'test'
                                        },
                                        field: 'fieldset',
                                        type: 'container',
                                        children: [{
                                            id: 'test4',
                                            attrs: {
                                                type: 'text'
                                            },
                                            field: 'input',
                                            type: 'control'
                                        }]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    });

    constructor() {
        console.log(this.form);
        this.form.changed$.subscribe(console.log);
    }

}
