import React from "react"
import { DefaultProps, ScrollArea } from "@mantine/core"
import { useStyles } from "./playground-styles"

export interface PlaygroundProps extends DefaultProps {
    children?: React.ReactNode
}

export const Playground = ({
    children,
    classNames,
    styles,
    unstyled,
    className,
    ...others
}: PlaygroundProps) => {

    const { classes } = useStyles();

    return (
        <ScrollArea w="100%" h="100vh" scrollbarSize={6} className={classes.root}>
            <div className={classes.inner}>
                {children}
            </div>
        </ScrollArea>
    )
}