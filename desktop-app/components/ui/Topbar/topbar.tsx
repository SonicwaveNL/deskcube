import React, { useEffect, useState } from 'react'
import { DefaultProps, Header, ActionIcon, Text } from '@mantine/core'
import { IconX, IconMinus, IconSquare  } from '@tabler/icons-react';
import { useStyles } from './topbar-styles'
import { useIsClient } from '@/context/is-client-context';
import { appWindow } from '@tauri-apps/api/window'

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