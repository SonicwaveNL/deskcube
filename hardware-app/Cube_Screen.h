#ifndef _CUBE_SCREEN_H_
#define _CUBE_SCREEN_H_


#define DEFAULT_BLACK       0x0000
#define DEFAULT_WHITE       0xFFFF

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1351.h>
#include <SPI.h>

class Cube_Screen : public Adafruit_SSD1351 {
private:
  bool is_active;
  uint16_t current_color = DEFAULT_WHITE;

public:

  ~Cube_Screen(void);

  /**
    @brief Constructur using software SPI (reset optional).
    @param width the 'width' of the Screen in pixels.
    @param height the 'height' of the Screen in pixels.
    @param cs_pin the connected 'CS' pin of the Screen.
    @param dc_pin the connected 'DC' pin of the Screen.
    @param mosi_pin the connected 'MOSI'/'COSI' pin of the Screen.
    @param sclk_pin the connected 'SCLK' pin of the Screen.
    @param rst_pin the connected 'RESET' pin of the Screen.
    @param is_active defines if the Screen is active for use.
  */
  Cube_Screen(uint16_t width, uint16_t height, int8_t cs_pin, int8_t dc_pin, int8_t mosi_pin, int8_t sclk_pin, int8_t rst_pin = -1, bool is_active = true);

  /**
    @brief Constructur using hardware SPI (reset optional).
    @param width the 'width' of the Screen in pixels.
    @param height the 'height' of the Screen in pixels.
    @param spi the 'SPI' interface of the Screen.
    @param cs_pin the connected 'CS' pin of the Screen.
    @param dc_pin the connected 'DC' pin of the Screen.
    @param rst_pin the connected 'RESET' pin of the Screen.
    @param is_active defines if the Screen is active for use.
  */
  Cube_Screen(uint16_t width, uint16_t height, SPIClass *spi, int8_t cs_pin, int8_t dc_pin, int8_t rst_pin = -1, bool is_active = true);

  /**
    @brief Set the current color to the given 'color',
          but only if it isn't the same the 'current_color'.
    @param color the 'color' to set.
  */
  void setColor(uint16_t color);

  /**
    @brief Draw the given 'text', using the 'current_color' of the screen.
    @param text the 'text' to drawn on the screen.
  */
  void drawText(char text);
  void drawText(char * text);
  void drawText(arduino::String text);

  /**
    @brief Draw the given 'text', using the 'current_color' of the screen.
    @param text the 'text' to drawn on the screen.
  */
  void drawText(char text, uint16_t color);
  void drawText(char * text, uint16_t color);
  void drawText(arduino::String text, uint16_t color);

  /**
    @brief Draw the given 'text' as a line, using the 'current_color' of the screen.
    @param text the 'text' to drawn on the screen.
  */
  void drawTextLine(char text);
  void drawTextLine(char * text);
  void drawTextLine(arduino::String text);

  /**
    @brief Draw the given 'text' as a line, using the 'current_color' of the screen.
    @param text the 'text' to drawn on the screen.
  */
  void drawTextLine(char text, uint16_t color);
  void drawTextLine(char * text, uint16_t color);
  void drawTextLine(arduino::String text, uint16_t color);

  /**
    @brief reset the Screen from any drawings.
  */
  void reset();

  /**
    @brief reset the Cursor at the 0:0 position on the Screen.
  */
  void resetCursor();

  /**
    @brief Clear the Screen from any drawings.
  */
  void clear();

  /**
    @brief Enable the Screen module.
  */
  void enable();

  /** 
    @brief Disable the Screen module.
  */
  void disable();

  
  bool can_use();

  /** 
    @brief Draw given float 'value' on the Screen, using the given color.
    @param name text/name of the value to draw, drawn before the value.
    @param value the actual value to draw on the screen.
    @param color color to draw the text with.
  */
  void drawValue(char* name, float value, uint16_t color);

  /** 
    @brief Draw given int 'value' on the Screen, using the given color.
    @param name text/name of the value to draw, drawn before the value.
    @param value the actual value to draw on the screen.
    @param end text to put after the drawn value.
    @param color color to draw the text with.
  */
  void drawValue(char* name, float value, char* end, uint16_t color);

  /** 
    @brief Draw given float 'value' on the Screen, using the given color.
    @param name text/name of the value to draw, drawn before the value.
    @param value the actual value to draw on the screen.
    @param color color to draw the text with.
  */
  void drawValue(arduino::String name, float value, uint16_t color);

  /** 
    @brief Draw given int 'value' on the Screen, using the given color.
    @param name text/name of the value to draw, drawn before the value.
    @param value the actual value to draw on the screen.
    @param end text to put after the drawn value.
    @param color color to draw the text with.
  */
  void drawValue(arduino::String name, float value, arduino::String end, uint16_t color);

  /** 
    @brief Draw given float 'value' on the Screen, using the given color.
    @param name text/name of the value to draw, drawn before the value.
    @param value the actual value to draw on the screen.
    @param color color to draw the text with.
  */
  void drawValue(char* name, int value, uint16_t color);
  
  /** 
    @brief Draw given int 'value' on the Screen, using the given color.
    @param name text/name of the value to draw, drawn before the value.
    @param value the actual value to draw on the screen.
    @param end text to put after the drawn value.
    @param color color to draw the text with.
  */
  void drawValue(char* name, int value, char* end, uint16_t color);

  /** 
    @brief Draw given float 'value' on the Screen, using the given color.
    @param name text/name of the value to draw, drawn before the value.
    @param value the actual value to draw on the screen.
    @param color color to draw the text with.
  */
  void drawValue(arduino::String name, int value, uint16_t color);

  /** 
    @brief Draw given int 'value' on the Screen, using the given color.
    @param name text/name of the value to draw, drawn before the value.
    @param value the actual value to draw on the screen.
    @param end text to put after the drawn value.
    @param color color to draw the text with.
  */
  void drawValue(arduino::String name, int value, arduino::String end, uint16_t color);

};

#endif  // _CUBE_SCREEN_H_