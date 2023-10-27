/**
 * 需要兼容不同的设备像素比

    1）device-pixel-ratio 设备像素比 和resolution 分辨率 来区分的不同设备像素比

    2）伪类 + scale缩放 来实现 1px 效果（包括圆角功能）

    如果设备像素比为 1，伪类不缩放
    如果设备像素比为 2，伪类缩放为 0.5
    如果设备像素比为 3，伪类缩放为 0.33
 * 
 */

// 使用scss语法实现
/** 
@mixin side-parse($color, $border:1px, $side:all, $radius:0, $style: solid) {
    @if ($side == all) {
      border:$border $style $color;
    } @else {
      border-#{$side}:$border $style $color;
    }
  }
  @mixin border-s1px($color, $border:1px, $side:all, $radius:0, $style: solid, $radius: 0){
    position: relative;
    &::after{
      content: '';
      position: absolute;
      pointer-events: none;
      top: 0; left: 0;
      border-radius: $radius;
      @include side-parse($color, $border, $side, $radius, $style);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;  // 默认值为50% 50%
      @media (max--moz-device-pixel-ratio: 1.49), (-webkit-max-device-pixel-ratio: 1.49), (max-device-pixel-ratio: 1.49), (max-resolution: 143dpi), (max-resolution: 1.49dppx){
        width: 100%;
        height: 100%;
        border-radius: $radius;
      }
      @media (min--moz-device-pixel-ratio: 1.5) and (max--moz-device-pixel-ratio: 2.49), (-webkit-min-device-pixel-ratio: 1.5) and (-webkit-max-device-pixel-ratio: 2.49),(min-device-pixel-ratio: 1.5) and (max-device-pixel-ratio: 2.49),(min-resolution: 144dpi) and (max-resolution: 239dpi),(min-resolution: 1.5dppx) and (max-resolution: 2.49dppx){
        width: 200%;
        height: 200%;
        transform: scale(.5);
        -webkit-transform: scale(.5);
        border-radius: $radius * 2;
      }
      @media (min--moz-device-pixel-ratio: 2.5), (-webkit-min-device-pixel-ratio: 2.5),(min-device-pixel-ratio: 2.5), (min-resolution: 240dpi),(min-resolution: 2.5dppx){
        width: 300%;
        height: 300%;
        transform: scale(0.333);
        -webkit-transform: scale(0.333);
        border-radius: $radius * 3;
      }
    }
  }
  */
