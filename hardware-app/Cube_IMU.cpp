#include "Cube_IMU.h"

Cube_IMU::~Cube_IMU(void) {}

Cube_IMU::Cube_IMU(){}

int Cube_IMU::begin(){
  return IMU.begin();
}

void Cube_IMU::update(Cube_Pos &gyroscope){
  
  // Read and update the Gyroscope
  Cube_IMU::readGyroscope(gyroscope);
}

void Cube_IMU::readGyroscope(Cube_Pos &positions){
  if(!IMU.gyroscopeAvailable()){
    IMU.readGyroscope(positions.pos_x, positions.pos_y, positions.pos_z);
  }
}

Cube_Pos Cube_IMU::readGyroscope(){
  Cube_Pos positions;

  if(!IMU.gyroscopeAvailable()){
    IMU.readGyroscope(positions.pos_x, positions.pos_y, positions.pos_z);
  }

  return positions;
}