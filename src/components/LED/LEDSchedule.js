import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Button } from 'react-native';
import ScheduleTimePicker from '../TimePicker/ScheduleTimePicker';
import { SectionHeader, styles as SectionStyles } from '../SectionHeader';
import { Ionicons } from '@expo/vector-icons'
import { FlatList } from 'react-native-gesture-handler';
import { retrieveUserDevice } from '../../store/auth';
import moment from 'moment-timezone';

const LEDSchedule = ({ rootPath, led, onAddSchedule, bottomSheetModalRef }) => {

    const [isRepeatMenuVisible, setRepeatMenuVisible] = useState(false);
    const [isActionMenuVisible, setActionMenuVisible] = useState(false);

    const [hours, setHours] = useState(2);
    const [minutes, setMinutes] = useState(2);

    const [scheduleDays, setScheduleDays] = useState({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
    });

    const [isTurnOn, setTurnOn] = useState(1);

    const selectedScheduleDays = () => {
        const result = Object.keys(scheduleDays)
            .filter((day) => scheduleDays[day])
            .map((day) => day.slice(0, 3))
            .join(", ");

        if (result === 'Sat, Sun') {
            return 'Weekend';
        } else if (result === 'Mon, Tue, Wed, Thu, Fri') {
            return 'Weekday';
        } else if (Object.values(scheduleDays).every(value => value === true)) {
            return 'Everyday';
        } else if (result.length === 0) {
            return 'Never';
        } else {
            return result;
        }
    }

    const toggleRepeatMenu = () => {
        setRepeatMenuVisible(!isRepeatMenuVisible);
    };

    const toggleActionMenu = () => {
        setActionMenuVisible(!isActionMenuVisible);
    };

    useEffect(() => {
    }, [hours, minutes]);

    const handleSave = () => {
        moment.locale('en');
        let isRepeat = true;
        let days = Object.entries(scheduleDays)
            .map(([day, value], index) => value ? (index + 1).toString() : null)
            .filter(index => index !== null);

        if (days.length === 0) {
            isRepeat = false;
            const today = moment().tz(moment.tz.guess()).isoWeekday().toString();
            days = [today];
        }
        
        const props = {
            clock: `${hours}:${minutes}`,
            isRepeat: isRepeat,
            days: days,
            timezone: moment.tz.guess(),
            index: led,
            path: `/${rootPath}/IS_LED_${led}_TURNED_ON`,
            turnOn: Boolean(isTurnOn)
        };

        bottomSheetModalRef.current?.close();
        console.log(props);
        onAddSchedule(props)
    }

    const handleRepeatDayCheck = (day) => {
        setScheduleDays((prevState) => ({
            ...prevState,
            [day]: !prevState[day],
        }));
    };

    handleActionCheck = (action) => {
        setTurnOn((prevState) => action);
    };

    const renderScheduleDays = ({ item, index }) => {
        const isChecked = scheduleDays[item];

        return (
            <View>
                <Pressable
                    onPress={() => handleRepeatDayCheck(item)}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 14,
                        paddingHorizontal: 18,
                        width: '100%',
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16 }}>{`Every ${item}`}</Text>
                    <Ionicons name="ios-checkmark" size={20} color={isChecked ? "#FFCC00" : "transparent"} />
                </Pressable>
                {index !== Object.keys(scheduleDays).length - 1 && (
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', height: 0.7 }} />
                )}
            </View>
        );
    };

    const renderAction = ({ item, index }) => {

        return (
            <View>
                <Pressable
                    onPress={() => handleActionCheck(index ? 0 : 1)}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 14,
                        paddingHorizontal: 18,
                        width: '100%',
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16 }}>{`${item}`}</Text>
                    <Ionicons name="ios-checkmark" size={20} color={isTurnOn !== index ? "#FFCC00" : "transparent"} />
                </Pressable>
                {index !== 1 && (
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', height: 0.7 }} />
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>

            <View style={styles.heading}>
                {(isRepeatMenuVisible || isActionMenuVisible) && (
                    <Pressable
                        onPress={() => isRepeatMenuVisible ? toggleRepeatMenu() : toggleActionMenu()}
                        style={({ pressed }) => [
                            { opacity: pressed ? 0.5 : 1.0 },
                            styles.backButton
                        ]}
                    >
                        <Ionicons name='chevron-back' size={24} color="#FFCC00" />
                        <Text style={styles.backText}>Back</Text>
                    </Pressable>
                )}
                <View style={styles.headingContainer}>
                    <Text style={styles.headingTitle}>{isRepeatMenuVisible ? "Repeat" : "Schedule"}</Text>
                </View>
            </View>

            <View style={styles.itemContainer} >
                {isRepeatMenuVisible
                    ? (
                        <FlatList
                            scrollEnabled={false}
                            data={Object.keys(scheduleDays)}
                            renderItem={renderScheduleDays}
                            keyExtractor={(item) => item}
                            style={{
                                marginTop: 36,
                                marginBottom: 144,
                                borderRadius: 16,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            }}
                        />
                    )
                    : isActionMenuVisible ? (
                        <FlatList
                            scrollEnabled={false}
                            data={["Turn on", "Turn off"]}
                            renderItem={renderAction}
                            keyExtractor={(item) => item}
                            style={{
                                marginVertical: 36,
                                borderRadius: 16,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            }}
                        />
                    ) : (<>
                        <ScheduleTimePicker
                            onValueChanging={(value) => setHours(value)}
                            initialValue={hours}
                            width={'50%'}
                            start={0}
                            end={23}
                            itemTextStyle={[styles.itemTextStyle]}
                            overlayStyle={styles.hoursPicker}
                        />
                        <ScheduleTimePicker
                            onValueChanging={(value) => setMinutes(value)}
                            initialValue={minutes}
                            width={'50%'}
                            start={0}
                            end={59}
                            itemTextStyle={[styles.itemTextStyle]}
                            overlayStyle={styles.minutesPicker}
                        />
                    </>)
                }

            </View>

            {!(isRepeatMenuVisible || isActionMenuVisible) && (
                <>
                    <SectionHeader title="Repeat" color="light" onActionPress={() => toggleRepeatMenu()} actionComponent={(
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[SectionStyles.headerText, { fontWeight: '400', color: '#cecece' }]}> {selectedScheduleDays()} </Text>
                            <Ionicons name="chevron-forward" size={18} style={{ marginRight: 8 }} color="#cecece" />
                        </View>
                    )} />

                    <SectionHeader title="Action" color="light" onActionPress={() => toggleActionMenu()} actionComponent={(
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[SectionStyles.headerText, { fontWeight: '400', color: '#cecece' }]}> {isTurnOn ? "Turn on" : "Turn off"} </Text>
                            <Ionicons name="chevron-forward" size={18} style={{ marginRight: 8 }} color="#cecece" />
                        </View>
                    )} />

                    <Pressable
                        disabled={(hours === 0 && minutes === 0) ? true : false}
                        style={({ pressed }) => [
                            styles.button,
                            (hours === 0 && minutes === 0) && { backgroundColor: 'rgb(44, 44, 44)' },
                            { opacity: pressed ? 0.5 : 1.0, marginTop: 24 },
                        ]} onPress={() => handleSave()}>
                        <Text style={[styles.buttonText, (hours === 0 && minutes === 0) && { color: 'rgba(255,255,255,0.3)' }]}>Tambah Schedule</Text>
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
                </>
            )}

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
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
    },
    backText: {
        marginLeft: 2,
        color: '#FFCC00',
        fontSize: 18,
    },
    headingContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headingTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
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
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
    }
});

export default LEDSchedule;