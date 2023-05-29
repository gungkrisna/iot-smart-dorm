import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, Switch, Button } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import DatePicker from 'react-native-date-picker'

const TimerModal = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [hours, setHours] = useState(selectedTime.getHours());
  const [minutes, setMinutes] = useState(selectedTime.getMinutes());
  const [seconds, setSeconds] = useState(selectedTime.getSeconds());
  const [date, setDate] = useState(new Date())



  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const handleTimerModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
  }, []);



  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Button title="Set Timer" onPress={handleTimerModalPress} />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.contentContainer}>
            <DatePicker date={date} locale='fr' is24hourSource="locale" onDateChange={setDate} mode='time'/>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16
  }
})
export default TimerModal;
