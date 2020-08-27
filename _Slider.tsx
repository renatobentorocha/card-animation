import React from 'react';

import {
  BaseSliderItem,
  BaseSlider,
  BaseSliderDataProps,
  BaseSliderItemProps,
  BaseSliderRenderItemInfoProps,
} from './_BaseSlider';
import Box from 'v2/Box/Box';

export type SliderProps = {
  data: BaseSliderItemProps[];
  renderItem: (item: BaseSliderRenderItemInfoProps) => BaseSliderDataProps;
  itemWidth: number;
  itemMarginRight: number;
  leftBoxWidth: number;
};

const Slider: React.FC<SliderProps> = ({
  data,
  renderItem,
  itemWidth,
  itemMarginRight,
  leftBoxWidth,
}) => {
  return (
    <BaseSlider
      box={{
        backgroundColor: 'rgba(255, 0,0,.4)',
      }}
      data={[
        <Box key="a" bg="blue" width={leftBoxWidth} />,
        ...data.map((value, index) => (
          <BaseSliderItem key={index.toString()} marginRight={8} {...value} />
        )),
      ]}
      renderItem={renderItem}
      horizontal
      snapToOffsets={data.map((value, index) => {
        const width = itemWidth + itemMarginRight;
        return index !== 0 ? index * width + leftBoxWidth : 0;
      })}
      decelerationRate={'fast'}
    />
  );
};

export {Slider};
