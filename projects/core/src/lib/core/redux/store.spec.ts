import { Store } from './store';

export interface ITestState {
    count: number;
    title: string;
    value: any;
}

describe('Store', () => {
    let store: Store<ITestState>;

    function createStore(): void {
        store = new Store<ITestState>({
          count: 1,
          title: 'test',
          value: 1234
      });
    }

    beforeEach(() => {
        createStore();
    });
    it(`store is initialized`, () => {
        expect(store).toBeTruthy();
        expect(store.getState()).toEqual({
            count: 1,
            title: 'test',
            value: 1234
        });
    });
});
