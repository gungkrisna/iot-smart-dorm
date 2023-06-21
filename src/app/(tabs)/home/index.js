import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, RefreshControl, FlatList, ActivityIndicator, SafeAreaView, View, Text, StyleSheet, Switch, Image } from 'react-native';
import SafeViewAndroid from '../../../components/AndroidSafeArea';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from "expo-router";
import * as LocalAuthentication from 'expo-local-authentication';
import { Entypo, AntDesign } from '@expo/vector-icons';
import { MQTTContext } from '../../../context/MQTTContext';
import SensorCard from '../../../components/SensorCard';
import DeviceCard, { deviceData } from '../../../components/DeviceCard';
import Grid from '../../../components/Grid';
import useElapsedTime from '../../../hooks/useElapsedTime';
import { SectionHeader } from '../../../components/SectionHeader';
import { AuthStore, retrieveAutomation, getLedName } from "../../../store/auth";
import ListItem from '../../../components/ListItem';
import { ChevronForward, DoorLockIcon, LedIcon } from '../../../components/Icon';
import useAutomationData from '../../../hooks/useAutomationData';
import WeekdaysArrayToString from '../../../utils/WeekdaysArrayToString';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import ToggleSwitch from "toggle-switch-react-native"
import FormatTime from '../../../utils/FormatTime';

const Tab1Index = () => {
    const router = useRouter();

    const { onMQTTLost, isLoading, temp, hum, DHTLastUpdate, isDoorLocked, toggleLock, isLedTurnedOn, handleLedToggle, ledBrightness } = useContext(MQTTContext);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const { isFetching, automationDocuments, onUpdateAutomationDocuments } = useAutomationData(3);
    const [isDeviceGridView, setDevicevGridView] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [ledName, setLedName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            await getLedName(0, (name) => {
                setLedName(name);
            });
        };

        fetchData();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            await retrieveAutomation(onUpdateAutomationDocuments);
        } catch (error) {
            console.log('Error refreshing data:', error);
        } finally {
            setRefreshing(false);
        }
    };

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
            //handleLedToggle(1);
            //handleLedToggle(2);
        } else {
            isLedTurnedOn.forEach((led, index) => {
                if (!led) {
                    handleLedToggle(index);
                }
            });
        }
    }

    if (isLoading && isFetching) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const getDeviceIcon = (deviceType) => {
        switch (deviceType) {
            case 'doorlock':
                return <DoorLockIcon size={30} color="#cecece" />;
            case 'leds':
                return <LedIcon size={30} color="#cecece" />;
            default:
                return null;
        }
    }

    const getDeviceOnPress = (deviceType, router) => {
        switch (deviceType) {
            case 'doorlock':
                return handleDoorLockToggle;
            case 'leds':
                return () => router.push('/(devices)/smart-leds/0');
            default:
                return null;
        }
    }

    const getDeviceSwitchValue = (deviceType) => {
        switch (deviceType) {
            case 'doorlock':
                return isDoorLocked;
            case 'leds':
                // return isLedTurnedOn.every((led) => led === true);
                return isLedTurnedOn[0];
            default:
                return null;
        }
    }

    const getDeviceInfo = (deviceType) => {
        switch (deviceType) {
            case 'doorlock':
                return null;
            case 'leds':
                // return isLedTurnedOn.every((led) => led === true);
                return ledBrightness[0];
            default:
                return null;
        }
    }

    const getDeviceOnValueChange = (deviceType) => {
        switch (deviceType) {
            case 'doorlock':
                return handleDoorLockToggle;
            case 'leds':
                // return handleMassLedToggle;
                return (() => handleLedToggle(0));
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
                deviceInfo={getDeviceInfo(item.deviceType)}
                onValueChange={getDeviceOnValueChange(item.deviceType)}
            />
        </View>
    );

    return (
        <MenuProvider>
            <SafeAreaView style={{ ...SafeViewAndroid.AndroidSafeArea, ...styles.container }}>
                <StatusBar style='dark' />
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                >
                    <View style={styles.containerBody}>
                        <View style={styles.headerRow}>
                            <View style={styles.headerCol}>
                                <Text style={[styles.headerText, { fontWeight: '800', fontSize: 24, marginBottom: 8 }]}>Hey {AuthStore.getRawState().user?.displayName?.split(' ')[0]}</Text>
                                <Text style={styles.headerText}>Welcome to your smart home</Text>
                            </View>
                            <View style={styles.imageBox}>
                                {/*<Image
                                    source={{ uri: 'https://kpopping.com/documents/28/0/800/220803-NEWJEANS-SNS-Update-Danielle-documents-1.jpeg?v=6ca92' }}
                                    style={styles.image}
                />*/}
                                <Text style={[styles.headerText, { color: 'white', fontWeight: '800' }]}>{AuthStore.getRawState().user?.displayName.split(' ').map((name) => name.charAt(0).toUpperCase()).join('')}</Text>
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
                            <Menu>
                                <MenuTrigger>
                                    <Entypo name="dots-three-horizontal" size={18} style={{ marginRight: 8 }} color="black" />
                                </MenuTrigger>
                                <MenuOptions
                                >
                                    <MenuOption onSelect={() => setDevicevGridView(() => true)} text='Grid View' />
                                    <MenuOption onSelect={() => setDevicevGridView(() => false)} text='List View' />
                                </MenuOptions>
                            </Menu>
                        )} />

                        {isDeviceGridView ? (
                            <Grid
                                renderItem={renderDevice}
                                data={deviceData}
                                numColumns={2}
                            />
                        ) :
                            (
                                <>
                                    <ListItem
                                        iconComponent={<DoorLockIcon />}
                                        text="Smart Door Lock"
                                        subtitle={isDoorLocked ? "Locked" : "Unlocked"}
                                        onPress={() => handleDoorLockToggle()}
                                        actionComponent={<ToggleSwitch isOn={isDoorLocked} onToggle={handleDoorLockToggle} />}
                                    />

                                    <ListItem
                                        iconComponent={<LedIcon />}
                                        text="Smart LED Bulb"
                                        subtitle={`${isLedTurnedOn[0] ? "On" : "Off"} • Brightness: ${Math.round(ledBrightness[0])}`}
                                        onPress={() => router.push('/(devices)/smart-leds/0')}
                                        actionComponent={
                                            <ToggleSwitch
                                                isOn={isLedTurnedOn[0]}
                                                onToggle={() => handleLedToggle(0)}
                                            />
                                        }
                                    />
                                </>
                            )}



                        {automationDocuments.length > 0 && (
                            <>
                                <SectionHeader title="Automation" actionComponent={(
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={[styles.headerText, { fontWeight: '400', fontSize: 13, marginRight: 6 }]}> See more </Text>
                                        <AntDesign name="arrowright" size={18} style={{ marginRight: 8 }} color="black" />
                                    </View>
                                )} onActionPress={() => router.push('/(tabs)/automation')} />

                                <FlatList
                                    scrollEnabled={false}
                                    contentContainerStyle={{ flexGrow: 1, paddingVertical: 8 }} // Move paddingBottom to style
                                    data={automationDocuments}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <ListItem
                                            text={`${item.turnOn ? "Nyalakan" : "Matikan"} LED ${ledName}`}
                                            subtitle={`${WeekdaysArrayToString(item.days, isShortForm = true)} • ${FormatTime(item.clock)}`}
                                        //actionComponent={<ToggleSwitch isOn={item.turnOn} onToggle={() => {console.log('toggled')}} />}
                                        />
                                    )} />
                            </>
                        )}


                    </View>
                </ScrollView>
            </SafeAreaView>
        </MenuProvider>
    )
}

const styles = StyleSheet.create({
    container: {
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
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4299e1',
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Tab1Index;
