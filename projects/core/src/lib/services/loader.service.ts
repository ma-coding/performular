import { Injectable, Injector } from '@angular/core';

/**
 * Injectable Service that holds the Injector inside a static member, for usage outside Angular.
 * @export
 */
@Injectable()
export class LoaderService {

    /**
     * Static member that holds the Injector.
     */
    public static injector: Injector | undefined;

    /**
     * Method that connects the Injector with the static member.
     */
    public connect(injector: Injector): void {
        if (!LoaderService.injector) {
            LoaderService.injector = injector;
        }
    }
}
