import { IViewScales, MapType } from '../../utils/misc';
import { ILayoutAlign } from './layout';

export namespace BaseLayout {

    export function mergeAxis(align: MapType<ILayoutAlign>): MapType<string> {
        return Object.keys(align).reduce((prev: any, curr: string) => {
            if (align[curr].mainAxis && align[curr].crossAxis) {
                prev[curr] = `${align[curr].mainAxis} ${align[curr].crossAxis}`;
            }
            if (align[curr].mainAxis && !align[curr].crossAxis) {
                prev[curr] = align[curr].mainAxis;
            }
            return prev;
        }, {});
    }

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
