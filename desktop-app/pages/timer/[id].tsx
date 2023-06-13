import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
    Title,
    Group,
    Text,
    Alert,
    Accordion,
    Button,
    ActionIcon,
    Modal,
    Box,
    TextInput,
    Paper,
    Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { 
    IconHexagonFilled,
    IconSettingsFilled,
    IconAlarmFilled,
    IconHourglassFilled,
    IconAlertCircle,
    IconPlus,
    IconRefresh,
    IconTrashFilled
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useDisclosure } from '@mantine/hooks';
import { v4 as uuid } from 'uuid';
import { Shell, AppNavbar, Playground, AppBase, DynamicTopbar } from '@/components/ui';
import { getTimer, updateTimer } from '@/store';
import { Timer, TimerItem } from '@/models';
import { TimerCard } from '@/components/timer';
import dayjs from 'dayjs';
import { useCubeDirection } from '@/context/cube-direction';

export default function TimerDetailPage() {

    const [current, setCurrent] = useState('');
    const [isRunning, setRunning] = useState(false);
    const [details, setDetails] = useState<Timer>(); 
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter();
    const timerUuid = router.query.id;

    const form = useForm({
        initialValues: {
            name: ''
        }
    })

    useEffect(() => {
        onRefresh();
    }, [])

    const onSubmit = (name: string) => {
        const item = {uuid: uuid(), name: name, moments: []}

        if (typeof timerUuid === 'string') {
            console.log('Trying to add item:', item);
            
            if (typeof details !== 'undefined'){
                if (typeof details.timerItems !== 'undefined'){
                    details.timerItems.push(item);
                } else {
                    details.timerItems = [item];
                }
            }
            
            updateTimer(timerUuid, details as Timer)
            .then(() => onRefresh())
            .catch(console.error)
         
            notifications.show({
                title: `Added '${name}'`,
                message: `Added item '${name}' to the Timer!`,
                color: 'green',
                withBorder: true
            })
        }
    }

    const onRefresh = () => {
        if (typeof timerUuid === 'string') {
            getTimer(timerUuid)
            .then((data) => {
                console.log(data);
                setDetails(data as Timer);
            })
            .catch(console.error)
        }
    }

    const onDelete = (uuid: string, name: string) => {
        if (typeof timerUuid === 'string') {   
            if (typeof details !== 'undefined'){
                details.timerItems = details.timerItems.filter(item => item.uuid !== uuid);
                updateTimer(timerUuid, details as Timer)
                .then(() => onRefresh())
                .catch(console.error)
    
                notifications.show({
                    title: `Deleted '${name}'`,
                    message: `Deleted the '${name}' Timer!`,
                    color: 'red',
                    withBorder: true
                })
            }
        }
    }

    const onStart = (name: string, item: TimerItem) => {
        if(!isRunning){
            if (typeof timerUuid === 'string') {
                if (typeof details !== 'undefined'){

                    var itemIndex = details.timerItems.findIndex(obj => obj.uuid == item.uuid);
                    const momentUUID = uuid();
                    const moment = {uuid: momentUUID, name: name, start: dayjs().toString(), end: ''}

                    if (typeof item.moments !== 'undefined'){
                        details.timerItems[itemIndex].moments.push(moment);
                    } else {
                        details.timerItems[itemIndex].moments = [moment];
                    }
                    
                    updateTimer(timerUuid, details as Timer)
                    .then(() => {
                        onRefresh()
                        setRunning(true);
                        setCurrent(momentUUID);
                        notifications.show({
                            title: `Started Timer`,
                            message: `Started timer for '${item.name}'`,
                            color: 'green',
                            withBorder: true
                        })
                    })
                    .catch(console.error)
                }
            }
        }
    }

    const onStop = (item: TimerItem) => {
        if(isRunning && current.length > 0){
            if (typeof timerUuid === 'string') {
                if (typeof details !== 'undefined'){
                    var itemIndex = details.timerItems.findIndex(obj => obj.uuid == item.uuid);
                    var momentIndex = details.timerItems[itemIndex].moments.findIndex(obj => obj.uuid == current);

                    console.log(details.timerItems[itemIndex].moments[momentIndex]);

                    details.timerItems[itemIndex].moments[momentIndex].end = dayjs().toString();

                    updateTimer(timerUuid, details as Timer)
                    .then(() => {
                        onRefresh()
                        setRunning(false);
                        setCurrent('');
                        notifications.show({
                            title: `Stopped Timer`,
                            message: `Stopped timer '${details.timerItems[itemIndex].moments[momentIndex].name}'`,
                            color: 'green',
                            withBorder: true
                        })
                    })
                    .catch(console.error)
                }
            }
        }
    }

    return (
        <>
            <Head>
                <title>Timer: {details ? details.name : '???'} — DeskCube — Prototype App</title>
            </Head>
            <main>
                <Shell>
                    <AppNavbar>
                        <AppNavbar.Item link='/' label='Overview' icon={<IconHexagonFilled size='1.5rem' />}/>
                        <AppNavbar.Item link='/timer' activeColor='violet.5' label='Timer' icon={<IconAlarmFilled size='1.5rem' />} isActive/>
                        <AppNavbar.Item link='/settings' label='Settings' icon={<IconSettingsFilled size='1.5rem' />}/>
                    </AppNavbar>
                    <AppBase>
                        <DynamicTopbar/>

                        <Modal title='Add Work Moment' opened={opened} onClose={close}>
                            <form onSubmit={form.onSubmit((values) => onSubmit(values.name))}>
                                <TextInput mb={20} label='Name' placeholder='Name' {...form.getInputProps('name')}/>
                                <Button type='submit'>Submit</Button>
                            </form>
                        </Modal>

                        <Playground>
                            <Group spacing='xs' mb={20}>
                                <Text size='md' color='violet.5'>
                                    <IconHourglassFilled size='2rem'/>
                                </Text>
                                <Title order={1}>{details ? details.name : '???'}</Title>
                                <Text color='dimmed' size='xs'>{details ? details.uuid : ''}</Text>
                            </Group>
                            
                            { !uuid && details &&
                                <Alert icon={<IconAlertCircle size='1rem' />} title='Whoops!' color='red' variant='outline'>
                                    Your Timer has an invalid 'id', please go back to the 'Timers' page and try again!
                                </Alert>
                            }

                            <Button.Group>
                                <Button variant='default' leftIcon={<IconPlus size='1.125rem' />} onClick={open}>Add</Button>
                                <Button variant='default' leftIcon={<IconRefresh size='1.125rem' />} onClick={onRefresh}>Refresh</Button>
                            </Button.Group>

                            <Accordion mt={20} chevronPosition='right' variant='contained'>
                                {details && details.timerItems &&
                                    details.timerItems.map((item) => (
                                        <Accordion.Item value={item.uuid} key={item.uuid}>
                                            <TimerCard timerItem={item} onStart={onStart} onDelete={onDelete} onStop={onStop}/>
                                            <Accordion.Panel>
                                                {item.moments && 
                                                    item.moments.map(moment => (
                                                        <Paper withBorder sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} px={40} py={15} mb={10}>
                                                            <Text weight={600} sx={{ marginRight: '1.5rem', flex: 1 }}>{moment.name}</Text>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                { moment.end.length > 0 ?
                                                                    <Badge color='green' variant='filled' leftSection={<IconHourglassFilled size='0.6rem' />}>
                                                                        {dayjs('1970-01-01 00:00').add(dayjs.duration(dayjs(moment.end).diff(dayjs(moment.start)))).format("HH:mm:ss")}
                                                                    </Badge>
                                                                :
                                                                    <Group>
                                                                        <Text>Running...</Text>
                                                                        <Button sx={{ marginLeft: '1.5rem' }} variant='default' leftIcon={<IconPlus size='1.125rem' />} onClick={() => onStop(item)}>Stop</Button>
                                                                    </Group>
                                                                }
                                                            </Box>
                                                        </Paper>
                                                    ))
                                                }
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    ))
                                }
                            </Accordion>
                        </Playground>
                    </AppBase>
                </Shell>
            </main>
        </>
      );
}