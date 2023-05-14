import { ReactNode } from 'react'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications';
import { useStyles } from './shell-styles'

export const Shell = ({
    children
}:{
    children: ReactNode
}) => {
    const { classes } = useStyles();
    return (
        <>
            <MantineProvider 
                withGlobalStyles 
                withNormalizeCSS 
                theme={{
                    colorScheme: 'dark',
                }}
            >
                <div className={classes.root}>
                    <Notifications />
                    { children }
                </div>
            </MantineProvider>

        </>
    )
}