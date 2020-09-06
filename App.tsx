import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useEffect } from 'react';
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
  add,
  pow,
  sqrt,
} from 'react-native-reanimated';
import {
  LongPressGestureHandler,
  LongPressGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import Card, { CARD_DIMENSIONS } from './src/components/Card';

const { width } = Dimensions.get('screen');

const CENTER_X = width / 2;

const TOTAL_OF_CARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const runProgress = (
  clock: Clock,
  from: number,
  toValue: Animated.Node<number>
) => {
  const state = {
    finished: new Animated.Value(0),
    position: new Animated.Value(from),
    frameTime: new Animated.Value(0),
    time: new Animated.Value(0),
  };

  const config = {
    toValue: toValue,
    duration: 2000,
    easing: Easing.inOut(Easing.linear),
  };

  return block([
    cond(
      clockRunning(clock),
      timing(clock, state, config)
      // set(state.position, 0)
    ),

    cond(eq(state.finished, 1), [
      debug('state.position', state.position),
      debug('config.toVAlue', config.toValue),

      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
    ]),

    // debug('state.position', state.position),
    // debug('config.toVAlue', config.toValue),
    state.position,
  ]);
};

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

  const [initialPositionX, setInitialPositionX] = useState<
    {
      from: number;
      to: number;
    }[]
  >([]);

  const positionX = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>(0))
  ).current;

  const cardIndex = useRef(new Animated.Value<number>(-1)).current;

  useEffect(() => console.log(initialPositionX), [initialPositionX]);

  // TOTAL_OF_CARDS.map(() => ({ from: 0, to: 0 }))
  // let initialPositionX: {
  //   from: number;
  //   to: number;
  // }[] = TOTAL_OF_CARDS.map(() => ({ from: 0, to: 0 }));

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
        {TOTAL_OF_CARDS.map((_, index) => {
          const rotate = interpolate(translateY[index], {
            inputRange: [-200, 0],
            outputRange: [0, -90],
            extrapolate: Extrapolate.CLAMP,
          });

          return (
            <Animated.View
              key={index.toString()}
              onLayout={(event: LayoutChangeEvent) => {
                if (initialPositionX.length >= TOTAL_OF_CARDS.length) return;
                const from = event.nativeEvent.layout.x;

                const obj = {
                  from,
                  to:
                    -1 *
                    (from -
                      width * Math.floor(event.nativeEvent.layout.x / width)),
                };

                const arr = [...initialPositionX];
                arr.push(obj);

                setInitialPositionX(arr.sort((a, b) => a.from - b.from));
              }}
            >
              {initialPositionX.length === TOTAL_OF_CARDS.length ? (
                <LongPressGestureHandler
                  onHandlerStateChange={event<
                    LongPressGestureHandlerStateChangeEvent
                  >([
                    {
                      nativeEvent: ({ state, oldState }) =>
                        block([
                          // cond(
                          //   clockRunning(clock[index]),
                          //   set(
                          //     translateY[index],
                          //     runProgress(clock[index], 0, -200)
                          //   )
                          // ),
                          cond(clockRunning(translateXclock[index]), [
                            set(
                              translateX[index],
                              runProgress(
                                translateXclock[index],
                                0,

                                cond(
                                  not(eq(scrollX, 0)),
                                  multiply(
                                    sub(initialPositionX[index].from, scrollX),
                                    -1
                                  ),
                                  add(initialPositionX[index].to, 0)
                                )

                                // multiply(
                                //   sqrt(
                                //     pow(
                                //       add(initialPositionX[index].to, scrollX),
                                //       2
                                //     )
                                //   ),
                                //   -1
                                // )
                              )
                            ),
                          ]),
                          cond(
                            eq(state, State.ACTIVE),
                            set(longPressed[index], 1)
                          ),
                          cond(eq(oldState, State.ACTIVE), [
                            // startClock(clock[index]),
                            set(cardIndex, index),
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
                            // { translateY: translateY[index] },
                            // { translateX: multiply(translateX[index], -1) },
                            { translateY: (-CARD_DIMENSIONS.height / 2) * 1.5 },
                            // { rotate: concat(90, 'deg') },
                            // { scale: cond(longPressed[index], 1.2, 1.4) },
                          ],
                        },
                      ]}
                    />
                  </Animated.View>
                </LongPressGestureHandler>
              ) : (
                <Card
                  style={[
                    {
                      transform: [
                        { translateY: (-CARD_DIMENSIONS.height / 2) * 1.5 },
                        // { rotate: '90deg' },
                        // { scale: 1.4 },
                      ],
                    },
                  ]}
                />
              )}
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
