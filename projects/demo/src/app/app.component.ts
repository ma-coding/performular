import { Component } from '@angular/core';

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
    }

    // public test: string = 'MENSCH';
    // public count: number = 2;

    // public c: Performular<Props> = new Performular<Props>({
    //     form: this.getForm(),
    //     options: {
    //         updateDebounce: 0
    //     },
    //     value: {
    //         test0: 5,
    //         test1: 5,
    //         list: [
    //             'abc'
    //         ]
    //     }
    // });

    // constructor(
    // ) {
    //     console.log(this.c);
    //     (<Group>this.c.form).value$.subscribe(console.log);
    // }

    // public getForm(): any {
    //     return {
    //         id: 'group',
    //         type: 'group',
    //         framework: {
    //             field: 'group',
    //             attrs: undefined
    //         },
    //         layout: {
    //             direction: {
    //                 main: 'row wrap'
    //             },
    //             gap: {
    //                 main: '18px'
    //             }
    //         },
    //         children: [
    //             ...this.get(), {
    //                 id: 'list',
    //                 type: 'list',
    //                 framework: {
    //                     field: 'list',
    //                     attrs: undefined
    //                 },
    //                 layout: {
    //                     direction: {
    //                         main: 'column'
    //                     }
    //                 },
    //                 childDef: this.getListItem()
    //             }
    //         ]
    //     };
    // }

    // public get(): IInput[] {
    //     const res: IInput[] = [];
    //     for (let i: number = 0; i < this.count; i++) {
    //         res.push({
    //             id: 'test' + i,
    //             type: 'control',
    //             framework: {
    //                 field: PERFORMULAR_FORMCOMPONENT_INPUT,
    //                 attrs: {
    //                     type: 'number'
    //                 },
    //                 styles: {
    //                     input: {
    //                         marginTop: '9px',
    //                         marginBottom: '9px',
    //                     }
    //                 }
    //             },
    //             validation: {
    //                 validators: [
    //                     {
    //                         id: 'req',
    //                         name: 'required',
    //                         errorMsg: 'Fehler',
    //                     }, {
    //                         id: 'min',
    //                         name: 'min',
    //                         errorMsg: 'Mindestens __min__',
    //                         params: 5
    //                     }, {
    //                         id: 'max',
    //                         name: 'max',
    //                         errorMsg: 'Maximum __max__',
    //                         params: 6
    //                     }
    //                 ]
    //             },
    //             item: {
    //                 flex: {
    //                     main: 20
    //                 }
    //             },
    //             focus: true,
    //         });
    //     }
    //     return res;
    // }

    // public getVal(): any {
    //     const res: any = {};
    //     for (let i: number = 0; i < this.count; i++) {
    //         res['test' + i] = ((15432 * (i + 1)) % (3 * Math.pow(i + 1, 2 * (1 + Math.random())))) + 10;
    //     }
    //     res['test0'] = NaN;
    //     return res;
    // }

    // public getListItem(): any {
    //     return {
    //         id: 'listitemcontrol',
    //         type: 'control',
    //         framework: {
    //             field: PERFORMULAR_FORMCOMPONENT_TEXTAREA,
    //             attrs: {
    //                 rows: 10
    //             }
    //         },
    //         validation: {
    //             validators: [{
    //                 id: 'minlength',
    //                 name: 'minlength',
    //                 errorMsg: 'Länge: __length__; MinumLänge __minlength__',
    //                 params: 6
    //             }, {
    //                 id: 'maxlength',
    //                 name: 'maxlength',
    //                 errorMsg: 'Länge: __length__; MaximumLänge __maxlength__',
    //                 params: 7
    //             }]
    //         }
    //     };
    // }

    // public reset(): void {
    //     (<Group>this.c.form).resetValue();
    // }

    // public patch(): void {
    //     (<Group>this.c.form).patchValue(this.getVal());
    // }

    // public hide(): void {
    //     const c: Control = (<Control>(<Group>this.c.form).getChildFields()[0]);
    //     c.setForcedHidden(!c.hidden);
    // }

    // public rem(): void {
    //     const c: Control = (<Control>(<Group>this.c.form).getChildFields()[0]);
    //     c.removeValidator('req');
    // }

    // public add(): void {
    //     const c: Control = (<Control>(<Group>this.c.form).getChildFields()[0]);
    //     c.addValidator({
    //         id: 'req',
    //         name: 'required',
    //         errorMsg: 'Fehler',
    //     });
    // }
}
