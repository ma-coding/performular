import { Store } from './store';

export interface ITestState {
    count: number;
    title: string;
    value: any;
}

describe('Store', () => {
    let store: Store<ITestState>;

    function createStore(): void {
        store = new Store<ITestState>();
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
