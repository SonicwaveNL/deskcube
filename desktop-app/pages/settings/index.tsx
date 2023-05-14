import Head from 'next/head';
import {
    Title,
    Group,
    Text,
} from '@mantine/core';
import { 
    IconHexagonFilled,
    IconSettingsFilled,
    IconAlarmFilled
} from '@tabler/icons-react';
import { Shell, AppNavbar, Playground, AppBase, DynamicTopbar } from '@/components/ui';

export default function SettingsPage() {
    return (
        <>
            <Head>
                <title>Settings — DeskCube — Prototype App</title>
            </Head>
            <main>
                <Shell>
                    <AppNavbar>
                        <AppNavbar.Item link='/' label='Overview' icon={<IconHexagonFilled size='1.5rem' />}/>
                        <AppNavbar.Item link='/timer' label='Timer' icon={<IconAlarmFilled size='1.5rem' />}/>
                        <AppNavbar.Item link='/settings' activeColor='red.5' label='Settings' icon={<IconSettingsFilled size='1.5rem' />} isActive/>
                    </AppNavbar>
                    <AppBase>
                        <DynamicTopbar/>
                        <Playground>
                            <Group spacing='xs' mb={20}>
                                <Text size='md' color='red.5'>
                                    <IconSettingsFilled size='2rem'/>
                                </Text>
                                <Title order={1}>Settings</Title>
                            </Group>
                        </Playground>
                    </AppBase>
                </Shell>
            </main>
        </>
      );
}