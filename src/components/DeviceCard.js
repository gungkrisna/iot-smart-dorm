import { View, StyleSheet, Text, Switch, Pressable } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export const deviceData = [
    { deviceType: 'Door Lock', deviceModel: 'Kusumon Smart Door Lock' },
    { deviceType: 'LEDs [3]', deviceModel: 'Kusumon Smart LED Bulb' },
];

export const getDeviceIcon = (deviceType) => {
    const doorIcon = <MaterialCommunityIcons name="door" size={30} color="#cecece" />;
    const bulbIcon = <MaterialCommunityIcons name="lightbulb-outline" size={30} color="#cecece" />;
    switch (deviceType) {
        case 'Door Lock':
            return doorIcon;
        case 'LEDs [3]':
            return bulbIcon;
        default:
            return null;
    }
}

const DeviceCard = ({ deviceType, deviceModel, icon, onPress, switchValue, onValueChange }) => {

    return (
        <Pressable
            onPress={onPress && onPress}
            style={({ pressed }) => [
                styles.widgetRow,
                { opacity: pressed ? 0.85 : 1.0 },
            ]}>
            <View style={styles.widgetRowHeading}>
                {icon}
                <Switch value={switchValue} onValueChange={onValueChange}/>
            </View>
            <View style={styles.widgetRowDescription}>
                <Text style={styles.deviceType}>{deviceType}</Text>
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
        maxWidth: '80%',
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
})

export default DeviceCard;