export interface Timer {
    uuid: string
    name: string
    timerItems: TimerItem[]
}

export interface TimerItem {
    uuid: string
    name: string
    time?: Date
}