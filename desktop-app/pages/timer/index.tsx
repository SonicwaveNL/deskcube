import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
    Title,
    Group,
    Text,
    Button,
    Modal,
    TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { 
    IconHexagonFilled,
    IconSettingsFilled,
    IconAlarmFilled,
    IconPlus,
    IconRefresh,
    IconX
} from '@tabler/icons-react';
import { Shell, AppNavbar, Playground, AppBase, DynamicTopbar } from '@/components/ui';
import { TimerTable } from '@/components/timer';
import { Timer } from '@/models';
import { createTimer, getTimers, deleteTimer } from '@/store';

export default function TimerPage() {

    const [timersData, setTimersData] = useState<Timer[]>();
    const [opened, { open, close }] = useDisclosure(false);
    const [isFirst, setFirst] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: ''
        }
    })

    useEffect(() => {
        onRefresh();
    }, [])

    const toRowsData = (data: any) => {
        return data.map((value: [string, Timer], id: number) => {
            return value[1] as Timer;
        })
    }

    const onSubmit = (name: string) => {
        createTimer(name)
        .then(() => onRefresh())
        .catch(console.error)

        notifications.show({
            title: `Created '${name}'`,
            message: `Created the '${name}' Timer!`,
            color: 'green',
            withBorder: true
        })
    }

    const onCreate = () => {
        createTimer('vanilla')
        .then(() => onRefresh())
        .catch(console.error)

        notifications.show({
            title: `Created 'vanilla'`,
            message: `Created the 'vanilla' Timer!`,
            color: 'green',
            withBorder: true
        })
    };

    const onRefresh = () => {
        getTimers()
        .then((data) => {
            setTimersData(toRowsData(data));
            if(isFirst){
                notifications.show({
                    title: `${data.length} Timers loaded`,
                    message: `Loaded '${data.length}' Timers from storage.`,
                    withBorder: true
                });
                setFirst(false);
            }
        })
        .catch(console.error)
    }

    const onDelete = (uuid: string, name: string) => {
        deleteTimer(uuid)
        .then(() => onRefresh())
        .catch(console.error)

        notifications.show({
            title: `Deleted '${name}'`,
            message: `Deleted the '${name}' Timer!`,
            color: 'red',
            withBorder: true
        })
    }

    return (
        <>
            <Head>
                <title>Timer — DeskCube — Prototype App</title>
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

                        <Modal title='Create Timer' opened={opened} onClose={close}>
                            <form onSubmit={form.onSubmit((values) => onSubmit(values.name))}>
                                <TextInput mb={20} label='Name' placeholder='Name' {...form.getInputProps('name')}/>
                                <Button type='submit'>Submit</Button>
                            </form>
                        </Modal>

                        <Playground>
                            <Group spacing='xs' mb={20}>
                                <Text size='md' color='violet.5'>
                                    <IconAlarmFilled size='2rem'/>
                                </Text>
                                <Title order={1}>Timer</Title>
                            </Group>

                            <Button.Group mb={20}>
                                <Button variant='default' onClick={open} leftIcon={<IconPlus size='1.125rem'/>}>
                                    Create
                                </Button>
                                <Button variant='default' onClick={onCreate} leftIcon={<IconPlus size='1.125rem'/>}>
                                    Dummy
                                </Button>
                                <Button variant='default' onClick={onRefresh} leftIcon={<IconRefresh size='1.125rem'/>}>
                                    Refresh
                                </Button>
                            </Button.Group>

                            { !timersData 
                            ?
                                <Text>Loading...</Text>
                            :
                                <TimerTable data={timersData} onDelete={onDelete}/>
                            }
                        
                        </Playground>
                    </AppBase>
                </Shell>
            </main>
        </>
      );
}