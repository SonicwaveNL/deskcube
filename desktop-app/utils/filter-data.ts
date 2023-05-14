import { keys } from '@mantine/utils';
import { RowData } from '@/models/timers-model';
import { transformIfNeeded } from './sort-data';

export const filterData = (data: RowData[], search: string) => {
    const query = search.toLowerCase().trim();
    return data.filter((item: RowData) =>
        keys(data[0]).some((key: string) => {
            let value = transformIfNeeded(item[key]);
            value.toLowerCase().includes(query);
        }
    ));
}