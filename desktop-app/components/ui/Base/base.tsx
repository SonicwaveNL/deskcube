import React from "react"
import { DefaultProps, Paper } from "@mantine/core"
import { useStyles } from "./base-styles"

export interface AppBaseProps extends DefaultProps {
    children?: React.ReactNode
}

export const AppBase = ({
    children,
    classNames,
    styles,
    unstyled,
    className,
    ...others
}: AppBaseProps) => {

    const { classes } = useStyles();

    return (
        <Paper w="100%" h="auto" mih="100vh" className={classes.root} {...others}>
            {children}
        </Paper>
    )
}