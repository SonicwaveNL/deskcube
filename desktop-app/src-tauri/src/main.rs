// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri;
use std::{thread, f32, i32};
use std::char::from_digit;
use byteorder::{ByteOrder, LittleEndian, BigEndian};

use btleplug::api::{bleuuid::uuid_from_u16, bleuuid::BleUuid, CharPropFlags, Central, CentralEvent, Manager as _, Peripheral as _, ScanFilter};
use btleplug::platform::{Adapter, Manager, Peripheral};
use std::time::Duration;
use tokio::time;
use futures::stream::StreamExt;
use std::error::Error;
use uuid::Uuid;
use tauri::Window;

// use std::error::Error;
// use btleplug::api::{bleuuid::BleUuid, Central, CentralEvent, Manager as _, ScanFilter};
// use btleplug::platform::{Adapter, Manager};

#[derive(Clone, serde::Serialize)]
struct AHRSData {
    roll: f32,
    pitch: f32,
    yaw: f32,
    frequency: f32
}

#[tauri::command]
fn test_data() -> AHRSData {
    return AHRSData {
        roll: 10.0,
        pitch: 20.0,
        yaw: 30.0,
        frequency: 40.0
    }
}

// init a background process on the command, and emit periodic events only to the window that used the command
#[tauri::command]
fn init_process(window: tauri::Window) {
    std::thread::spawn(move || {
        let mut count = 0.0;
        loop {
            window.emit("PROGRESS", AHRSData {
            roll: 50.0 + count,
            pitch: 60.0 + count,
            yaw: 70.0 + count,
            frequency: 80.0 + count
            }).unwrap();
            let delay = Duration::from_millis(500);
            thread::sleep(delay);
            count += 1.0;
        }
    });
}

// Bluetooth stufff
/// Only devices whose name contains this string will be tried.
// const PERIPHERAL_NAME_MATCH_FILTER: &str = "DeskCube";
/// UUID of the characteristic for which we should subscribe to notifications.
// const LIGHT_CHARACTERISTIC_UUID: Uuid = uuid_from_u16(0xFFE9);

// const ASHR_UUID_CHAR_DATA: Uuid     = uuid_from_u16(0x2101);
const ASHR_UUID_CHAR_ROLL: Uuid        = uuid_from_u16(0x2101);
const ASHR_UUID_CHAR_PITCH: Uuid       = uuid_from_u16(0x2102);
const ASHR_UUID_CHAR_YAW: Uuid         = uuid_from_u16(0x2103);
const ASHR_UUID_CHAR_HEAD: Uuid        = uuid_from_u16(0x2104);
const ASHR_UUID_CHAR_FREQUENCY: Uuid   = uuid_from_u16(0x2105);

const ACC_UUID_CHAR_POS_X: Uuid        = uuid_from_u16(0x3101);
const ACC_UUID_CHAR_POS_Y: Uuid        = uuid_from_u16(0x3102);
// const ACC_UUID_CHAR_POS_Z: Uuid        = uuid_from_u16(0x3103);
const ACC_UUID_CHAR_DIRECTIONAL: Uuid  = uuid_from_u16(0x3104);

// const NOTIFY_CHARACTERISTIC_UUID: Uuid = uuid_from_u16(0xfff2);

async fn main_blue(window: Window) -> Result<(), Box<dyn Error>>{

    println!(">>>> Init Main Bluetooth process");
    let manager = Manager::new().await.unwrap();

    // get the first bluetooth adapter
    println!(">>>> Get First Bluetooth adapter");
    let central = manager
        .adapters()
        .await
        .expect("Unable to fetch adapter list.")
        .into_iter()
        .nth(0)
        .expect("Unable to find adapters.");

    // start scanning for devices
    println!(">>>> Start scanning for central");
    central.start_scan(ScanFilter::default()).await?;
    
    // instead of waiting, you can use central.events() to get a stream which will
    // notify you of new devices, for an example of that see examples/event_driven_discovery.rs
    time::sleep(Duration::from_secs(2)).await;
    
    // find the device we're interested in
    println!(">>>> Searching devices");
    let found_device = find_device(&central).await;
    
    let cube = match found_device {
        Some(device) => device,
        None => {
            window.emit("INTERUPT", "DeskCube was not Found").unwrap();
            panic!("DeskCube was not Found");
        }
    };

    // connect to the device
    // let connected = cube.connect().await.unwrap();
    println!(">>>> Found DeskCube");
    let connection = cube.connect().await;

    let is_connected = match connection {
        Ok(connected) => connected,
        Error => {
            window.emit("INTERUPT", "Couldn't connect to DeskCube").unwrap();
            panic!("Couldn't establish a connection with DeskCube");
        }
    };

    // discover services and characteristics
    println!(">>>> Connected here!");
    cube.discover_services().await?;

    let characteristics = cube.characteristics();
    println!(">>>> Found Chars: {:#?}", characteristics);

    // let ahrs_char_data = characteristics.iter().find(|c| c.uuid == ASHR_UUID_CHAR_DATA).unwrap();
    // cube.subscribe(&ahrs_char_data).await?;
    
    let ashr_char_roll = characteristics.iter().find(|c| c.uuid == ASHR_UUID_CHAR_ROLL).unwrap();
    let ashr_char_pitch = characteristics.iter().find(|c| c.uuid == ASHR_UUID_CHAR_PITCH).unwrap();
    let ashr_char_yaw = characteristics.iter().find(|c| c.uuid == ASHR_UUID_CHAR_YAW).unwrap();
    let ashr_char_head = characteristics.iter().find(|c| c.uuid == ASHR_UUID_CHAR_HEAD).unwrap();
    let ashr_char_freq = characteristics.iter().find(|c| c.uuid == ASHR_UUID_CHAR_HEAD).unwrap();
    cube.subscribe(&ashr_char_roll).await?;
    cube.subscribe(&ashr_char_pitch).await?;
    cube.subscribe(&ashr_char_yaw).await?;
    cube.subscribe(&ashr_char_head).await?;
    cube.subscribe(&ashr_char_freq).await?;
    println!(">>>> Subscribed to: AHRS");
    
    let acc_char_pos_x = characteristics.iter().find(|c| c.uuid == ACC_UUID_CHAR_POS_X).unwrap();
    let acc_char_pos_y = characteristics.iter().find(|c| c.uuid == ACC_UUID_CHAR_POS_Y).unwrap();
    cube.subscribe(&acc_char_pos_x).await?;
    cube.subscribe(&acc_char_pos_y).await?;
    println!(">>>> Subscribed to: ACC Positions");
    
    let acc_char_direction = characteristics.iter().find(|c| c.uuid == ACC_UUID_CHAR_DIRECTIONAL).unwrap();
    cube.subscribe(&acc_char_direction).await?;
    println!(">>>> Subscribed to: ACC Directional");

    let mut notification_stream = cube.notifications().await?;
    println!(">>>> Started listing to Notifications");
    window.emit("CONNECTED", "Connected to DeskCube").unwrap();

    while let Some(data) = notification_stream.next().await {

        match data.uuid {
            
            // let byte_array: [u8; 4] = data.value[0..4].try_into().expect("Needed 4 bytes for a float");
            // let float: f32 = f32::from_be_bytes(byte_array);

            // ASHR_UUID_CHAR_DATA => {
            //     println!("Received data from DeskCube [ AHRS ] {:?}", data.value);
            // },
            ASHR_UUID_CHAR_ROLL => {
                let float = LittleEndian::read_f32(&data.value);
                window.emit("AHRS_ROLL", float).unwrap();
                println!("Received data from DeskCube [ ROLL ] {:?} - {:?}", data.value, float);
            },
            ASHR_UUID_CHAR_PITCH => {
                let float = LittleEndian::read_f32(&data.value);
                window.emit("AHRS_PITCH", float).unwrap();
                println!("Received data from DeskCube [ PTCH ] {:?} - {:?}", data.value, float);
            },
            ASHR_UUID_CHAR_YAW => {
                let float = LittleEndian::read_f32(&data.value);
                window.emit("AHRS_YAW", float).unwrap();
                println!("Received data from DeskCube [ YAW  ] {:?} - {:?}", data.value, float);
            },
            ASHR_UUID_CHAR_HEAD => {
                let float = LittleEndian::read_f32(&data.value);
                window.emit("AHRS_HEAD", float).unwrap();
                println!("Received data from DeskCube [ HEAD ] {:?} - {:?}", data.value, float);
            },
            ASHR_UUID_CHAR_FREQUENCY => {
                let float = LittleEndian::read_f32(&data.value);
                window.emit("AHRS_FREQ", float).unwrap();
                println!("Received data from DeskCube [ FREQ ] {:?} - {:?}", data.value, float);
            },
            ACC_UUID_CHAR_POS_X => {
                let value = LittleEndian::read_i32(&data.value);
                println!("Received data from DeskCube [ AC X ] {:?} - {:?}", data.value, value);
                window.emit("ACC_X", value).unwrap();
            },
            ACC_UUID_CHAR_POS_Y => {
                let value = LittleEndian::read_i32(&data.value);
                println!("Received data from DeskCube [ AC Y ] {:?} - {:?}", data.value, value);
                window.emit("ACC_Y", value).unwrap();
            },
            ACC_UUID_CHAR_DIRECTIONAL => {
                let value: char = data.value[0].try_into().expect("Couldn't convert to char");
                println!("Received data from DeskCube [ DIRT ] {:?}", value);
                window.emit("DIRECTIONAL", value).unwrap();
            },
            _ => {
                println!("Received data from DeskCube [ UNKN ] {:?}", data.value);
            }
        }

    }

    cube.disconnect().await?;
    println!(">>>> Keep it up!");

    Ok(())
}

async fn find_device(central: &Adapter) -> Option<Peripheral> {
    for p in central.peripherals().await.unwrap() {
        if p.properties()
            .await
            .unwrap()
            .unwrap()
            .local_name
            .iter()
            .any(|name| name.contains("DeskCube"))
        {
            return Some(p);
        }
    }
    None
}

async fn device_discovery() -> Result<(), Box<dyn Error>> {
    // pretty_env_logger::init();

    let manager = Manager::new().await?;

    // get the first bluetooth adapter
    // connect to the adapter
    let central = get_central(&manager).await;

    // Each adapter has an event stream, we fetch via events(),
    // simplifying the type, this will return what is essentially a
    // Future<Result<Stream<Item=CentralEvent>>>.
    let mut events = central.events().await?;

    // start scanning for devices
    central.start_scan(ScanFilter::default()).await?;

    // Print based on whatever the event receiver outputs. Note that the event
    // receiver blocks, so in a real program, this should be run in its own
    // thread (not task, as this library does not yet use async channels).
    while let Some(event) = events.next().await {
        match event {
            CentralEvent::DeviceDiscovered(id) => {
                println!("DeviceDiscovered: {:?}", id);
            }
            CentralEvent::DeviceConnected(id) => {
                println!("DeviceConnected: {:?}", id);
            }
            CentralEvent::DeviceDisconnected(id) => {
                println!("DeviceDisconnected: {:?}", id);
            }
            CentralEvent::ManufacturerDataAdvertisement {
                id,
                manufacturer_data,
            } => {
                println!(
                    "ManufacturerDataAdvertisement: {:?}, {:?}",
                    id, manufacturer_data
                );
            }
            CentralEvent::ServiceDataAdvertisement { id, service_data } => {
                println!("ServiceDataAdvertisement: {:?}, {:?}", id, service_data);
            }
            CentralEvent::ServicesAdvertisement { id, services } => {
                let services: Vec<String> =
                    services.into_iter().map(|s| s.to_short_string()).collect();
                println!("ServicesAdvertisement: {:?}, {:?}", id, services);
            }
            _ => {}
        }
    }
    Ok(())
}

async fn get_central(manager: &Manager) -> Adapter {
    let adapters = manager.adapters().await.unwrap();
    adapters.into_iter().nth(0).unwrap()
}

#[tauri::command(async)]
async fn init_blue(window: Window){
    _ = main_blue(window).await;
}

#[tauri::command(async)]
async fn run_device_descovery(){
    _ = device_discovery().await;
}

fn main() {
    tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::default().build())
    .invoke_handler(tauri::generate_handler![
        test_data,
        init_process,
        init_blue,
        run_device_descovery
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}