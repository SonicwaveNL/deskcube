#ifndef _CUBE_IMU_H_
#define _CUBE_IMU_H_

#include <Arduino_LSM9DS1.h>

struct Cube_Pos {
  float pos_x;
  float pos_y;
  float pos_z;
};

class Cube_IMU {
public:

  ~Cube_IMU(void);

  Cube_IMU();

  int begin();

  void update(Cube_Pos &gyroscope);

  void readGyroscope(Cube_Pos &gyroscope);
  Cube_Pos readGyroscope();

};

#endif  // _CUBE_IMU_H_