import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

const SectionHeader = ({ title, actionComponent, onActionPress, color = 'dark' }) => {

    return (
        <View style={styles.root}>
            <Text style={[styles.headerText, { color: color === 'dark' ? '#000' : '#fff' }]}> {title} </Text>
            {onActionPress ? <Pressable
                onPress={onActionPress}
                style={({ pressed }) => [
                    { opacity: pressed ? 0.5 : 1.0 },
                ]}>
                {actionComponent}
            </Pressable> : actionComponent }

        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export { SectionHeader, styles };
