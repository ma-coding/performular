import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Store } from './store';
import { Action } from './actions';
import { Observable } from 'rxjs';

export interface ITestState {
    count: number;
    title: string;
    value: any;
}

export class TestStore extends Store<ITestState> {
    public initStore(state: ITestState): void {
        this._initStore(state);
    }

    public getState(): ITestState {
        return super._getState();
    }

    public dispatch(action: Action): void {
        super._dispatch(action);
    }

    public _select<K>(map: (state: ITestState) => K): Observable<K> {
        return this._select<K>(map);
    }
}

describe('Store', () => {
    let store: TestStore;

    function createStore(): void {
        store = new TestStore();
    }

    function initStore(): void {
        store.initStore({
            count: 1,
            title: 'test',
            value: 1234
        });
    }

    beforeEach(() => {
        createStore();
    });
    it('store is empty', () => {
        expect(store).toBeTruthy();
        expect(store.getState()).toBe({});
    });
    it(`store is initialized`, () => {
        initStore();
        expect(store).toBeTruthy();
        expect(store.getState()).toEqual({
            count: 1,
            title: 'test',
            value: 1234
        });
    });
});
