import { Timer } from '@/models/timers-model';
import { filterData } from './filter-data';

export const transformIfNeeded = (data : string | Date | number) => {
    if(typeof data === 'string'){
        return data
    } else if(typeof data === 'number') {
        return data.toString()
    } else {
        return data.toLocaleTimeString()
    }
}

export const sortData = (
    data: Timer[],
    payload: { sortBy: keyof Timer | null; reversed: boolean; search: string }
) => {
    const { sortBy } = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
        [...data].sort((a, b) => {
            
            if (payload.reversed) {
                let left = transformIfNeeded(b['name']);
                let right = transformIfNeeded(a['name']);
                return left.localeCompare(right);
            }
            
            let left = transformIfNeeded(a['name']);
            let right = transformIfNeeded(b['name']);
            return left.localeCompare(right);

        }),
        payload.search
    );
}