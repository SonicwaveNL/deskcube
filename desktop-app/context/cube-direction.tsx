import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

type CubeDirectionContextType = {
    direction: string;
    axisX: number;
    axisY: number;
    setDirection: (direction: string) => void;
}

const CubeDirectionContextDefault: CubeDirectionContextType = {
    direction: 'CENTER',
    setDirection: () => {},
    axisX: 0,
    axisY: 0
}

const CubeDirectionContext = createContext<CubeDirectionContextType>(CubeDirectionContextDefault);

export const useCubeDirection = () => {
    return useContext(CubeDirectionContext);
}

type CubeDirectionProviderProps = {
    children: ReactNode;
}

export const CubeDirectionProvider = ({ children }: CubeDirectionProviderProps) => {
    
    const [direction, setCubeDirection] = useState<string>('CENTER');

    const [axisX, setAxisX] = useState(0);
    const [axisY, setAxisY] = useState(0);

    const x_boundary = 90;
    const y_boundary = 90;

    const setDirection = (direction: string) => {
        if (
            direction === 'LEFT' ||
            direction === 'RIGHT' ||
            direction === 'UP' ||
            direction === 'DOWN' ||
            direction === 'CENTER'
        ) {
            setCubeDirection(direction);
        }
    }

    useEffect(() => {
        const unListen = listen("ACC_X", (e: { payload: number }) => {
            setAxisX(e.payload)
        });
        return () => {unListen.then((f) => f());}
    }, [])

    useEffect(() => {
        const unListen = listen("ACC_Y", (e: { payload: number }) => {
            setAxisY(e.payload)
        });
        return () => {unListen.then((f) => f());}
    }, [])

    useEffect(() => {
        
        // D: x ~ 170
        // U: x ~ -170
        
        // X: < 60 ~ > -60
        // Y: < 60 ~ > -60

        // L: y ~ 170
        // R: y ~ -170

        // Down
        if (
            (axisX > x_boundary) &&
            (axisY <= y_boundary && axisY >= -y_boundary)
        ) {
            setCubeDirection('DOWN');
            
        // Up
        } else if (
            (axisX < -x_boundary) &&
            (axisY <= y_boundary && axisY >= -y_boundary)
        ){    
            setCubeDirection('UP');
        
        // Left
        } else if (
            (axisY > y_boundary) &&
            (axisX <= x_boundary && axisX >= -x_boundary)
        ){
            setCubeDirection('LEFT');

        // Right
        } else if (
            (axisY < -y_boundary) &&
            (axisX <= x_boundary && axisX >= -x_boundary)
        ){
            setCubeDirection('RIGHT');

        // Center
        } else {
            setCubeDirection('CENTER');
        }

    }, [axisX, axisY]);

    const value = { direction, axisX, axisY, setDirection };

    return (
        <CubeDirectionContext.Provider value={value}>
            { children }
        </CubeDirectionContext.Provider>
    )
}