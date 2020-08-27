import React from 'react';
import { View, StyleSheet, Dimensions, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { scale } from '../../utils';
import Animated from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');

export const CARD_DIMENSIONS = {
  width: scale({ destination_size: width, origin_size: 375, size: 248 }),
  height: scale({ destination_size: height, origin_size: 667, size: 157 }),
};

export type CardProps = ViewProps;

const Card: React.FC<CardProps> = ({ style, ...rest }) => {
  return (
    <Animated.View style={[styles.card, style]} {...rest}>
      <LinearGradient
        style={{ flex: 1, borderRadius: 10 }}
        colors={[
          'rgba(128,0,128,0.7)',
          'rgba(75,0,130,0.7)',
          'rgba(75,0,130,1)',
        ]}
        start={[0, 1]}
        end={[1, 0]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_DIMENSIONS.width,
    height: CARD_DIMENSIONS.height,
    borderRadius: 10,
  },
});

export default Card;
