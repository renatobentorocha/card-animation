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

const runProgress = (clock: Clock, from: number, toValue: number) => {
  const state = {
    finished: new Animated.Value(0),
    position: new Animated.Value(from),
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
      timing(clock, state, config)
      // set(state.position, 0)
    ),

    cond(eq(state.finished, 1), [
      stopClock(clock),
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
    ]),

    debug('state.position', state.position),
    debug('config.toVAlue', config.toValue),
    state.position,
  ]);
};

const isClockRunning = (
  clocks: Animated.Clock[],
  index: Animated.Adaptable<number>
) => clockRunning(clocks[Number(index.toString())]);

const numberFromAnimatedValue = (index: Animated.Adaptable<number>) =>
  Number(index.toString());

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
  >(TOTAL_OF_CARDS.map(() => ({ from: 0, to: 0 })));

  const positionX = useRef(
    TOTAL_OF_CARDS.map(() => new Animated.Value<number>(0))
  ).current;

  const cardIndex = useRef(new Animated.Value<number>(0)).current;

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

  // useCode(() => onChange(scrollX, debug('scrollX', scrollX)), []);

  useCode(
    () =>
      // cond(isClockRunning(translateXclock, cardIndex), [
      //   debug('numberFromAnimatedValue(cardIndex)', cardIndex),
      //   set(
      //     translateX[numberFromAnimatedValue(cardIndex)],
      //     runProgress(
      //       translateXclock[numberFromAnimatedValue(cardIndex)],
      //       0,
      //       initialPositionX[numberFromAnimatedValue(cardIndex)].to
      //     )
      //   ),
      // ]),
      set(positionX, initialPositionX),
    [initialPositionX]
  );

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

          return (
            <Animated.View
              key={index.toString()}
              onLayout={(event: LayoutChangeEvent) => {
                const from = event.nativeEvent.layout.x;

                // console.log({
                //   from,
                //   to:
                //     -1 *
                //     (from -
                //       width * Math.floor(event.nativeEvent.layout.x / width)),
                // });

                const obj = {
                  from,
                  to:
                    -1 *
                    (from -
                      width * Math.floor(event.nativeEvent.layout.x / width)),
                };

                const arr = [...initialPositionX, obj];
                arr.shift();

                setInitialPositionX(arr.sort((a, b) => a.from - b.from));
              }}
            >
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
                          // set(
                          //   translateX[index],
                          //   runProgress(
                          //     translateXclock[index],
                          //     0,
                          //     initialPositionX[index].to
                          //   )
                          // ),
                          // debug('translateX[index]', translateX[index]),
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
                          { rotate: concat(0, 'deg') },
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
