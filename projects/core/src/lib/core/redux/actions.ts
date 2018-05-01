
/**
 * Abstract Action that does not manipulate the Store.
 * @export
 */
export abstract class Action { }

/**
 * Abstract Action that manipulates the Store.
 * @export
 * @extends {Action}
 */
export abstract class ReducedAction<StateType> extends Action {
    /**
     * Abstract method that will be implemented in child classes to manipulate the Store.
     */
    public abstract reduce(state: StateType): StateType;
}
