import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { StyleSheet, View, Dimensions, LayoutChangeEvent } from 'react-native';
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
} from 'react-native-reanimated';
import {
  ScrollView,
  LongPressGestureHandler,
  LongPressGestureHandlerGestureEvent,
  LongPressGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import Card, { CARD_DIMENSIONS } from './src/components/Card';

const { width } = Dimensions.get('screen');

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

  const clock = useRef(TOTAL_OF_CARDS.map(() => new Animated.Clock())).current;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={styles.scroll}
      >
        {[1, 2, 3, 4].map((_, index) => {
          const rotate = interpolate(translateY[index], {
            inputRange: [-200, 0],
            outputRange: [0, -90],
            extrapolate: Extrapolate.CLAMP,
          });

          return (
            <LongPressGestureHandler
              key={index.toString()}
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
                        clockRunning(clock[index]),
                        set(
                          translateX[index],
                          runProgress(
                            clock[index],
                            0,
                            -index * (CARD_DIMENSIONS.width / 2)
                          )
                        )
                      ),
                      cond(eq(state, State.ACTIVE), set(longPressed[index], 1)),
                      cond(eq(oldState, State.ACTIVE), [
                        startClock(clock[index]),
                        // set(longPressed[index], 0),
                      ]),
                    ]),
                },
              ])}
            >
              <Animated.View style={{}}>
                <Card
                  onLayout={(event: LayoutChangeEvent) =>
                    console.log(event.nativeEvent.layout)
                  }
                  style={{
                    transform: [
                      { translateX: translateX[index] },
                      { translateY: translateY[index] },
                      { translateY: (-CARD_DIMENSIONS.height / 2) * 1.5 },
                      { rotate: concat(rotate, 'deg') },
                      { scale: cond(longPressed[index], 1.2, 1.4) },
                    ],
                  }}
                />
              </Animated.View>
            </LongPressGestureHandler>
          );
        })}
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
