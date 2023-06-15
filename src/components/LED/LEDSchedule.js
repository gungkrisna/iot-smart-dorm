import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import ScheduleTimePicker from '../TimePicker/ScheduleTimePicker';

const LEDSchedule = ({ onUpdateTimer, bottomSheetModalRef }) => {
    const [newHours, setNewHours] = useState(2);
    const [newMinutes, setNewMinutes] = useState(2);

    useEffect(() => {
    }, [newHours, newMinutes]);

    const handleSave = () => {
        const currentTime = new Date();
        const futureTime = new Date(
            currentTime.getTime() +
            newHours * 60 * 60 * 1000 +
            newMinutes * 60 * 1000
        );

        const timestamp = futureTime.getTime();
        bottomSheetModalRef.current?.close();
        onUpdateTimer(timestamp)
    }

    return (
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Schedule</Text>
            </View>
            <View style={styles.itemContainer} >
                <ScheduleTimePicker
                    onValueChange={(value) => setNewHours(value)}
                    width={'50%'}
                    start={0}
                    end={23}
                    itemTextStyle={[styles.itemTextStyle]}
                    overlayStyle={styles.hoursPicker}
                />
                <ScheduleTimePicker
                    onValueChange={(value) => setNewMinutes(value)}
                    width={'50%'}
                    start={0}
                    end={59}
                    itemTextStyle={[styles.itemTextStyle]}
                    overlayStyle={styles.minutesPicker}
                />
            </View>

            <View>
                <Text>Ulangi</Text>
            </View>

            <Pressable
                disabled={(newHours === 0 && newMinutes === 0) ? true : false}
                style={({ pressed }) => [
                    styles.button,
                    (newHours === 0 && newMinutes === 0) && { backgroundColor: 'rgb(44, 44, 44)' },
                    { opacity: pressed ? 0.5 : 1.0 },
                ]} onPress={() => handleSave()}>
                <Text style={[styles.buttonText, (newHours === 0 && newMinutes === 0) && { color: 'rgba(255,255,255,0.3)' }]}>Tambah Schedule</Text>
            </Pressable>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: 'rgb(44, 44, 44)' },
                    { opacity: pressed ? 0.5 : 1.0 },
                ]} onPress={() =>
                    bottomSheetModalRef.current?.close()}>
                <Text style={[styles.buttonText, { color: 'rgb(59, 130, 247)' }]}>Batal</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        backgroundColor: '#212121',
        paddingBottom: 24,
    },
    headingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        marginBottom: 24,
    },
    input: {
        height: 40,
        marginBottom: 12,
        padding: 10,
        borderRadius: 12,
        color: 'white',
        backgroundColor: '#424242',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginBottom: 12,
        backgroundColor: 'rgb(59, 130, 247)'
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    hoursPicker: {
        width: '100%',
        height: 35,
        borderRadius: 0,
        borderBottomLeftRadius: 12,
        borderTopLeftRadius: 12
    },
    minutesPicker: {
        width: '100%',
        height: 35,
        borderRadius: 0,
        borderBottomRightRadius: 12,
        borderTopRightRadius: 12
    },
    itemTextStyle: {
        color: 'white',
    }
});

export default LEDSchedule;