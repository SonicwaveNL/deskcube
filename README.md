![open source](https://badgen.net/badge/open/source/blue?icon=github)

# DeskCube
---
Deskcube — A device to enhance your experience behind your desk, shaped like a cube

<br>

## Hardware-app
---

### Development
To start working on the development of the `hardware-app`, open the `/hardware-app` folder in de [Arduino IDE v2](https://www.arduino.cc/en/software).

After doing press the `✓` or the `→` button to get notified which dependencies are missing. This list can be installed by the `Board Manager` and the `Library Manager`, at the left side.

#### Wire the Arduino Nano 33 BLE Sense

<details>
<summary>Show image</summary>

![Arduino Nano 33 BLE Schema](https://content.arduino.cc/assets/Pinout-NANOsense_latest.png)
</details>


#### Wire the Waveshare 1.5 inch RGB OLED Screen

<details>
<summary>Show table</summary>

| Label | Pin | Wire |
| :------ | :-----: | :----- |
| `VCC` | `3V3` | Red |
| `GROUND` | `GND` | Black |
| `SLCK` | `13` | Yellow |
| `MOSI` | `11` | Blue |
| `DC` | `8` | Green |
| `CS` | `9` | Orange |
| `RESET` | `7` | White |
</details>

<br>

## Desktop-app
---

### Download
You can download the application from the `/desktop-app/src-tauri/dist` folder.

### Development
While being the `./desktop-app` folder, run the following command to install the missing Javascript dependencies:

```shell
pnpm install
```

After installing the missing Javascript dependencies, go the `/desktop-app/src-tauri` folder and install the missing Rust dependencies:

```shell
cargo install
```

To start working on the application, with automatic refreshing the application, go back to the `/desktop-app` folder, and run to get started:

```shell
pnpm tauri dev
```

#### Usefull Commands

| Command | action |
| :------ | :----- |
| `pnpm dev` | Run application within the browser |
| `pnpm build` | Build the application |
| `pnpm export` | Export the modules of the application |
| `pnpm lint` | Execute the liniting tool |
| `pnpm tauri <command>` | Perform any tauri command, with an optional `command` parameter |

<br>

## Knowledge
--- 

### USB in WSL (Windows Subsystem for Linux)
When connecting an USB device to our Linux distro on WSL2 we need follow some steps necessary to make this happen. For some guidance about how to make this happen, see the following links:

- [Microsoft Development Guide](https://learn.microsoft.com/en-us/windows/wsl/connect-usb)
- [USBIPD-WIN Project: WSL Support](https://github.com/dorssel/usbipd-win/wiki/WSL-support#usbip-client-tools)


#### Connect to USB devices
If successfully installed run the following command within Powershell (as Administrator) to search for all the available devices connected via one of the USB ports of your computer:

```powershell
> usbipd wsl list
BUSID  VID:PID    DEVICE                                                        STATE
1-2    0b05:1a16  Realtek USB Audio, USB Input Device                           Not attached
1-4    0b05:19af  AURA LED Controller, USB Input Device                         Not attached
1-9    2341:805a  USB Serial Device (COM4)                                      Not attached
1-12   0a12:0001  Generic Bluetooth Radio                                       Not attached
...
```

To connect one of the devices shown within the list, follow-up the previouse command with the `attach` command:

```powershell
> usbipd wsl attach --busid 1-9
```

When connected successfully, the device (in this case the `Arduino SA Nano 33 BLE`) will be visible when you run the lsusb command within the WSL2 terminal:

```shell
> lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 002: ID 2341:805a Arduino SA Nano 33 BLE
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```