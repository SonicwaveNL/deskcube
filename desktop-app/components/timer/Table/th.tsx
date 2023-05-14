import {
    DefaultProps,
    UnstyledButton,
    Group,
    Text,
    Center,
} from '@mantine/core';
import { 
    IconHexagonFilled,
    IconSearch,
    IconChevronUp,
    IconChevronDown,
    IconSelector,
} from '@tabler/icons-react';
import { useStyles } from './th-styles';

export interface ThProps {
    children?: React.ReactNode,
    reversed?: boolean,
    sorted?: boolean,
    onSort(): void
}

export const Th = ({
    children,
    reversed,
    sorted,
    onSort,
}: ThProps) => {

    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;

    return (
        <th>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group position="apart">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon size="0.9rem" stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </th>
    )
}