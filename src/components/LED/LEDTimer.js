import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import TimerTimePicker from '../TimePicker/TimerTimePicker';
import ToggleSwitch from "toggle-switch-react-native"

const LEDTimer = ({ hours, minutes, seconds, onUpdateTimer, bottomSheetModalRef }) => {
    const [isTimerOn, setIsTimerOn] = useState(true);

    const [newHours, setNewHours] = useState(0);
    const [newMinutes, setNewMinutes] = useState(0);
    const [newSeconds, setNewSeconds] = useState(0);

    const handleSave = () => {
        if(isTimerOn) {
            const currentTime = new Date();
            const futureTime = new Date(
                currentTime.getTime() +
                newHours * 60 * 60 * 1000 +
                newMinutes * 60 * 1000 +
                newSeconds * 1000
            );
    
            timestamp = futureTime.getTime();
            console.log(timestamp);
        } else {
            timestamp = 0;
        }
        onUpdateTimer(timestamp)
        bottomSheetModalRef.current?.close();
    }

    const handleTimerToggle = () => {
        setIsTimerOn(prevTimer => !prevTimer);
    }
    return (
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Timer</Text>
                <ToggleSwitch isOn={isTimerOn} onToggle={handleTimerToggle} />
            </View>
            <View pointerEvents={isTimerOn ? 'auto' : 'none'} style={styles.itemContainer} >
                <TimerTimePicker
                    disabled={!isTimerOn}
                    onValueChanging={setNewHours}
                    start={0}
                    end={23}
                    overlayLabel={"hr"}
                    overlayStyle={styles.hoursPicker}
                />
                <TimerTimePicker
                    disabled={!isTimerOn}
                    onValueChanging={setNewMinutes}
                    start={0}
                    end={59}
                    overlayLabel={"min"}
                    overlayStyle={styles.minutesPicker}
                />
                <TimerTimePicker
                    disabled={!isTimerOn}
                    onValueChanging={setNewSeconds}
                    start={0}
                    end={59}
                    overlayLabel={"sec"}
                    itemTextStyle={!isTimerOn && {color: 'rgba(255, 255, 255, 0.2)'}}
                    overlayStyle={styles.secondsPicker}
                />
            </View>

            <Pressable
                disabled={newHours === 0 && newMinutes === 0 && newSeconds === 0 && isTimerOn ? true : false}
                style={({ pressed }) => [
                    styles.button,
                    (newHours === 0 && newMinutes === 0 && newSeconds === 0 || !isTimerOn) && { backgroundColor: 'rgb(44, 44, 44)' },
                    { opacity: pressed ? 0.5 : 1.0 },
                ]} onPress={() => handleSave()}>
                <Text style={[styles.buttonText, (newHours === 0 && newMinutes === 0 && newSeconds === 0 && isTimerOn) ? { color: 'rgba(255,255,255,0.3)' } : !isTimerOn && { color: 'rgba(255,69,58,1)'}]}>{!(hours == 0 && minutes == 0 && seconds == 0) && isTimerOn ? 'Update Timer' : isTimerOn ? 'Simpan Timer' : 'Hapus Timer'}</Text>
            </Pressable>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: 'rgb(44, 44, 44)' },
                    { opacity: pressed ? 0.5 : 1.0 },
                ]} onPress={() =>
                    bottomSheetModalRef.current?.close()}>
                <Text style={[styles.buttonText, { color: 'rgb(10, 132, 255)' }]}>Batal</Text>
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
        backgroundColor: 'rgb(10, 132, 255)'
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
    },
    secondsPicker: {
        width: '100%',
        height: 35,
        borderRadius: 0,
        borderBottomRightRadius: 12,
        borderTopRightRadius: 12
    },
    itemTextStyle: {
        color: 'white',
        textAlign: 'right',
        position: 'absolute',
        right: 70
    }
});

export default LEDTimer;