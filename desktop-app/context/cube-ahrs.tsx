import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

type CubeAHRSContextType = {
    roll: number;
    pitch: number;
    yaw: number;
    heading: number;
    frequency: number;
}

const CubeAHRSContextDefault: CubeAHRSContextType = {
    roll: 0,
    pitch: 0,
    yaw: 0,
    heading: 0,
    frequency: 0
}

const CubeAHRSContext = createContext<CubeAHRSContextType>(CubeAHRSContextDefault);

export const useCubeAHRS = () => {
    return useContext(CubeAHRSContext);
}

type CubeAHRSProviderProps = {
    children: ReactNode;
}

export const CubeAHRSProvider = ({ children }: CubeAHRSProviderProps) => {
    
    const [roll, setRoll] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [yaw, setYaw] = useState(0);
    const [heading, setHead] = useState(0);
    const [frequency, setFrequency] = useState(0);

    useEffect(() => {
        const unListen = listen("AHRS_ROLL", (e: { payload: number }) => {
            setRoll(e.payload)
        });
        return () => {unListen.then((f) => f());}
    }, [])

    useEffect(() => {
        const unListen = listen("AHRS_PITCH", (e: { payload: number }) => {
            setPitch(e.payload)
        });
        return () => {unListen.then((f) => f());}
    }, [])

    useEffect(() => {
        const unListen = listen("AHRS_YAW", (e: { payload: number }) => {
            setYaw(e.payload)
        });
        return () => {unListen.then((f) => f());}
    }, [])

    useEffect(() => {
        const unListen = listen("AHRS_HEAD", (e: { payload: number }) => {
            setHead(e.payload)
        });
        return () => {unListen.then((f) => f());}
    }, [])

    useEffect(() => {
        const unListen = listen("AHRS_FREQ", (e: { payload: number }) => {
            setFrequency(e.payload)
        });
        return () => {unListen.then((f) => f());}
    }, [])

    const value = { roll, pitch, yaw, heading, frequency };

    return (
        <CubeAHRSContext.Provider value={value}>
            { children }
        </CubeAHRSContext.Provider>
    )
}