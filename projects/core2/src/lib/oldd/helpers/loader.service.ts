import { Injectable, Injector, Type } from '@angular/core';

/**
 * Injectable Service that holds the Injector inside a static member, for usage outside Angular.
 * @export
 * @dynamic
 */
@Injectable()
export class LoaderService {

    /**
     * Static member that holds the Injector.
     */
    public static injector: Injector | undefined;

    public static get<Instance>(target: Type<Instance>): Instance | undefined {
        this._throwError();
        return (<Injector>this.injector).get<Instance>(target, undefined);
    }

    private static _throwError(): void {
        if (!this.injector) {
            throw new Error(
                'No Injector provided please import PerformularCoreModule to your ngModule'
            );
        }
    }

    /**
     * Method that connects the Injector with the static member.
     */
    public connect(injector: Injector): void {
        if (!LoaderService.injector) {
            LoaderService.injector = injector;
        }
    }

}
