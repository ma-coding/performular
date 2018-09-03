import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { StateFn } from '../types/state-fn';
import { TransactionQueue, TransactionNode } from './transaction';

export class AbstractStore<T> {
    private _store: BehaviorSubject<T>;

    private _transactionQueue:
        | TransactionQueue<StateFn<T, T | void>>
        | undefined;

    constructor(initialState: T) {
        this._store = new BehaviorSubject(initialState);
    }

    public setState(
        newStateFn: StateFn<T>,
        ignoreTransaction: boolean = false
    ): void {
        if (this._transactionQueue && !ignoreTransaction) {
            this._transactionQueue.addNode(newStateFn);
        } else {
            this._dispatch(newStateFn(this._store.getValue()));
        }
    }

    public getState(getStateFn: StateFn<T, void>): void {
        if (this._transactionQueue) {
            this._transactionQueue.addNode(getStateFn);
        } else {
            getStateFn(this._store.getValue());
        }
    }

    public select(): Observable<T>;
    public select<K extends keyof T = any>(projector?: K): Observable<T[K]>;
    public select<K = any>(projector?: (state: T) => K): Observable<K>;
    public select(projector?: any): Observable<any> {
        if (!projector) {
            return this._store.pipe(distinctUntilChanged());
        }
        let project: (value: T, index: number) => any;
        if (typeof projector === 'function') {
            project = projector;
        } else {
            project = (state: T): any => state[projector];
        }

        if (!projector) {
            throw new Error('Unknown projector value ' + projector);
        }

        return this._store.pipe(
            map(project),
            distinctUntilChanged()
        );
    }

    public transaction(transactions: () => void): void {
        // allready running inside a transaction
        if (this._transactionQueue) {
            transactions();
            return;
        }

        // start a new transaction
        this._transactionQueue = new TransactionQueue<StateFn<T, T | void>>(
            (_: T): void => {}
        );
        transactions();

        // chain has no pending transactions
        if (this._transactionQueue.isEmpty()) {
            this._clearTransaction();
            return;
        }

        this.setState((state: T) => {
            return this._handleTransaction(state);
        }, true);

        this._clearTransaction();
    }

    private _clearTransaction(): void {
        this._transactionQueue = undefined;
    }

    private _handleTransaction(state: T): T {
        if (!this._transactionQueue) {
            return state;
        }
        let transactionNode:
            | TransactionNode<StateFn<T, T | void>>
            | undefined = this._transactionQueue.getNextNode();
        let transactionState: T = state;
        while (transactionNode) {
            const newState: T | void = transactionNode.item(transactionState);
            if (newState) {
                transactionState = newState;
            }
            transactionNode = this._transactionQueue.getNextNode();
        }
        return transactionState;
    }

    private _dispatch(state: T): void {
        this._store.next(state);
    }
}
