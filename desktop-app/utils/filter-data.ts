import { keys } from '@mantine/utils';
import { Timer } from '@/models/timers-model';
import { transformIfNeeded } from './sort-data';

export const filterData = (data: Timer[], search: string) => {
    const query = search.toLowerCase().trim();
    return data;
}