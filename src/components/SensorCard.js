import { View, StyleSheet, Text } from "react-native"
import { LinearGradient } from "expo-linear-gradient";

const SensorCard = ({ sensorType, value, unit }) => {

    return (
        <LinearGradient
            colors={['rgb(213, 223, 232)', 'rgb(156, 195, 215)', 'rgb(95, 123, 164)']}
            style={styles.sensorContainer}
            start={{ x: 0.6, y: 0 }}
            end={{ x: 0.6, y: 1 }}
        >
            <LinearGradient
                colors={['rgb(179, 205, 224)', 'rgb(100, 151, 177)', 'rgb(1, 31, 75)']}
                style={styles.sensorTypeContainer}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1.15 }}
            >
                <Text style={styles.sensorType}>{sensorType}</Text>
                <View style={styles.divider} />
            </LinearGradient>
            
            <Text style={styles.sensorValue}>{Math.round(value * 10) / 10}{unit}</Text>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    sensorContainer: {
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    sensorTypeContainer: {
        height: '100%',
        width: '60%',
        borderTopRightRadius: 14,
        borderBottomRightRadius: 14,
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 6,
        paddingVertical: 24
    },
    divider: {
        width: 3,
        height: '80%',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    sensorType: {
        fontSize: 14,
        color: '#FFF',
        marginLeft: 8,
    },
    sensorValue: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
        marginRight: 5,
    },
})

export default SensorCard;