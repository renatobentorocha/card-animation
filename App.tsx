import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  event,
  abs,
  block,
  debug,
  set,
  min,
  useCode,
  onChange,
  cond,
  eq,
} from 'react-native-reanimated';
import {
  ScrollView,
  TapGestureHandlerStateChangeEvent,
  PanGestureHandler,
  LongPressGestureHandler,
  LongPressGestureHandlerGestureEvent,
  LongPressGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import Card, { CARD_DIMENSIONS } from './src/components/Card';

const { width } = Dimensions.get('screen');

const TOTAL_OF_CARDS = [1, 2, 3, 4];

const CARD_CENTER = {
  x: CARD_DIMENSIONS.width / 2,
  y: CARD_DIMENSIONS.height / 2,
};

export default function App() {
  const translateYs = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>())
  ).current;

  const gestureState = useRef(new Animated.Value<State>(State.UNDETERMINED))
    .current;

  const absY = useRef(new Animated.Value<number>(0)).current;

  const origin = useRef({
    x: new Animated.Value<number>(0),
    y: new Animated.Value<number>(0),
  }).current;

  const scrollRef = useRef();
  const scrollPan = useRef();

  useCode(() => onChange(absY, debug('absY', absY)), []);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={styles.scroll}
      >
        {[1, 2, 3, 4].map((_, index) => (
          <LongPressGestureHandler
            key={index.toString()}
            onGestureEvent={event<LongPressGestureHandlerGestureEvent>([
              {
                nativeEvent: ({ y, absoluteX, absoluteY, state }) =>
                  block([set(translateYs[index], y), set(gestureState, state)]),
              },
            ])}
            onHandlerStateChange={event<
              LongPressGestureHandlerStateChangeEvent
            >([
              {
                nativeEvent: ({ y, absoluteX, absoluteY, state, handlerTag }) =>
                  cond(
                    eq(state, State.ACTIVE),
                    set(translateYs[index], 1),
                    cond(eq(translateYs[index], 1), set(translateYs[index], 0))
                  ),
                // block([
                //     set(translateYs[index], y),
                //     set(gestureState, state),
                //     set(absY, absoluteY),
                //     debug('translateYs[index]', translateYs[index]),
                //   ]),
              },
            ])}
          >
            <Animated.View style={{}}>
              <Card
                style={{
                  transform: [
                    { translateY: (-CARD_DIMENSIONS.height / 2) * 1.5 },
                    { rotate: '90deg' },
                    { scale: cond(translateYs[index], 1.6, 1.4) },
                  ],
                }}
              />
            </Animated.View>
          </LongPressGestureHandler>
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
