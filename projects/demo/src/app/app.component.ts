import { Component } from '@angular/core';

import { IAbstractFieldProperty } from '../../../core/src/lib/models/abstract-field';
import { IEffect } from '../../../core/src/lib/models/effects/effect';
import { EffectTypes, IPerformularTypes } from '../../../core/src/lib/utils/misc';

// import {
//     Control,
//     FormTypes,
//     Group,
//     ICoreGroup,
//     ICoreList,
//     IInput,
//     ITextarea,
//     Performular,
//     PERFORMULAR_FORMCOMPONENT_INPUT,
//     PERFORMULAR_FORMCOMPONENT_TEXTAREA,
// } from '@performular/core';

// export interface Props extends FormTypes {
//     0: IInput;
//     1: ICoreGroup<Props>;
//     2: ICoreList<Props>;
//     3: ITextarea;
// }

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor() {
        interface E extends EffectTypes {
            0: IEffect<'TEST', number>;
        }
        type PT = IPerformularTypes<any, E>;
        const f: IAbstractFieldProperty<'control', 'input', number, 'test', PT> = {
            id: 'foo',
            field: 'input',
            attrs: 5,
            options: {},
            type: 'control',
            effects: [
                {
                    id: 't',
                    name: 'TEST',
                    params: 5
                }
            ]
        };
    }

}
