import { IViewScales, MapType } from '../../misc';

export namespace BaseLayout {

    export function convertKeys<T>(key: string, replaceKey?: string): (data: IViewScales<T> | undefined) => MapType<T> {
        return (data: IViewScales<T> | undefined): MapType<T> => {
            if (!data) {
                return {};
            }
            return Object.keys(data).reduce<any>((prev: any, curr: string) => {
                const useKey: string = replaceKey ? replaceKey : key;
                if (curr === 'main') {
                    prev[useKey] = data[curr];
                } else {
                    prev[useKey + this._capitalizeFirstLetterFunc(curr)] = data[curr];
                }
                return prev;
            }, {});
        };
    }

    export function capitalizeFirstLetterFunc(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
