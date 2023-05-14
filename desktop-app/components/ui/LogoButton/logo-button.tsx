import {
    UnstyledButton,
    UnstyledButtonProps,
    Group,
    Avatar,
    Text,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useStyles } from './logo-button-styles';
// import Image from 'next/image';
import { Image } from '@mantine/core';

export interface LogoButtonProps extends UnstyledButtonProps {
    image?: string;
}

export const LogoButton = ({
    image,
    ...others 
}: LogoButtonProps) => {
    
    const { classes } = useStyles();

    return (
        <UnstyledButton className={classes.logo} {...others}>
            <Image
                src={'/deskcube_basic.svg'}
                mx='auto'
                alt='DeskCube logo'
            />
        </UnstyledButton>
    );
}