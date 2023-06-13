import { Dayjs } from 'dayjs';

export interface Timer {
    uuid: string
    name: string
    timerItems: TimerItem[]
}

export interface TimerItem {
    uuid: string
    name: string
    moments: Moment[]
}

export interface Moment {
    uuid: string
    name: string
    start: string
    end: string
}