import React, { useState, useRef, useMemo, useCallback, useContext } from 'react';
import { ScrollView, StyleSheet, View, Text, Switch, TouchableOpacity } from 'react-native';

import Bulb from '../../../components/LED/Bulb';

import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { MQTTContext } from '../../../context/MQTTContext';

const SmartLEDSIndex = () => {
    const router = useRouter();
    const { isLedTurnedOn, handleLedToggle } = useContext(MQTTContext);
    const [currentLed, setCurrentLed] = useState(0);

    // sheet
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => [1, '80%'], []);

    const handleLEDModalPress = useCallback((ledId) => {
        setCurrentLed(ledId);
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
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

    return (
        <BottomSheetModalProvider>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container}>
                <StatusBar style='dark' />
                <Stack.Screen
                    options={{
                        headerShown: true,
                        title: "My Smart LEDs"
                    }}
                />
                <View style={styles.containerBody}>
                    <TouchableOpacity
                        style={styles.switchRow}
                        onPress={() => {
                            router.replace({ pathname: "/(devices)/smart-leds/0", params: { led: 0 } })
                        }}>
                        <View style={styles.switchRowLeading}>
                            <View style={styles.switchRowIcon}>
                                <MaterialCommunityIcons name="lightbulb-outline" size={28} color="white" />
                            </View>
                            <Text style={styles.switchRowText}>Smart LED 1</Text>
                        </View>
                        <Switch value={isLedTurnedOn[0]} onValueChange={() => handleLedToggle(0)} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.switchRow}
                        onPress={() => {
                            router.replace({ pathname: "/(devices)/smart-leds/1", params: { led: 1 } })
                        }}>
                        <View style={styles.switchRowLeading}>
                            <View style={styles.switchRowIcon}>
                                <MaterialCommunityIcons name="lightbulb-outline" size={28} color="white" />
                            </View>
                            <Text style={styles.switchRowText}>Smart LED 2</Text>
                        </View>
                        <Switch value={isLedTurnedOn[1]} onValueChange={() => handleLedToggle(1)} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.switchRow}
                        onPress={() => {
                            router.replace({ pathname: "/(devices)/smart-leds/2", params: { led: 2 } })
                        }}>
                        <View style={styles.switchRowLeading}>
                            <View style={styles.switchRowIcon}>
                                <MaterialCommunityIcons name="lightbulb-outline" size={28} color="white" />
                            </View>
                            <Text style={styles.switchRowText}>Smart LED 3</Text>
                        </View>
                        <Switch value={isLedTurnedOn[2]} onValueChange={() => handleLedToggle(2)} />
                    </TouchableOpacity>

                </View>
                <BottomSheetModal
                    backgroundStyle={styles.bottomSheetModalContainer}
                    enablePanDownToClose
                    backdropComponent={renderBackdrop}
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    handleIndicatorStyle={styles.bottomSheetModalHandleIndicator}
                    style={styles.bottomSheetModalContainer}
                >

                    <View style={styles.bottomSheetModalHeading}>
                        <Text style={styles.bottomSheetModalHeadingTitle}>Smart LED {currentLed}</Text>
                        <Switch value={isLedTurnedOn[currentLed - 1]} onValueChange={() => handleLedToggle(currentLed - 1)} />
                    </View>

                    <View style={[styles.bulb, isLedTurnedOn[currentLed - 1] && styles.bulbOn]}>
                        <Bulb isLit={isLedTurnedOn[currentLed - 1]} />
                    </View>

                </BottomSheetModal>
            </ScrollView>
        </BottomSheetModalProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    containerBody: {
        flexDirection: 'column',
    },
    headerText: {
        fontSize: 24,
        fontWeight: '300',
        color: '#000000',
    },
    switchRow: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginVertical: 8,
    },
    switchRowLeading: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    switchRowIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#424242',
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchRowText: {
        fontSize: 16,
        color: '#000000',
        marginLeft: 12
    },
    bottomSheetWrapperContainer: {
        flex: 1,
        position: 'absolute',
    },
    bottomSheetModalContainer: {
        backgroundColor: '#424242',
        borderRadius: 16,
        flex: 1,
    },
    bottomSheetModalHandleIndicator: {
        backgroundColor: '#ffffff',
    },
    bottomSheetModalHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 16,
    },
    bottomSheetModalHeadingTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 16,
    },
    bulb: {
        position: 'absolute',
        bottom: '-5%',
        height: '100%',
        width: '100%',
        transform: [{ scale: 0.75 }]
    },
    bulbOn: {
        left: '-50%',
        transform: [{ scale: 1 }]
    }
});

export default SmartLEDSIndex;
