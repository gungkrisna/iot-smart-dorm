import React, { useState, useRef, useMemo, useCallback, useContext } from 'react';
import { ScrollView, StyleSheet, View, Text, Switch, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MQTTContext } from '../../../context/MQTTContext';
import ListItem from '../../../components/ListItem';
import { LedIcon } from '../../../components/Icon';

const SmartLEDSIndex = () => {
    const router = useRouter();
    const { isLedTurnedOn, handleLedToggle } = useContext(MQTTContext);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container}>
            <StatusBar style='dark' />
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "My Smart LEDs"
                }}
            />
            <View style={styles.containerBody}>
                <ListItem
                    iconComponent={<LedIcon />}
                    text="LED Ruang Tamu"
                    subtitle="ON • 50% Brightness"
                    onPress={() => router.push('/(devices)/smart-leds/0')}
                    actionComponent={
                        <Switch value={isLedTurnedOn[0]} onValueChange={() => handleLedToggle(0)} />
                    }
                />

                <ListItem
                    iconComponent={<LedIcon />}
                    text="LED 1"
                    subtitle="ON • 50% Brightness"
                    onPress={() => router.push('/(devices)/smart-leds/1')}
                    actionComponent={
                        <Switch value={isLedTurnedOn[1]} onValueChange={() => handleLedToggle(1)} />
                    }
                />

                <ListItem
                    iconComponent={<LedIcon />}
                    text="LED 2"
                    subtitle="ON • 50% Brightness"
                    onPress={() => router.push('/(devices)/smart-leds/2')}
                    actionComponent={
                        <Switch value={isLedTurnedOn[2]} onValueChange={() => handleLedToggle(2)} />
                    }
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
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
    }
});

export default SmartLEDSIndex;
