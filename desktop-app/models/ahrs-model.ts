export interface AHRS {
    roll: number
    pitch: number
    yaw: number
    frequency: number
}

export const DefaultAHRS: AHRS = {
    roll: 0,
    pitch: 0,
    yaw: 0,
    frequency: 0
}