import React, { useEffect, useState, useContext } from 'react';
import { ActivityIndicator, SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Switch, Image } from 'react-native';
import SafeViewAndroid from '../../../components/AndroidSafeArea';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from "expo-router";
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MQTTContext } from '../../../context/MQTTContext';
import SensorCard from '../../../components/SensorCard';
import DeviceCard, { getDeviceIcon, deviceData } from '../../../components/DeviceCard';
import Grid from '../../../components/Grid';
import useElapsedTime from '../../../hooks/useElapsedTime';
import { SectionHeader } from '../../../components/SectionHeader';
import { AuthStore } from "../../../store/auth";

const Tab1Index = () => {
    const { isLoading, temp, hum, DHTLastUpdate, isDoorLocked, toggleLock, isLedTurnedOn, handleLedToggle } = useContext(MQTTContext);

    const router = useRouter();
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    const sensorData = [
        { sensorType: 'Temp', value: temp, unit: '°C' },
        { sensorType: 'Humidity', value: hum, unit: '%' },
    ];

    const [climateMonitorLastUpdate, setClimateMonitorLastUpdate] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [hours, minutes, seconds] = useElapsedTime(DHTLastUpdate * 1000);

    useEffect(() => {
        setClimateMonitorLastUpdate({ hours, minutes, seconds });
    }, [hours, minutes, seconds]);

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
        })();
    });

    const handleDoorLockToggle = () => {
        if (isDoorLocked) {
            const auth = LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to Unlock Smart Door',
                fallbackLabel: 'Enter Password',
            })
            auth.then(result => {
                console.log(result);
                if (result.success) {
                    toggleLock();
                }
            })
        } else {
            toggleLock();
        }
    };

    handleMassLedToggle = () => {
        const areAllLedsTurnedOn = isLedTurnedOn.every((led) => led === true);

        if (areAllLedsTurnedOn) {
            handleLedToggle(0);
            handleLedToggle(1);
            handleLedToggle(2);
        } else {
            isLedTurnedOn.forEach((led, index) => {
                if (!led) {
                    handleLedToggle(index);
                }
            });
        }
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }

    const getDeviceOnPress = (deviceType, router) => {
        switch (deviceType) {
            case 'Door Lock':
                return handleDoorLockToggle;
            case 'LEDs [3]':
                return () => router.push('/(devices)/smart-leds');
            default:
                return null;
        }
    }

    const getDeviceSwitchValue = (deviceType) => {
        switch (deviceType) {
            case 'Door Lock':
                return isDoorLocked;
            case 'LEDs [3]':
                return isLedTurnedOn.every((led) => led === true);
            default:
                return null;
        }
    }

    const getOnValueChange = (deviceType) => {
        switch (deviceType) {
            case 'Door Lock':
                return handleDoorLockToggle;
            case 'LEDs [3]':
                return handleMassLedToggle;
            default:
                return null;
        }
    }

    const renderSensor = ({ item }) => (
        <View style={styles.renderItem}>
            <SensorCard
                sensorType={item.sensorType}
                value={item.value}
                unit={item.unit}
            />
        </View>
    );

    const renderDevice = ({ item }) => (
        <View style={styles.renderItem}>
            <DeviceCard
                deviceType={item.deviceType}
                deviceModel={item.deviceModel}
                icon={getDeviceIcon(item.deviceType)}
                onPress={getDeviceOnPress(item.deviceType, router)}
                switchValue={getDeviceSwitchValue(item.deviceType)}
                onValueChange={getOnValueChange(item.deviceType)}
            />
        </View>
    );

    return (
        <SafeAreaView style={{ ...SafeViewAndroid.AndroidSafeArea, ...styles.container }}>
            <StatusBar style='dark' />
            <View style={styles.containerBody}>
                <View style={styles.headerRow}>
                    <View style={styles.headerCol}>
                        <Text style={[styles.headerText, { fontWeight: '800', fontSize: 24, marginBottom: 8 }]}>Hey {AuthStore.getRawState().user?.displayName?.split(' ')[0]}</Text>
                        <Text style={styles.headerTexrRt}>Welcome to your smart home</Text>
                    </View>
                    <View style={styles.imageBox}>
                        <Image
                            source={{ uri: 'https://kpopping.com/documents/28/0/800/220803-NEWJEANS-SNS-Update-Danielle-documents-1.jpeg?v=6ca92' }}
                            style={styles.image}
                        />
                    </View>
                </View>

                <SectionHeader title="Room Climate Monitor" actionComponent={
                    !(!DHTLastUpdate && DHTLastUpdate == 0 && climateMonitorLastUpdate.hours == 0 && climateMonitorLastUpdate.minutes == 0 && climateMonitorLastUpdate.seconds == 0) && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.headerText, { fontWeight: '400', fontSize: 13, marginRight: 6 }]}>
                                {
                                    climateMonitorLastUpdate.hours !== 0
                                        ? `${climateMonitorLastUpdate.hours}h `
                                        : climateMonitorLastUpdate.minutes !== 0
                                            ? `${climateMonitorLastUpdate.minutes}m `
                                            : `${climateMonitorLastUpdate.seconds}s `
                                }
                                ago
                            </Text>
                        </View>
                    )
                } />

                <Grid
                    renderItem={renderSensor}
                    data={sensorData}
                    numColumns={2}
                />

                <SectionHeader title="Devices" actionComponent={(
                    <Entypo name="dots-three-horizontal" size={18} style={{ marginRight: 8 }} color="black" />
                )} />

                <Grid
                    renderItem={renderDevice}
                    data={deviceData}
                    numColumns={2}
                />

                <View
                    style={styles.switchRow}
                >

                    <View style={styles.switchRowLeading}>
                        <View style={styles.switchRowIcon}>
                            <MaterialCommunityIcons name="door" size={28} color="#212121" />
                        </View>
                        <Text style={styles.switchRowText}>Smart Door Lock</Text>
                    </View>
                    <Switch value={isDoorLocked} onValueChange={handleDoorLockToggle} />
                </View>

                <TouchableOpacity
                    style={styles.switchRow}
                    onPress={() => {
                        router.push('/(devices)/smart-leds');
                    }}
                >
                    <View style={styles.switchRowLeading}>
                        <View style={styles.switchRowIcon}>
                            <MaterialCommunityIcons name="lightbulb-outline" size={28} color="#212121" />
                        </View>
                        <Text style={styles.switchRowText}>Smart LEDs</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={24} />
                </TouchableOpacity>

                <SectionHeader title="Automation" actionComponent={(
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.headerText, { fontWeight: '400', fontSize: 13, marginRight: 6 }]}> See more </Text>
                        <AntDesign name="arrowright" size={18} style={{ marginRight: 8 }} color="black" />
                    </View>
                )} />


            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerBody: {
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
    },
    headerCol: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    imageBox: {
        marginLeft: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: 48,
        height: 48,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '300',
        color: '#000000',
    },
    headerSectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        paddingBottom: 8,
    },
    renderItem: {
        flex: 1,
        margin: 5,
    },
    switchRow: {
        backgroundColor: '#f2f2f2',
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
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchRowText: {
        fontSize: 16,
        color: '#000000',
        marginLeft: 12
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Tab1Index;
