#include "Cube_Screen.h"

Cube_Screen::~Cube_Screen(void) {}

Cube_Screen::Cube_Screen(
  uint16_t width,
  uint16_t height,
  int8_t cs_pin,
  int8_t dc_pin,
  int8_t mosi_pin,
  int8_t sclk_pin,
  int8_t rst_pin,
  bool is_active)
  : Adafruit_SSD1351(width, height, cs_pin, dc_pin, mosi_pin, sclk_pin, rst_pin) {}

Cube_Screen::Cube_Screen(
  uint16_t width,
  uint16_t height,
  SPIClass *spi,
  int8_t cs_pin,
  int8_t dc_pin,
  int8_t rst_pin,
  bool is_active)
  : Adafruit_SSD1351(width, height, spi, cs_pin, dc_pin, rst_pin) {}

void Cube_Screen::setColor(uint16_t color){
  if (current_color != color){
    setTextColor(color, DEFAULT_BLACK);
    current_color = color;
  }
}

void Cube_Screen::drawText(char text){
  if (is_active) {
    setTextColor(current_color, DEFAULT_BLACK);
    print(text);
  }
}

void Cube_Screen::drawText(char * text){
  if (is_active) {
    setTextColor(current_color, DEFAULT_BLACK);
    print(text);
  }
}

void Cube_Screen::drawText(arduino::String text){
  if (is_active) {
    setTextColor(current_color, DEFAULT_BLACK);
    print(text);
  }
}

void Cube_Screen::drawText(char text, uint16_t color){
  if (is_active) {
    setTextColor(color, DEFAULT_BLACK);
    print(text);
  }
}

void Cube_Screen::drawText(char * text, uint16_t color){
  if (is_active) {
    setTextColor(color, DEFAULT_BLACK);
    print(text);
  }
}

void Cube_Screen::drawText(arduino::String text, uint16_t color){
  if (is_active) {
    setTextColor(color, DEFAULT_BLACK);
    print(text);
  }
}


void Cube_Screen::drawTextLine(char text){
  if (is_active) {
    setTextColor(current_color, DEFAULT_BLACK);
    println(text);
  }
}

void Cube_Screen::drawTextLine(char * text){
  if (is_active) {
    setTextColor(current_color, DEFAULT_BLACK);
    println(text);
  }
}

void Cube_Screen::drawTextLine(arduino::String text){
  if (is_active) {
    setTextColor(current_color, DEFAULT_BLACK);
    println(text);
  }
}

void Cube_Screen::drawTextLine(char * text, uint16_t color){
  if (is_active) {
    setTextColor(color, DEFAULT_BLACK);
    println(text);
  }
}

void Cube_Screen::drawTextLine(char text, uint16_t color){
  if (is_active) {
    setTextColor(color, DEFAULT_BLACK);
    println(text);
  }
}

void Cube_Screen::drawTextLine(arduino::String text, uint16_t color){
  if (is_active) {
    setTextColor(color, DEFAULT_BLACK);
    println(text);
  }
}


void Cube_Screen::reset(){
  if (is_active){
    fillScreen(DEFAULT_BLACK);
    setCursor(0, 0);
  }
}

void Cube_Screen::resetCursor(){
  if (is_active){
    setCursor(0, 0);
  }
}

void Cube_Screen::clear(){
  if (is_active){
    fillScreen(DEFAULT_BLACK);
  }
}

void Cube_Screen::enable(){
  is_active = true;
  begin();
};

void Cube_Screen::disable(){
  is_active = false;
  // end();
};

bool Cube_Screen::can_use(){
  return is_active;
}


void Cube_Screen::drawValue(char* name, float value, uint16_t color){
    if (is_active){
    setTextColor(color, DEFAULT_BLACK);
    print(name);
    println(value);
  }
}

void Cube_Screen::drawValue(char* name, float value, char* end, uint16_t color){
  if (is_active){
    setTextColor(color, DEFAULT_BLACK);
    print(name);
    print(value);
    println(end);
  }
}

void Cube_Screen::drawValue(arduino::String name, float value, uint16_t color){
    if (is_active){
    setTextColor(color, DEFAULT_BLACK);
    print(name);
    println(value);
  }
}

void Cube_Screen::drawValue(arduino::String name, float value, arduino::String end, uint16_t color){
  if (is_active){
    setTextColor(color, DEFAULT_BLACK);
    print(name);
    print(value);
    println(end);
  }
}


void Cube_Screen::drawValue(char* name, int value, uint16_t color){
    if (is_active){
    setTextColor(color, DEFAULT_BLACK);
    print(name);
    println(value);
  }
}

void Cube_Screen::drawValue(char* name, int value, char* end, uint16_t color){
  if (is_active){
    setTextColor(color, DEFAULT_BLACK);
    print(name);
    print(value);
    println(end);
  }
}

void Cube_Screen::drawValue(arduino::String name, int value, uint16_t color){
    if (is_active){
    setTextColor(color, DEFAULT_BLACK);
    print(name);
    println(value);
  }
}

void Cube_Screen::drawValue(arduino::String name, int value, arduino::String end, uint16_t color){
  if (is_active){
    setTextColor(color, DEFAULT_BLACK);
    print(name);
    print(value);
    println(end);
  }
}