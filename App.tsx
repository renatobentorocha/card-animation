import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { event } from 'react-native-reanimated';
import {
  ScrollView,
  TapGestureHandlerStateChangeEvent,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Card, { CARD_DIMENSIONS } from './src/components/Card';

const TOTAL_OF_CARDS = [1, 2, 3, 4];

export default function App() {
  const translateYs = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>())
  ).current;

  const scrollRef = useRef();
  const scrollPan = useRef();
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        simultaneousHandlers={scrollPan}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={styles.scroll}
      >
        {[1, 2, 3, 4].map((_, index) => (
          <PanGestureHandler
            ref={scrollPan}
            simultaneousHandlers={scrollRef}
            key={index.toString()}
            onGestureEvent={event<TapGestureHandlerStateChangeEvent>([
              { nativeEvent: { y: translateYs[index] } },
            ])}
            onHandlerStateChange={event<TapGestureHandlerStateChangeEvent>([
              { nativeEvent: { y: translateYs[index] } },
            ])}
          >
            <Animated.View style={{}}>
              <Card
                style={{
                  transform: [
                    { translateY: translateYs[index] },
                    { translateY: (-CARD_DIMENSIONS.height / 2) * 1.5 },
                    { rotate: '90deg' },
                    { scale: 1.5 },
                  ],
                }}
              />
            </Animated.View>
          </PanGestureHandler>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  scroll: {
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  card: {},
});
