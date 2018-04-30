import { Subscription, Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { scan, map, distinctUntilChanged } from 'rxjs/operators';
import { Action, ReducedAction } from './actions';

/**
 * Abstract class that manages the state of one element in the formular.
 * @export
 */
export abstract class Store<StateType> {

    /**
     * Stream that emits on every dispatched Action.
     */
    protected _state$: BehaviorSubject<StateType> | undefined;

    /**
     * Stream that emits on every dispatched Action.
     */
    protected _actions$: Subject<Action> = new Subject();

    /**
     * Subscription that holds the listening handler for the dispatched Actions.
     */
    protected _actionSubscription: Subscription | undefined;

    /**
     * Initialize the Store and sets the initial State.
     * @param initialState The initial State.
     */
    protected _initStore(initialState: StateType): void {
        this._state$ = new BehaviorSubject(initialState);
        // Start listening to the dispatched Actions.
        this._actionSubscription =
            this._actions$.pipe(
                // Manipulate the actual state if the current {@link Action} is an ReducedAction,
                // otherwise untouch the state.
                scan((state: StateType, action: Action) =>
                    action instanceof ReducedAction ? action.reduce(state, action) : state,
                    initialState
                )

            ).subscribe((state: StateType) => {
                // emit the new state to the Store subject.
                if (this._state$) {
                    this._state$.next(state);
                }
            });
    }

    /**
     *  @return The current state of the Store.
     */
    protected _getState(): StateType {
        return this._state$ ? this._state$.getValue() : <StateType>{};
    }

    /**
     *  @return Observable of an partition of the State inside the Store.
     */
    protected _select<K>(mapping: (state: StateType) => K): Observable<K> {
        return (this._state$ || of(<StateType>{})).pipe(
            map((state: StateType) => mapping(state)),
            distinctUntilChanged()
        );
    }

    /**
     * Dispatches an Action to manipulate the current State inside the Store.
     */
    protected _dispatch(action: Action): void {
        this._actions$.next(action);
    }

}
