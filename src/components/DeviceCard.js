import { View, StyleSheet, Text, Switch, Pressable } from "react-native"
import ToggleSwitch from "toggle-switch-react-native"


export const deviceData = [
    { deviceType: 'doorlock', deviceModel: 'Smart Door Lock' },
    { deviceType: 'leds', deviceModel: 'Smart LED Bulb' },
];

const getDeviceInfo = (deviceType, switchValue, deviceInfo) => {
    if (deviceInfo !== null) {
        if (deviceType === 'leds') {
            if (switchValue) {
                return `On •  ${Math.round(deviceInfo)}`;
            } else {
                return 'Off';
            }
        }
        // For other device types, you can modify this logic as needed.
        return deviceInfo;
    }

    switch (deviceType) {
        case 'doorlock':
            return switchValue ? "Locked" : "Unlocked";
        case 'leds':
            return switchValue ? "On" : "Off";
        default:
            return null;
    }
};

const DeviceCard = ({ deviceType, deviceModel, icon, onPress, switchValue, deviceInfo = null, onValueChange }) => {

    return (
        <Pressable
            onPress={onPress && onPress}
            style={({ pressed }) => [
                styles.widgetRow,
                { opacity: pressed ? 0.85 : 1.0 },
            ]}>
            <View style={styles.widgetRowHeading}>
                {icon}
                <ToggleSwitch isOn={switchValue} onToggle={onValueChange} />
            </View>
            <View style={styles.widgetRowDescription}>
                <Text style={styles.deviceType}>{getDeviceInfo(deviceType, switchValue, deviceInfo)}</Text>
                <Text style={styles.deviceModel}>{deviceModel}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    widgetRow: {
        backgroundColor: '#121212',
        borderRadius: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: 12,
    },
    widgetRowHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    widgetRowDescription: {
        marginTop: 36,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    deviceType: {
        maxWidth: '40%',
        fontSize: 12,
        color: '#CECECE',
        fontWeight: '400',
    },
    deviceModel: {
        maxWidth: '90%',
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
})

export default DeviceCard;