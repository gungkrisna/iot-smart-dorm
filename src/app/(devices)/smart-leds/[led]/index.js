import { useState, useRef, useCallback, useMemo, useEffect, useContext } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, Text, StyleSheet, View, Pressable } from 'react-native';
import Bulb from '../../../../components/LED/Bulb';
import SafeViewAndroid from '../../../../components/AndroidSafeArea';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetView, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import EditLEDName from '../../../../components/LED/EditLEDName';
import useCountdown from '../../../../hooks/useCountdown';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LEDTimer from '../../../../components/LED/LEDTimer';
import LEDSchedule from '../../../../components/LED/LEDSchedule';
import { MQTTContext } from '../../../../context/MQTTContext';
import { addAutomation } from '../../../../store/auth';

const Led = () => {
    const { led } = useLocalSearchParams();
    const { rootPath, isLedTurnedOn, handleLedToggle, ledBrightness, handleLedBrightness, ledTimer, handleLedTimer } = useContext(MQTTContext);
    const [ledName, setLEDName] = useState('Ruang Keluarga');
    const [brightness, setBrightness] = useState(255);
    const [utility, setUtility] = useState('');
    const [bottomSheetPos, setBottomSheetPos] = useState(-1);

    const currLedBrightness = useSharedValue(255);

    const min = useSharedValue(0);
    const max = useSharedValue(255);

    const router = useRouter();

    const [timestamp, setTimestamp] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

    const [countdownHours, countdownMinutes, countdownSeconds] = useCountdown(timestamp);

    useEffect(() => {
        setTimestamp((parseInt(ledTimer[led]) * 1000));
    }, [ledTimer[led]])

    useEffect(() => {
        setTimeRemaining({ hours: countdownHours, minutes: countdownMinutes, seconds: countdownSeconds });
    }, [countdownHours, countdownMinutes, countdownSeconds]);


    useEffect(() => {
        setBrightness(ledBrightness[led]);
        currLedBrightness.value = ledBrightness[led] + 1;
    }, [])

    // sheet
    const bottomSheetModalRef = useRef(null);
    const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);

    const {
        animatedHandleHeight,
        animatedSnapPoints,
        animatedContentHeight,
        handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

    const handleLEDModalPress = useCallback((utility) => {
        setUtility(utility);
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        setBottomSheetPos(index);
    }, []);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={1}
                animatedIndex={{
                    value: 1,
                }}
            />
        ),
        []
    )

    const updateLEDName = (name) => {
        setLEDName(name);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <SafeAreaView style={{ ...SafeViewAndroid.AndroidSafeArea, ...styles.container }}>
                    <StatusBar style={'light'} />
                    <View style={styles.containerBody}>
                        <View style={styles.ledHeading}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.headingButton,
                                    { opacity: pressed ? 0.5 : 1.0 },
                                ]}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="chevron-back" size={22} color="white" />
                            </Pressable>
                            <View>
                                <Text style={styles.ledHeadingTitle}>Kusumon Smart LED {led}</Text>
                                <Text style={styles.ledHeadingName}>{ledName}</Text>
                            </View>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.headingButton,
                                    { opacity: pressed ? 0.5 : 1.0 },
                                ]}
                                onPress={() => router.push('/(tabs)/home')}
                            >
                                <Feather name="home" size={20} color="white" />
                            </Pressable>
                        </View>

                        <View style={[styles.bulb, isLedTurnedOn[led] && styles.bulbOn]}>
                            <Bulb isLit={isLedTurnedOn[led]} isBulbWhite brightness={brightness} />
                        </View>

                        {
                            isLedTurnedOn[led] && (
                                <View style={styles.controllerContainer}>
                                    <View style={styles.controllerContent}>
                                        <View style={{ position: 'absolute', right: 75 }}>
                                            <Pressable
                                                style={({ pressed }) => [
                                                    styles.sliderButton,
                                                    { opacity: pressed ? 0.5 : 1.0 },
                                                ]}
                                                onPress={() => handleLEDModalPress('edit')}
                                            >
                                                <Ionicons name="pencil-outline" size={30} color="white" />
                                            </Pressable>
                                            <Pressable
                                                style={({ pressed }) => [
                                                    styles.sliderButton,
                                                    { opacity: pressed ? 0.5 : 1.0 },
                                                ]}
                                                onPress={() => handleLEDModalPress('schedule')}>
                                                <Ionicons name="calendar-outline" size={30} color="white" />
                                            </Pressable>
                                            <Pressable
                                                style={({ pressed }) => [
                                                    styles.sliderButton,
                                                    !(timeRemaining.hours == 0 && timeRemaining.minutes == 0 && timeRemaining.seconds == 0) && { backgroundColor: '#ffffff' },
                                                    { opacity: pressed ? 0.5 : 1.0 },
                                                ]}
                                                onPress={() => handleLEDModalPress('timer')}>
                                                <Ionicons name="timer-outline" size={30} color={!(timeRemaining.hours == 0 && timeRemaining.minutes == 0 && timeRemaining.seconds == 0) ? "rgb(10, 132, 255)" : "white"} />
                                            </Pressable>
                                        </View>
                                        <Slider
                                            onHapticFeedback={() => {
                                                ReactNativeHapticFeedback.trigger('impactLight', {
                                                    enableVibrateFallback: true,
                                                    ignoreAndroidSystemSettings: false,
                                                });
                                            }}
                                            style={{ transform: [{ rotate: '-90deg' }], position: 'absolute', bottom: '50%', right: -59 }}
                                            theme={{
                                                disableMinTrackTintColor: '#424242',
                                                maximumTrackTintColor: '#424242',
                                                minimumTrackTintColor: '#fff',
                                                cacheTrackTintColor: '#fff',

                                            }}
                                            renderBubble={() => null}
                                            renderThumb={() => null}
                                            progress={currLedBrightness}
                                            minimumValue={min}
                                            maximumValue={max}
                                            minimumTrackTintColor="#fff"
                                            maximumTrackTintColor="#fff"
                                            hapticMode='HapticModeEnum.NONE'
                                            containerStyle={{ borderRadius: 12, width: 212, height: 60 }}
                                            onValueChange={(brightness) => setBrightness(brightness)}
                                            onSlidingComplete={(brightness) => handleLedBrightness(led, brightness)}
                                        />
                                    </View>
                                </View>
                            )
                        }


                        <View style={styles.toggleButtonWrapper}>
                            {!(timeRemaining.hours == 0 && timeRemaining.minutes == 0 && timeRemaining.seconds == 0) && (
                                <Text style={styles.timerCountdownText}>
                                    Lampu akan {isLedTurnedOn[led] ? 'dimatikan' : 'dinyalakan'} dalam
                                    {
                                        timeRemaining.hours > 0
                                            ? ` ${timeRemaining.hours}h:${timeRemaining.minutes}m:${timeRemaining.seconds}s`
                                            : timeRemaining.minutes > 0
                                                ? ` ${timeRemaining.minutes}m:${timeRemaining.seconds}s`
                                                : ` ${timeRemaining.seconds}s`
                                    }
                                </Text>
                            )}

                            <Pressable
                                style={({ pressed }) => [
                                    styles.toggleButton,
                                    isLedTurnedOn[led] && { backgroundColor: 'rgb(44, 44, 44)' },
                                    { opacity: pressed ? 0.5 : 1.0 },
                                ]} onPress={() => handleLedToggle(led)}>
                                <Text style={[styles.toggleButtonText, isLedTurnedOn[led] && { color: 'rgb(10, 132, 255)' }]}>Turn {isLedTurnedOn[led] ? 'off' : 'on'}</Text>
                            </Pressable>
                        </View>
                        
                        <BottomSheetModal
                            enablePanDownToClose={false}
                            enableOverDrag={false}
                            backdropComponent={renderBackdrop}
                            ref={bottomSheetModalRef}
                            snapPoints={animatedSnapPoints}
                            handleHeight={animatedHandleHeight}
                            contentHeight={animatedContentHeight}
                            enableContentPanningGesture={false}
                            onChange={handleSheetChanges}
                            keyboardBlurBehavior='restore'
                            backgroundStyle={{ backgroundColor: '#212121' }}
                            handleIndicatorStyle={{ backgroundColor: '#424242', display: 'none' }}

                        >
                            <BottomSheetView style={styles.bsContentContainer}
                                onLayout={handleContentLayout}>
                                {utility === 'edit' && <EditLEDName ledName={ledName} onUpdateLEDName={updateLEDName} bottomSheetModalRef={bottomSheetModalRef} />}
                                {utility === 'schedule' && <LEDSchedule rootPath={rootPath} led={led} onAddSchedule={(props) => addAutomation(props)} bottomSheetModalRef={bottomSheetModalRef} />}
                                {utility === 'timer' && <LEDTimer hours={timeRemaining.hours} minutes={timeRemaining.minutes} seconds={timeRemaining.seconds} onUpdateTimer={(timestamp) => handleLedTimer(led, timestamp)} bottomSheetModalRef={bottomSheetModalRef} />}
                            </BottomSheetView>
                        </BottomSheetModal>

                    </View>
                </SafeAreaView >
            </BottomSheetModalProvider >
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212121',
        padding: 16,
    },
    containerBody: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    ledHeading: {
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    ledHeadingTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
        textAlign: 'center',
    },
    ledHeadingName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 16,
        textAlign: 'center'
    },
    headingButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 50,
        backgroundColor: '#424242',
        borderRadius: 12,
    },
    bulb: {
        flex: 1,
        paddingBottom: '15%',
    },
    bulbOn: {
        left: '-50%',
        transform: [{ scale: 1.5 }]
    },
    controllerContainer: {
        position: 'absolute',
        top: '50%',
        right: 24,
        height: 'auto',
        width: '100%',
        flex: 1,
        alignItems: 'flex-end',
    },
    controllerContent: {
        height: 200,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    sliderThumb: {
        backgroundColor: '#fff',
        flex: 1,
        width: 60,
        height: 30,
    },
    sliderTrack: {
        backgroundColor: '#424242',
        borderRadius: 12,
        borderWidth: 30,
        height: 'auto'
    },

    sliderButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
        height: 60,
        width: 60,
        backgroundColor: '#424242',
        borderRadius: 12,
    },
    toggleButtonWrapper: {
        position: 'absolute',
        bottom: 0,
        height: 'auto',
        width: '100%',
        flex: 1,
        alignItems: 'center',
    },
    timerCountdownText: {
        fontSize: 12,
        fontWeight: '400',
        color: '#ffffff',
        marginBottom: 16,
    },
    toggleButton: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 32,
        elevation: 3,
        backgroundColor: 'rgb(10, 132, 255)',
    },
    toggleButtonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    bsContentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        width: '100%',
    }
})

export default Led;