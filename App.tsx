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
  and,
} from 'react-native-reanimated';
import {
  LongPressGestureHandler,
  LongPressGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import Card, { CARD_DIMENSIONS } from './src/components/Card';

const { width } = Dimensions.get('screen');

const CENTER_X = width / 2;

const cardOffetAdjustment = CENTER_X - CARD_DIMENSIONS.height / 2;

const TOTAL_OF_CARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const runProgress = (
  clock: Clock,
  from: Animated.Value<number>,
  toValue: Animated.Value<number>,
  invert: Animated.Value<number>[],
  index: number
) => {
  const state = {
    finished: new Animated.Value(0),
    position: from as Animated.Value<number>,
    frameTime: new Animated.Value(0),
    time: new Animated.Value(0),
  };

  const config = {
    toValue,
    duration: 2000,
    easing: Easing.inOut(Easing.linear),
  };

  return block([
    cond(clockRunning(clock), timing(clock, state, config)),

    cond(eq(state.finished, 1), [
      // debug('state.position', state.position),
      // debug('config.toVAlue', config.toValue),

      stopClock(clock),
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      // set(state.position, 0),

      // debug('state.position', state.position),
      // debug('cond(eq(invert, 1), 0, 1)', cond(eq(invert[index], 1), 0, 1)),

      set(invert[index], cond(eq(invert[index], 1), 0, 1)),

      // cond(
      //   eq(invert[index], 1),
      //   [set(config.toValue, from), set(state.position, toValue)],
      //   [set(config.toValue, toValue), set(state.position, from)]
      // ),

      // cond(eq(invert, 1), set(state.position, from)),
    ]),
    state.position,
    // debug('state.position', state.position),
    // debug('config.toVAlue', config.toValue),
  ]);
};

export default function App() {
  const longPressed = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>(0))
  ).current;

  const gestures = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<State>(State.UNDETERMINED))
  ).current;

  const translateY = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>(0))
  ).current;

  const fromTranslateY = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>(0))
  ).current;

  const toTranslateY = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>(-200))
  ).current;

  const positionX = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>(0))
  ).current;

  const fromTranslateX = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>(0))
  ).current;

  const toTranslateX = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>(0))
  ).current;

  const invert = useRef(TOTAL_OF_CARDS.map(() => new Animated.Value<number>(0)))
    .current;

  const invertX = useRef(
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

  // useEffect(() => console.log(initialPositionX), [initialPositionX]);

  const clock = useRef(TOTAL_OF_CARDS.map(() => new Animated.Clock())).current;

  const translateXclock = useRef(TOTAL_OF_CARDS.map(() => new Animated.Clock()))
    .current;

  const onScroll = event<NativeSyntheticEvent<NativeScrollEvent>>([
    { nativeEvent: { contentOffset: { x: scrollX } } },
  ]);

  // useCode(() => onChange(scrollX, debug('scrollX', scrollX)), []);

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
            outputRange: [-90, 0],
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
                          onChange(invert[index], [
                            set(
                              fromTranslateY[index],
                              cond(eq(invert[index], 1), -200, 0)
                            ),
                            set(
                              toTranslateY[index],
                              cond(eq(invert[index], 1), 0, -200)
                            ),
                          ]),
                          cond(clockRunning(clock[index]), [
                            set(
                              translateY[index],
                              runProgress(
                                clock[index],
                                fromTranslateY[index],
                                toTranslateY[index],
                                invert,
                                index
                              )
                            ),
                          ]),
                          set(
                            positionX[index],
                            cond(
                              not(eq(scrollX, 0)),
                              add(
                                multiply(
                                  sub(initialPositionX[index].from, scrollX),
                                  -1
                                ),
                                cardOffetAdjustment
                              ),
                              add(
                                initialPositionX[index].to +
                                  cardOffetAdjustment,
                                0
                              )
                            )
                          ),
                          onChange(invertX[index], [
                            set(
                              fromTranslateX[index],
                              cond(eq(invertX[index], 1), positionX[index], 0)
                            ),
                            set(
                              toTranslateX[index],
                              cond(eq(invertX[index], 1), 0, positionX[index])
                            ),
                          ]),
                          cond(clockRunning(translateXclock[index]), [
                            set(
                              translateX[index],
                              runProgress(
                                translateXclock[index],
                                fromTranslateX[index],
                                toTranslateX[index],
                                invertX,
                                index
                              )
                            ),
                          ]),
                          cond(
                            eq(state, State.ACTIVE),
                            set(longPressed[index], 1)
                          ),
                          set(gestures[index], state),
                          onChange(gestures[index], [
                            cond(eq(oldState, State.ACTIVE), [
                              startClock(clock[index]),
                              startClock(translateXclock[index]),
                              set(longPressed[index], 0),
                            ]),
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
                            { translateY: (-CARD_DIMENSIONS.height / 2) * 1.5 },
                            { rotate: concat(rotate, 'deg') },
                            { scale: cond(longPressed[index], 0.8, 1) },
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
