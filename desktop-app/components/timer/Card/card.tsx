import { ActionIcon, Group, Text, rem, useMantineTheme } from '@mantine/core';
import { IconClockFilled, IconEdit, IconPlus } from '@tabler/icons-react';
import { useStyles } from './card-styles';

export interface TimerCardProps {
    uuid: string;
    name: string;
    iconColor?: string;
}

export const TimerCard = ({
    uuid,
    name,
    iconColor,
}: TimerCardProps) => {
    
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const getColor = (color: string) => theme.colors[color][theme.colorScheme === 'dark' ? 5 : 7];

    return (
        <Group noWrap>
            <IconClockFilled size={rem(20)} color={getColor(iconColor ? iconColor : 'blue')}/>
            <div className={classes.box}>
                <Text className={classes.title}>{name}</Text>
                <Text>00:00:00</Text>
            </div>
        </Group>
    )
}