// import 'dayjs/locale/nl';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Accordion, ActionIcon, Alert, Box, Button, Group, Modal, Text, TextInput, rem, useMantineTheme } from '@mantine/core';
import { IconAlertCircle, IconClockFilled, IconEdit, IconPlayerStopFilled, IconPlus, IconSquare0Filled, IconTrashFilled } from '@tabler/icons-react';
import { useStyles } from './card-styles';
import { Moment, TimerItem } from '@/models';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useCubeDirection } from '@/context/cube-direction';

export interface TimerCardProps {
    timerItem: TimerItem;
    iconColor?: string;
    onStart?: (name: string, item: TimerItem) => void;
    onStop?: (item: TimerItem) => void;
    onDelete?: (uuid: string, name: string) => void;
}

export const TimerCard = ({
    timerItem,
    iconColor,
    onStart,
    onStop,
    onDelete,
    ...props
}: TimerCardProps) => {

    dayjs.extend(duration);
    
    const [isRunning, setRunning] = useState(false);
    const [timerTotal, setTimerTotal] = useState('');
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const [opened, { open, close }] = useDisclosure(false);
    const getColor = (color: string) => theme.colors[color][theme.colorScheme === 'dark' ? 5 : 7];

    const { direction } = useCubeDirection();

    const form = useForm({
        initialValues: {
            name: ''
        }
    })

    useEffect(() => {
        calcTotal();
    }, [])

    useEffect(() => {
        calcTotal();
    }, [timerItem])

    const startMoment = (name: string, item: TimerItem) => {
        if(onStart && !isRunning && direction === 'LEFT'){
            onStart(name, item);
            setRunning(true);
        }
    }

    const calcTotal = () => {
        if(timerItem.moments.length == 0){
            setTimerTotal(dayjs('1970-01-01 00:00').format("HH:mm:ss"));
        } else {
            var total = dayjs('1970-01-01 00:00');

            if(timerItem.moments.length == 1){
                if(timerItem.moments[0].end.length > 0){
                    var start = dayjs(timerItem.moments[0].start);
                    var end = dayjs(timerItem.moments[0].end);
                    var worked = dayjs.duration(end.diff(start));
                    total = total.add(worked);
                }
            } else {
                timerItem.moments.map(moment => {
                    console.log(moment);
                    if(moment.end.length > 0){
                        var start = dayjs(moment.start);
                        var end = dayjs(moment.end);
                        var worked = dayjs.duration(end.diff(start));
                        total = total.add(worked);
                    }
                })
            }
            setTimerTotal(total.format("HH:mm:ss"));
        }
    }

    useEffect(() => {
        if(onStop && isRunning && direction !== 'LEFT'){
            onStop(timerItem);
        }
    }, [direction])

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Modal title='Add Moment' opened={opened} onClose={close}>
                <form onSubmit={form.onSubmit((values) => startMoment(values.name, timerItem))}>
                    <TextInput mb={20} label='Name' placeholder='Name' {...form.getInputProps('name')}/>
                    
                    { direction !== 'LEFT' ? 
                        <Alert icon={<IconAlertCircle size="1rem" />} title="Before starting:" color="cyan" mb={20}>
                            Cube is on it's <b>{direction}</b> side, tilt the cube on it's <b>LEFT</b> side and press <b>Start</b> to continue.
                        </Alert>
                    : 
                        <Button type='submit'>Start</Button>
                    }

                </form>
            </Modal>

            <Accordion.Control {...props}>
                <Group noWrap>
                    <IconClockFilled size={rem(20)} color={getColor(iconColor ? iconColor : 'blue')}/>
                    <div className={classes.box}>
                        <Text className={classes.title}>{timerItem?.name}</Text>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ActionIcon variant='filled' color='violet' sx={{ marginRight: '0.5rem' }} onClick={open}>
                                <IconPlus size='1.125rem'/>
                            </ActionIcon>
                            <ActionIcon variant='filled' color='red' onClick={() => onDelete ? onDelete(timerItem.uuid, timerItem.name) : null}>
                                <IconTrashFilled size='1.125rem'/>
                            </ActionIcon>
                        </Box>
                        <Text sx={{ marginLeft: '2rem'}}>{timerTotal}</Text>
                    </div>
                </Group>
            </Accordion.Control>
        </Box>
    )
}