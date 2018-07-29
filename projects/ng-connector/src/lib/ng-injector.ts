import { Injector } from '@angular/core';

import { AbstractInjector } from '@performular/core';

// @dynamic
export class NgInjector extends AbstractInjector {
    private static _injector: Injector;

    public static setInjector(injector: Injector): void {
        this._injector = injector;
    }

    public createInstance<T>(instanceDef: { new (...args: any[]): T }): T {
        return NgInjector._injector.get<T>(instanceDef);
    }
}
