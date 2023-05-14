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
    Box,
} from '@mantine/core';
import { 
    IconHexagonFilled,
    IconSettingsFilled,
    IconAlarmFilled,
    IconHourglassFilled,
    IconAlertCircle,
    IconPlus,
    IconRefresh
} from '@tabler/icons-react';
import { Shell, AppNavbar, Playground, AppBase, DynamicTopbar } from '@/components/ui';
import { useRouter } from 'next/router';
import { getTimer, updateTimer } from '@/store';
import { Timer, TimerItem } from '@/models';
import { TimerCard } from '@/components/timer';
import { v4 as uuid } from 'uuid';

export default function TimerDetailPage() {

    const [details, setDetails] = useState<Timer>(); 
    const router = useRouter();
    const timerUuid = router.query.id;
    let count = 0;

    useEffect(() => {
        onRefresh();
    }, [])

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

    const addItem = () => {
        const item = {uuid: uuid(), name: `Time Time #${count + 1}`}

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
            count++;
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
                                <Button variant='default' leftIcon={<IconPlus size='1.125rem' />} onClick={addItem}>Add</Button>
                                <Button variant='default' leftIcon={<IconRefresh size='1.125rem' />} onClick={onRefresh}>Refresh</Button>
                            </Button.Group>

                            <Accordion mt={20} chevronPosition='right' variant='contained'>
                                {details && details.timerItems &&
                                    details.timerItems.map((item) => (
                                        <Accordion.Item value={item.uuid} key={item.uuid}>
                                            <Accordion.Control>
                                                <TimerCard uuid={item.uuid} name={item.name}/>
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <Button variant='filled' color='violet' leftIcon={<IconPlus size='1.125rem' />}>Add</Button>
                                                </Box>
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