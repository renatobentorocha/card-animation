import React from 'react';
import {FlatList, FlatListProps, ListRenderItemInfo} from 'react-native';
import Box, {BoxProps} from 'v2/Box/Box';

export type BaseSliderItemProps = BoxProps & {
  onSliderItem: React.ReactElement<BoxProps>;
};

export type BaseSliderDataProps = React.ReactElement<BaseSliderItemProps>;

export type BaseSliderProps = FlatListProps<BaseSliderDataProps> & {
  box?: BoxProps;
};

export type BaseSliderRenderItemInfoProps = ListRenderItemInfo<
  BaseSliderDataProps
>;

export const BaseSliderItem: React.FC<BaseSliderItemProps> = ({
  onSliderItem,
  ...rest
}) => {
  return <Box {...rest}>{onSliderItem}</Box>;
};

export const BaseSlider: React.FC<BaseSliderProps> = ({
  data,
  renderItem,
  box,
  ...rest
}) => {
  return (
    <Box {...box}>
      <FlatList
        style={{width: '100%'}}
        data={data}
        renderItem={renderItem}
        {...rest}
      />
    </Box>
  );
};
