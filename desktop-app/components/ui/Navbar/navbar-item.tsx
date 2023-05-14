import {
    DefaultProps,
    ActionIcon,
    Tooltip,
} from '@mantine/core';
import { useStyles } from './navbar-styles';
import Link from 'next/link';

export interface AppNavbarItemProps extends DefaultProps {
    label?: string,
    icon?: JSX.Element,
    color?: string,
    activeColor?: string,
    isActive?: boolean
    link?: string,
    loading?: boolean,
}

export const AppNavbarItem = ({
    label,
    classNames,
    styles,
    unstyled,
    className,
    icon,
    color,
    activeColor,
    isActive,
    link,
    loading,
    ...others
}: AppNavbarItemProps) => {
    const colorActive = activeColor ? activeColor : 'cyan';

    return (
        <Tooltip label={label} color='gray' position='right' transitionProps={{ transition: 'fade', duration: 300 }}>
            { link 
            ? 
                <Link href={link ? link : '/'}>
                    <ActionIcon loading={loading} color={isActive ? colorActive : color} variant="subtle" mx='auto' size='lg' {...others}>
                        { icon }
                    </ActionIcon>
                </Link>
            :
                <ActionIcon loading={loading} color={isActive ? colorActive : color} variant="subtle" mx='auto' size='lg' {...others}>
                    { icon }
                </ActionIcon>
            }
        </Tooltip>
    )
}