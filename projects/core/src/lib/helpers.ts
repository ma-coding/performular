import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, scan } from 'rxjs/operators';

/**
 * Function that flats 2 Dimension Array to 1 Dimension.
 * @export
 * @param 2 Dimension Array
 * @returns Flats the Array to One Dimension
 */
export function flatten<T = any>(arr: T[][]): T[] {
    return [].concat.apply([], arr);
}

export type MaybeObservable<T> = Observable<T> | T;

/**
 * Function that returns an Observable of the parameter.
 * @export
 */
export function createObservable<T>(maybe: MaybeObservable<T>): Observable<T> {
    if (maybe instanceof Observable) {
        return maybe;
    } else {
        return of(maybe);
    }
}

/**
 * Function that returns an unique string.
 * @export
 * @returns an unique string
 */
export function generateUUID(): string {
    const s4: () => string = (): string => {
        // tslint:disable-next-line:no-magic-numbers
        return Math.floor((1 + Math.random()) * 0x10000)
            // tslint:disable-next-line:no-magic-numbers
            .toString(16)
            .substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
 * Abstract Action that does not manipulate the Store.
 * @export
 */
export abstract class Action { }

/**
 * Abstract Action that manipulates the Store.
 * @export
 */
export abstract class ReducedAction<StateType> extends Action {
    /**
     * Abstract method that will be implemented in child classes to manipulate the Store.
     */
    public abstract reduce(state: StateType): StateType;
}

/**
 * Class that manages the state of one element in the formular.
 * @export
 */
export class Store<StateType extends {}> {

    /**
     * Stream that emits on every dispatched Action.
     */
    public state$: BehaviorSubject<StateType>;

    /**
     * Stream that emits on every dispatched Action.
     */
    public actions$: Subject<Action> = new Subject();

    /**
     * Subscription that holds the listening handler for the dispatched Actions.
     */
    public actionSubscription: Subscription | undefined;

    /**
     * Initialize the Store and sets the initial State.
     * @param initialState The initial State.
     */
    constructor(initialState: StateType) {
        this.state$ = new BehaviorSubject(initialState);
        // Start listening to the dispatched Actions.
        this.actionSubscription =
            this.actions$.pipe(
                // Manipulate the actual state if the current {@link Action} is an ReducedAction,
                // otherwise untouch the state.
                scan((state: StateType, action: Action) =>
                    action instanceof ReducedAction ? action.reduce(state) : state,
                    initialState
                )

            ).subscribe((state: StateType) => {
                // emit the new state to the Store subject.
                this.state$.next(state);
            });
    }

    /**
     *  @return The current state of the Store.
     */
    public getState(): StateType {
        return this.state$.getValue();
    }

    /**
     *  @return Observable of an partition of the State inside the Store.
     */
    public select<K>(mapping: (state: StateType) => K): Observable<K> {
        return (this.state$ || of(<StateType>{})).pipe(
            map((state: StateType) => mapping(state)),
            distinctUntilChanged()
        );
    }

    /**
     * Dispatches an Action to manipulate the current State inside the Store.
     */
    public dispatch(action: Action): void {
        this.actions$.next(action);
    }

}
