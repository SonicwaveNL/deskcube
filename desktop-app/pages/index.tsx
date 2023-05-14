import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Paper, SimpleGrid, Group, Text, Title } from '@mantine/core';
import { 
    IconHexagonFilled,
    IconSettingsFilled,
    Icon360,
    IconRotate,
    IconRotate360,
    Icon3dRotate,
    IconWaveSquare,
    IconAxisX,
    IconAxisY,
    IconAlarmFilled
} from '@tabler/icons-react';
import { listen } from '@tauri-apps/api/event';
import { Shell, AppNavbar, Playground, AppBase, DynamicTopbar } from '@/components/ui';
import { AHRS, DefaultAHRS } from '@/models';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Box } from '@/components/visuals';
import { Euler, Vector3 } from 'three';
import { useCubeDirection } from '@/context/cube-direction';
import { useCubeAHRS } from '@/context/cube-ahrs';

interface AHRSEventProps {
    payload: AHRS
}

export default function Home() {

    const [isLoading, setLoading] = useState(false);
    const [ahrs, setAHRS] = useState(DefaultAHRS);
    
    const [oldDirection, setOldDirection] = useState('C');
    
    const [rotation, setRotation] = useState(new Euler(0, 0, 0));
    
    const { roll, pitch, yaw, heading, frequency } = useCubeAHRS();
    const { direction, axisX, axisY } = useCubeDirection();

    // Init the Bluetooth process
    // useEffect(() => {
    //     invoke('init_process')
    //     .then((data) => console.log('DATA', data))
    //     .catch(console.error)
    // }, []);

    // useEffect(() => {
    //     invoke('init_blue')
    //     .then((data) => console.log('BLUE', data))
    //     .catch(console.error)
    // }, []);

    // Start listing to the 'PROGRESS' events
    // useEffect(() => {
    //     const unListen = listen("PROGRESS", (e: AHRSEventProps) => {
    //         setAHRS(e.payload)
    //     });
    //     return () => {
    //         unListen.then((f) => f());
    //     }
    // }, [])

    // const startBLE = () => {
    //     setLoading(true)
    //     setTimeout(async () => {
    //         const { appWindow } = await import("@tauri-apps/api/window");
    //         await invoke("start_ble", { window: appWindow });
    //         setLoading(false)
    //     }, 1000)
    // }

    // const startBLE = () => {
    //     setLoading(true)
    //     emit('start_ble', { message: 'cool' });
    //     console.log('STARTED HERE!')
    //     setLoading(false)
    // }

    // const eular = new Euler(0, 1, 1.57);
    // const rotation = new Vector3(0, 1, 1.57);

    useEffect(() => {
        setRotation(new Euler(0, 0, 0, 'XYZ'));
        // setRotation(new Euler(roll, pitch, yaw, 'XYZ'));
        // setRotation(new Euler(roll, pitch, 0, 'XYZ'));
    }, [roll, pitch, yaw])

    // useEffect(() => {

    // }, [axisX, axisY])

    return (
    <>
        <Head>
            <title>Overview — DeskCube — Prototype App</title>
        </Head>
        <main>
            <Shell>
                <AppNavbar>
                    <AppNavbar.Item link='/' label='Overview' icon={<IconHexagonFilled size='1.5rem' />} isActive/>
                    <AppNavbar.Item link='/timer' label='Timer' icon={<IconAlarmFilled size='1.5rem' />}/>
                    <AppNavbar.Item link='/settings'label='Settings' icon={<IconSettingsFilled size='1.5rem' />}/>
                </AppNavbar>
                <AppBase>
                    <DynamicTopbar/>
                    <Playground>
                        <Group spacing='xs' mb={20}>
                            <Text size='md' color='cyan.5'>
                                <IconHexagonFilled size='2rem'/>
                            </Text>
                            <Title order={1}>Overview</Title>
                        </Group>

                        <Paper p='md' mb={30} w='100%' h={500} withBorder sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* <Loader variant='bars' size='sm' /> */}
                            {/* <Text size='sm' ml={10} color='dimmed'>
                                Waiting for Connection...
                            </Text> */}
                            <Canvas>
                                {/* <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow /> */}
                                <ambientLight intensity={0.5} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                                <pointLight position={[-10, -10, 5]} />
                                <Environment preset="sunset" background/>
                                <Box rotation={rotation}/>
                                <OrbitControls />
                                {/* <Environment preset="city" background blur={0} /> */}
                            </Canvas>
                        </Paper>

                        <SimpleGrid cols={5}>

                            <Paper p='md' withBorder>
                                <Text size='sm' align='right' color='dimmed'>Roll</Text>
                                <Group position='apart'>
                                    <IconRotate size='1.4rem'/>
                                    {/* <Text size='lg' weight={700}>{ ahrs.roll!.toString()}</Text> */}
                                    <Text size='lg' weight={700}>{ roll ? roll.toFixed(2) : '0'}</Text>
                                </Group>
                            </Paper>
                            <Paper p='md' withBorder>
                                <Text size='sm' align='right' color='dimmed'>Pitch</Text>
                                <Group position='apart'>
                                    <IconRotate360 size='1.4rem'/>
                                    {/* <Text size='lg' weight={700}>{ ahrs.pitch!.toFixed(2) }</Text> */}
                                    <Text size='lg' weight={700}>{ pitch ? pitch.toFixed(2) : '0'}</Text>
                                </Group>
                            </Paper>
                            <Paper p='md' withBorder>
                                <Text size='sm' align='right' color='dimmed'>Yaw</Text>
                                <Group position='apart'>
                                    <Icon360 size='1.4rem'/>
                                    {/* <Text size='lg' weight={700}>{ ahrs.yaw!.toFixed(2)}</Text> */}
                                    <Text size='lg' weight={700}>{ yaw ? yaw.toFixed(2) : '0'}</Text>
                                </Group>
                            </Paper>
                            <Paper p='md' withBorder>
                                <Text size='sm' align='right' color='dimmed'>Heading</Text>
                                <Group position='apart'>
                                    <Icon3dRotate size='1.4rem'/>
                                    <Text size='lg' weight={700}>{ heading ? heading.toFixed(2) : '0'}</Text>
                                </Group>
                            </Paper>
                            <Paper p='md' withBorder>
                                <Text size='sm' align='right' color='dimmed'>Frequency</Text>
                                <Group position='apart'>
                                    <IconWaveSquare size='1.4rem'/>
                                    <Text size='lg' weight={700}>{ frequency ? frequency.toString() : '0' }</Text>
                                </Group>
                            </Paper>

                            <Paper p='md' withBorder>
                                <Text size='sm' align='right' color='dimmed'>X Axis</Text>
                                <Group position='apart'>
                                    <IconAxisX size='1.4rem'/>
                                    <Text size='lg' weight={700}>{ axisX ? axisX.toString() : '0'}</Text>
                                </Group>
                            </Paper>
                            <Paper p='md' withBorder>
                                <Text size='sm' align='right' color='dimmed'>Y Axis</Text>
                                <Group position='apart'>
                                    <IconAxisY size='1.4rem'/>
                                    <Text size='lg' weight={700}>{ axisY ? axisY.toString() : '0' }</Text>
                                </Group>
                            </Paper>
                            <Paper p='md' withBorder>
                                <Text size='sm' align='right' color='dimmed'>Y Axis</Text>
                                <Group position='apart'>
                                    <IconAxisY size='1.4rem'/>
                                    <Text size='lg' weight={700}>{ oldDirection ? oldDirection : 'C' }</Text>
                                </Group>
                            </Paper>
                            <Paper p='md' withBorder>
                                <Text size='sm' align='right' color='dimmed'>Y Axis</Text>
                                <Group position='apart'>
                                    <IconAxisY size='1.4rem'/>
                                    <Text size='lg' weight={700}>{ direction ? direction : 'C' }</Text>
                                </Group>
                            </Paper>

                        </SimpleGrid>
                    </Playground>
                </AppBase>
            </Shell>
        </main>
    </>
  );
}
