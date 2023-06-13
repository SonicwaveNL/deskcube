import React, { useEffect, useState } from 'react'
import { DefaultProps, Header, ActionIcon, Text, Badge } from '@mantine/core'
import { IconX, IconMinus, IconSquare  } from '@tabler/icons-react';
import { useStyles } from './topbar-styles'
import { useIsClient } from '@/context/is-client-context';
import { appWindow } from '@tauri-apps/api/window'
import { useCubeDirection } from '@/context/cube-direction';
import { listen } from '@tauri-apps/api/event';

export interface TopbarProps extends DefaultProps {
    children?: React.ReactNode
}

const Topbar = ({
    children,
    classNames,
    styles,
    unstyled,
    className,
    ...others
}: TopbarProps) => {

    const { isClient } = useIsClient();
    const { classes } = useStyles();
    const { direction, axisX, axisY } = useCubeDirection();

    useEffect(() => {
        const unListen = listen("CONNECTED", (e: { payload: string }) => {});
        return () => {unListen.then((f) => f());}
    }, [])

    return (
        <>
            { isClient &&
                <Header height={60} className={classes.root} {...others}>
                    <div className={classes.menu} data-tauri-drag-region>
                        <Text weight={900}>DeskCube</Text>
                        <Text ml={10} size='sm' color='dimmed'>Prototype Application v1</Text>
                        {children}
                    </div>
                    <div className={classes.actions}>
                        <Badge variant='filled' sx={{ marginRight: '.5rem'}}>{direction}</Badge>
                        <Badge variant='filled' sx={{ marginRight: '.5rem'}}>X: {axisX}</Badge>
                        <Badge variant='filled' sx={{ marginRight: '1.5rem'}}>Y: {axisY}</Badge>

                        <ActionIcon onClick={() => appWindow.minimize()} variant='subtle' mx='auto' size='md'>
                            <IconMinus size='.8rem'/>
                        </ActionIcon>
                        <ActionIcon onClick={() => appWindow.toggleMaximize()}  variant='subtle' mx='auto' size='md'>
                            <IconSquare size='.8rem'/>
                        </ActionIcon>
                        <ActionIcon onClick={() => appWindow.close()}  variant='subtle' mx='auto' size='md'>
                            <IconX size='.8rem'/>
                        </ActionIcon>
                    </div>
                </Header>
            }
        </>
    )
}

export default Topbar;