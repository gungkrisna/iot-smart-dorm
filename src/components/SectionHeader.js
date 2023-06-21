import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

const SectionHeader = ({ title, style, counterBadge, actionComponent, onActionPress, color = 'dark' }) => {

    return (
        <View style={[styles.root, style]}>
            <View style={styles.header}>
                <Text style={[styles.headerText, { color: color === 'dark' ? '#000' : '#fff' }]}> {title} </Text>
                {counterBadge && (
                    <View style={[styles.badgeContainer, { backgroundColor: color === 'dark' ? 'rgb(90, 120, 152)' : '#fff' }]}>
                        <Text style={[styles.headerText, { fontSize: 14, color: color === 'dark' ? '#fff' : '#000' }]}> {counterBadge} </Text>
                    </View>
                )}
            </View>
            {
                onActionPress ? <Pressable
                    onPress={onActionPress}
                    style={({ pressed }) => [
                        { opacity: pressed ? 0.5 : 1.0 },
                    ]}>
                    {actionComponent}
                </Pressable> : actionComponent
            }

        </View >
    );
};

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        paddingBottom: 8,
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
    },
    badgeContainer: {
        height: 24,
        minWidth: 24,
        marginLeft: 4,
        padding: 3,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export { SectionHeader, styles };
