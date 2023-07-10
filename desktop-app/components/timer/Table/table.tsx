import { useEffect, useState } from 'react';
import { 
    Paper,
    DefaultProps,
    ScrollArea,
    Table,
    Text,
    ActionIcon,
    Group,
} from '@mantine/core';
import {
    IconTrashFilled,
} from '@tabler/icons-react';
import { Timer } from '@/models/timers-model';
import { sortData } from '@/utils/sort-data';
import { Th } from './th';
import { useStyles } from './table-styles';
import Link from 'next/link';

export interface TableProps extends DefaultProps {
    data: Timer[];
    onDelete?: (uuid: string, name: string) => any;
}

export const TimerTable = ({
    data,
    onDelete,
}: TableProps) => {
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState<keyof Timer | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const { classes } = useStyles();

    useEffect(() => {
        setSortedData(data);
    }, [data]);

    const setSorting = (field: keyof Timer) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        if (value.length <= 0){
            setSearch('');
            setSortedData(data);
        }
        setSearch(value);
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const rows = sortedData.map((row) => (
        <tr key={row.uuid}>
            <td className={classes.item}>
                <Link href={`/timer/${row.uuid}`}>
                    <Text size='sm' ml='xs'>{row.name}</Text>
                </Link>
            </td>
            {/* <td className={classes.itemTime}>
                <Group>
                    <Text size='sm' ml='xs'>{row.time ? row.time.toLocaleTimeString() : '00:00:00'}</Text>
                </Group>
            </td> */}
            <td className={classes.button}>
                <ActionIcon variant='filled' color='red' onClick={() => onDelete ? onDelete(row.uuid, row.name) : null}>
                    <IconTrashFilled size='1.125rem'/>
                </ActionIcon>
            </td>
        </tr>
    ));

    return (
        <Paper p='md' withBorder>
            {/* <TextInput
                placeholder='Search'
                mb='lg'
                icon={<IconSearch size="0.9rem" stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
            /> */}
            <ScrollArea>
                <Table striped highlightOnHover withBorder classNames={classes.table}>
                    <thead>
                        <Th
                          sorted={sortBy === 'name'}
                          reversed={reverseSortDirection}
                        >
                            Project
                        </Th>
                        <Th
                          sorted={sortBy === 'name'}
                          reversed={reverseSortDirection}
                          onSort={() => setSorting('name')}
                        >
                            Total
                        </Th>
                        <th className={classes.button}/>
                    </thead>
                    <tbody>
                        {rows.length > 0 ? (rows) : (
                            <tr>
                                <td colSpan={3}>
                                    <Text weight={500} align="center">
                                        Nothing found
                                    </Text>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </ScrollArea>
        </Paper>
    )
}