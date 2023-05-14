import { Timer, TimerItem } from '@/models';
import { Store } from 'tauri-plugin-store-api';
import { v4 as uuid } from 'uuid';

export async function getTimers() {
    const store = new Store('timers.dat');
    const timers = await store.entries();
    return timers;
}

export async function getTimer(uuid: string) {
    const store = new Store('timers.dat');
    const timer = await store.get(uuid);
    return timer;
}

export async function createTimer(name: string) {
    const store = new Store('timers.dat');
    const itemId = uuid();
    const result = await store.set(
        itemId, { uuid: itemId, name: name, timerItems: [] }
    );
    await store.save();
    return result;
}

export async function deleteTimer(uuid: string) {
    const store = new Store('timers.dat');
    const result = await store.delete(uuid);
    await store.save();
    return result;
}

export async function updateTimer(uuid: string, timer: Timer) {
    const store = new Store('timers.dat');
    const result = await store.set(uuid, timer);
    await store.save();
    return result;
}