import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, scan } from 'rxjs/operators';

import { Action, ReducedAction } from './actions';

/**
 * Class that manages the state of one element in the formular.
 * @export
 */
export class Store<StateType extends {}> {

    /**
     * Stream that emits on every dispatched Action.
     */
    public state$: BehaviorSubject<StateType> | undefined;

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
                if (this.state$) {
                    this.state$.next(state);
                }
            });
    }

    /**
     *  @return The current state of the Store.
     */
    public getState(): StateType {
        return this.state$ ? this.state$.getValue() : <StateType>{};
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
