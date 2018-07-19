import { AbstractInjector } from './abstract-injector';

// @dynamic
export abstract class Framework {
    private static _injector: AbstractInjector | undefined;

    public static setInjector(injector: AbstractInjector): void {
        this._injector = injector;
    }

    public static getInjector(): AbstractInjector {
        if (this._injector) {
            return this._injector;
        }
        throw new Error('');
    }
}
