import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, Button, Switch, TextInput } from 'react-native';
import MQTTConnection from '../../../src/MQTTConnection';
import { useCountdown } from '../../../src/useCountdown';
import * as LocalAuthentication from 'expo-local-authentication';
import TimerModal from '../../../src/TimerModal';

import { Buffer } from 'buffer';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

global.Buffer = Buffer;

const Tab1Index = () => {
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    const [temp, setTemp] = useState(0);
    const [hum, setHum] = useState(0);
    const [isDoorLocked, setIsDoorLocked] = useState(false);
    const [isBulbTurnedOn, setIsBulbTurnedOn] = useState(false);

    const [timerEndTime, setTimerEndTime] = useState('');
    const [isTimerModalVisible, setTimerModalVisible] = useState(false);
    const [timerDuration, setTimerDuration] = useState(0);
    const [timerEnabled, setTimerEnabled] = useState(false);


    const roomID = 'ROOM_1';

    const options = {
        useSSL: true,
        userName: 'hivemq.webclient.1685212985222',
        password: '2X!M8.43LxhJ>AR;navy',
        onFailure: (e) => {
            console.log('here is the error', e);
        },
        reconnect: true,
        cleanSession: true,
        mqttVersion: 3,
        keepAliveInterval: 60,
        timeout: 60,
    };


    // Check if hardware supports biometrics
    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
        })();
    });

    useEffect(() => {
        this.mqttConnect = new MQTTConnection()
        this.mqttConnect.onMQTTConnect = this.onMQTTConnect
        this.mqttConnect.onMQTTLost = this.onMQTTLost
        this.mqttConnect.onMQTTMessageArrived = this.onMQTTMessageArrived
        this.mqttConnect.onMQTTMessageDelivered = this.onMQTTMessageDelivered

        this.mqttConnect.connect(
            '6f4d1220c6cb4852ab4266f96abc384e.s2.eu.hivemq.cloud',
            8884,
            options
        );

        onMQTTConnect = () => {
            this.mqttConnect.subscribeChannel(`/${roomID}/TEMPERATURE`);
            this.mqttConnect.subscribeChannel(`/${roomID}/HUMIDITY`);
            this.mqttConnect.subscribeChannel(`/${roomID}/IS_DOOR_LOCKED`);
            this.mqttConnect.subscribeChannel(`/${roomID}/IS_BULB_TURNED_ON`);
            this.mqttConnect.subscribeChannel(`/${roomID}/TIMER_END_TIME`);
        };

        onMQTTLost = () => {
            console.log('MQTT connection lost');
        };

        onMQTTMessageArrived = (message) => {
            const topic = message.destinationName;
            const payload = message.payloadString;
            console.log('MQTT message arrived: ' + topic + ' ' + payload);
            if (topic === `/${roomID}/TEMPERATURE`) {
                setTemp(prevTemp => payload);
            } else if (topic === `/${roomID}/HUMIDITY`) {
                setHum(prevHum => payload);
            } else if (topic === `/${roomID}/IS_DOOR_LOCKED`) {
                setIsDoorLocked(payload === '1');
            } else if (topic === `/${roomID}/IS_BULB_TURNED_ON`) {
                setIsBulbTurnedOn(payload === '1');
            } else if (topic === `/${roomID}/TIMER_END_TIME`) {
                setTimerEndTime(prevEndTime => payload);
            }
        };

        onMQTTMessageDelivered = (message) => {
            console.log(
                'MQTT message delivered: ' +
                message.destinationName +
                ' ' +
                message.payloadString
            );
        };

        return () => {
            this.mqttConnect.close();
        };
    }, []);

    const toggleLock = () => {
        setIsDoorLocked((prevIsDoorLocked) => {
            const isDoorLocked = !prevIsDoorLocked;
            this.mqttConnect.send(`/${roomID}/IS_DOOR_LOCKED`, isDoorLocked ? '1' : '0');
            return isDoorLocked;
        });
    }

    const handleDoorLockToggle = () => {
        if (isDoorLocked) {
            const auth = LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate',
                fallbackLabel: 'Enter Password',
            })
            auth.then(result => {
                if (result.success) {
                    toggleLock();
                }
            })
        } else {
            toggleLock();
        }

    };


    const handleBulbToggle = () => {
        setIsBulbTurnedOn((prevIsBulbTurnedOn) => {
            const isBulbTurnedOn = !prevIsBulbTurnedOn;
            this.mqttConnect.send(
                `/${roomID}/IS_BULB_TURNED_ON`,
                isBulbTurnedOn ? '1' : '0'
            );
            return isBulbTurnedOn;
        });
    };

    const handleTimerSet = (duration, enabled) => {
        setTimerDuration(duration);
        setTimerEnabled(enabled);
        setTimerModalVisible(false);

        if (enabled) {
            const timerEndTime = Date.now() + duration;
            this.mqttConnect.send(`/${roomID}/TIMER_END_TIME`, timerEndTime.toString());
        } else {
            this.mqttConnect.send(`/${roomID}/TIMER_END_TIME`, '0');
        }
    };


    return (
            <View style={styles.container}>
                <Text>Temperature: {temp}</Text>
                <Text>Humidity: {hum}</Text>
                <Text>Door Lock: {isDoorLocked ? 'Locked' : 'Unlocked'}</Text>
                <Switch value={isDoorLocked} onValueChange={handleDoorLockToggle} />
                <Text>Bulb: {isBulbTurnedOn ? 'On' : 'Off'}</Text>
                <Switch value={isBulbTurnedOn} onValueChange={handleBulbToggle} />
                <TimerModal />
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default Tab1Index;
