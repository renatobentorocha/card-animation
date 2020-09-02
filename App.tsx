import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
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
  Clock,
  Easing,
  not,
  clockRunning,
  startClock,
  timing,
  stopClock,
  interpolate,
  Extrapolate,
  concat,
  multiply,
  sub,
} from 'react-native-reanimated';
import {
  LongPressGestureHandler,
  LongPressGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import Card, { CARD_DIMENSIONS } from './src/components/Card';

const { width } = Dimensions.get('screen');

const CENTER_X = width / 2;

const TOTAL_OF_CARDS = [1, 2, 3, 4];

const runProgress = (clock: Clock, intialPosition: number, toValue: number) => {
  const state = {
    finished: new Animated.Value(0),
    position: new Animated.Value(intialPosition),
    frameTime: new Animated.Value(0),
    time: new Animated.Value(0),
  };

  const config = {
    toValue: new Animated.Value(toValue),
    duration: 2000,
    easing: Easing.inOut(Easing.linear),
  };

  return block([
    cond(
      clockRunning(clock),
      timing(clock, state, config),
      set(state.position, 0)
    ),

    cond(eq(state.finished, 1), [
      stopClock(clock),
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
    ]),
    state.position,
  ]);
};

const position = (
  value: Animated.Adaptable<number>,
  scrollX: Animated.Value<number>
) =>
  block([
    debug('sub(value)', sub(value, 0)),
    debug('sub(scrollX)', sub(scrollX, 0)),
    debug('sub(value, scrollX)', sub(value, scrollX)),
    0,
  ]);

export default function App() {
  const longPressed = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>(0))
  ).current;

  const translateY = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>(0))
  ).current;

  const translateX = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>(0))
  ).current;

  const scrollX = useRef(new Animated.Value<number>(0)).current;

  const initialPositionX: number[] = TOTAL_OF_CARDS.map(() => 0);

  const clock = useRef(TOTAL_OF_CARDS.map(() => new Animated.Clock())).current;
  const translateXclock = useRef(TOTAL_OF_CARDS.map(() => new Animated.Clock()))
    .current;

  const onScroll = event<NativeSyntheticEvent<NativeScrollEvent>>([
    { nativeEvent: { contentOffset: { x: scrollX } } },
  ]);

  useCode(() => onChange(scrollX, debug('scrollX', scrollX)), []);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={styles.scroll}
        scrollEventThrottle={1}
        onScroll={onScroll}
      >
        {[1, 2, 3, 4].map((_, index) => {
          const rotate = interpolate(translateY[index], {
            inputRange: [-200, 0],
            outputRange: [0, -90],
            extrapolate: Extrapolate.CLAMP,
          });

          position(initialPositionX[index], scrollX);

          return (
            <Animated.View
              key={index.toString()}
              onLayout={(event: LayoutChangeEvent) =>
                (initialPositionX[index] = event.nativeEvent.layout.x)
              }
            >
              <LongPressGestureHandler
                onHandlerStateChange={event<
                  LongPressGestureHandlerStateChangeEvent
                >([
                  {
                    nativeEvent: ({ state, oldState }) =>
                      block([
                        cond(
                          clockRunning(clock[index]),
                          set(
                            translateY[index],
                            runProgress(clock[index], 0, -200)
                          )
                        ),
                        cond(
                          clockRunning(translateXclock[index]),
                          set(
                            translateX[index],
                            runProgress(translateXclock[index], 0, -CENTER_X)
                          )
                        ),
                        cond(
                          eq(state, State.ACTIVE),
                          set(longPressed[index], 1)
                        ),
                        cond(eq(oldState, State.ACTIVE), [
                          startClock(clock[index]),
                          startClock(translateXclock[index]),
                          // set(longPressed[index], 0),
                        ]),
                      ]),
                  },
                ])}
              >
                <Animated.View style={{}}>
                  <Card
                    style={[
                      {
                        transform: [
                          { translateX: translateX[index] },
                          { translateY: translateY[index] },
                          { translateX: multiply(translateX[index], -1) },
                          { translateY: (-CARD_DIMENSIONS.height / 2) * 1.5 },
                          { rotate: concat(rotate, 'deg') },
                          { scale: cond(longPressed[index], 1.2, 1.4) },
                        ],
                      },
                    ]}
                  />
                </Animated.View>
              </LongPressGestureHandler>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
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
