import React, { useState, useEffect } from 'react';
import {
    Navbar,
    DefaultProps,
    Center,
    Stack,
} from '@mantine/core';
import { IconPlugConnected, IconPlugConnectedX } from '@tabler/icons-react';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { LogoButton } from '../LogoButton/logo-button';
import { AppNavbarItem } from './navbar-item';
import { useStyles } from './navbar-styles';
import { notifications } from '@mantine/notifications';

export interface AppNavbarProps extends DefaultProps {
    children?: React.ReactNode;
}

const AppNavbar = ({
    children,
    classNames,
    styles,
    unstyled,
    className,
    ...others
}: AppNavbarProps) => {
 
    const { classes } = useStyles();
    
    const [connected, setConnected] = useState<boolean>(false);
    const [isLoading, setLoading] = useState(false);
    
    const [roll, setRoll] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [yaw, setYaw] = useState(0);
    const [head, setHead] = useState(0);
    
    const [axisX, setAxisX] = useState(0);
    const [axisY, setAxisY] = useState(0);
    
    const [direction, setDirection] = useState('C');
    const [imprDirection, setImprDirection] = useState('C');

    
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
        const unListen = listen("DIRECTIONAL", (e: { payload: string }) => {
            setDirection(e.payload)
        });
        return () => {unListen.then((f) => f());}
    }, [])

    useEffect(() => {
        const unListen = listen("INTERUPT", (e: { payload: string }) => {
            setLoading(false);
            notifications.update({
                id: 'start-ble',
                color: 'red',
                title: 'Error',
                message: `Connection with DeskCube was interupted because of: '${e.payload}', please try to re-connect!`,
                autoClose: 2000,
            })
        });
        return () => {unListen.then((f) => f());}
    }, [])

    useEffect(() => {
        const unListen = listen("CONNECTED", (e: { payload: string }) => {
            setLoading(false);
            notifications.update({
                id: 'start-ble',
                color: 'teal',
                title: 'Connected!',
                message: 'Connected with DeskCube!',
                autoClose: 2000,
            })
        });
        return () => {unListen.then((f) => f());}
    }, [])

    const startBLE = () => {
        
        setLoading(true)

        notifications.show({
            id: 'start-ble',
            loading: true,
            title: 'Connecting...',
            message: 'Trying to connect with DeskCube',
            autoClose: false,
            withCloseButton: false,
        })

        //CONNECTED
        invoke('init_blue')
        .then((data) => {
            console.log('BLE', data)
        })
        .catch(console.error)
    }

    return (
        <Navbar width={{ base: 60 }} px='md' className={classes.navbar} {...others}>

            <Navbar.Section className={classes.section}>
                <Center>
                    <LogoButton/>
                </Center>
            </Navbar.Section>

            <Navbar.Section grow className={classes.section}>
                <Stack justify='center' mt={20} mb={20} spacing={20}>
                    {children}
                </Stack>
            </Navbar.Section>

            <Navbar.Section py={10}>
                <Center>
                    { connected ?
                        <AppNavbarItem color='green' label='Connected' icon={<IconPlugConnected size='1.5rem' />}/>
                    :
                        <AppNavbarItem color='red' label='Not Connected' icon={<IconPlugConnectedX size='1.5rem' onClick={startBLE}/>}/>
                    }
                </Center>
            </Navbar.Section>
            
            {/* <Navbar.Section grow component={ScrollArea} className={classes.section}>
                <Stack justify='center' spacing={0}>
                    {children}
                </Stack>
            </Navbar.Section> */}
            
        </Navbar>
    );
}

export default Object.assign(AppNavbar, {
    Item: AppNavbarItem
})