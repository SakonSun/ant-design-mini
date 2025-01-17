import helper from './index.sjs';
import { View, Block } from '../../lib';
import type { ILoadingProps } from './props';

export default ({ type, style, size, className, color }: ILoadingProps) => (
  <View
    class={`ant-loading ${
      type === 'spin' ? 'ant-loading-spin' : 'ant-loading-mini'
    } ${helper.getClass(size)} ${className ? className : ''}`}
    style={style}
  >
    {type === 'spin' ? (
      <View
        class="ant-loading-spin-icon"
        style="background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%2224%2024%2048%2048%22%3E%3CanimateTransform%20attributeName%3D%22transform%22%20type%3D%22rotate%22%20repeatCount%3D%22indefinite%22%20from%3D%220%22%20to%3D%22360%22%20dur%3D%221400ms%22%3E%3C%2FanimateTransform%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2248%22%20r%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%23{{helper.getLoadingColor(color || '#fff')}}%22%20stroke-width%3D%222%22%20transform%3D%22translate%5C\(0%2C0%5C\)%22%3E%3Canimate%20attributeName%3D%22stroke-dasharray%22%20values%3D%221px%2C%20200px%3B100px%2C%20200px%3B100px%2C%20200px%22%20dur%3D%221400ms%22%20repeatCount%3D%22indefinite%22%3E%3C%2Fanimate%3E%3Canimate%20attributeName%3D%22stroke-dashoffset%22%20values%3D%220px%3B-15px%3B-125px%22%20dur%3D%221400ms%22%20repeatCount%3D%22indefinite%22%3E%3C%2Fanimate%3E%3C%2Fcircle%3E%3C%2Fsvg%3E');"
      />
    ) : (
      <Block>
        <View
          class="ant-loading-mini-item ant-loading-mini-item__1"
          style={color ? 'background-color: ' + color + ';' : ''}
        >
          .
        </View>
        <View
          class="ant-loading-mini-item ant-loading-mini-item__2"
          style={color ? 'background-color: ' + color + ';' : ''}
        >
          .
        </View>
        <View
          class="ant-loading-mini-item ant-loading-mini-item__3"
          style={color ? 'background-color: ' + color + ';' : ''}
        >
          .
        </View>
      </Block>
    )}
  </View>
);
