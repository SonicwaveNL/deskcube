import { Timer, TimerItem } from '@/models';
import { Store } from 'tauri-plugin-store-api';
import { v4 as uuid } from 'uuid';

/**
 * Get all Timers.
 * 
 * @returns An array of all the stored Timers.
*/
export async function getTimers() {
    const store = new Store('timers.dat');
    const timers = await store.entries();
    return timers;
}

/**
 * Get the data of a specific Timer.
 * 
 * @param uuid The UUID of the specific Timer.
 * @returns The data of the specific Timer.
*/
export async function getTimer(uuid: string) {
    const store = new Store('timers.dat');
    const timer = await store.get(uuid);
    return timer;
}

/**
 * Create a new Timer.
 * 
 * @param name The name of the Timer.
*/
export async function createTimer(name: string) {
    const store = new Store('timers.dat');
    const itemId = uuid();
    const result = await store.set(
        itemId, { uuid: itemId, name: name, timerItems: [] }
    );
    await store.save();
    return result;
}

/**
 * Delete a Timer with given UUID.
 * 
 * @param uuid The UUID of the Timer to delete.
 * @returns true/false if deletion of Timer was successfull.
*/
export async function deleteTimer(uuid: string) {
    const store = new Store('timers.dat');
    const result = await store.delete(uuid);
    await store.save();
    return result;
}

/**
 * Update a Timer.
 * 
 * @param uuid The UUID of the Timer to update.
 * @param timer The updated the Timer object.
*/
export async function updateTimer(uuid: string, timer: Timer) {
    const store = new Store('timers.dat');
    const result = await store.set(uuid, timer);
    await store.save();
    return result;
}