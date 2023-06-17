import { memo, useMemo } from 'react';
import React from 'react';
import { StyleSheet } from 'react-native';
import WheelPicker from '@gungkrisna/react-native-ios-time-picker';

const TimerTimePicker = ({disabled, start, end, onValueChanging, overlayLabel, overlayStyle }) => {
    const dataArr = useMemo(() => {
        const length = end - start + 1;
        return Array.from({ length }, (_, index) => ({
          value: index + start,
          label: String(index + start),
        }));
      }, [start, end]);

    return (
        <WheelPicker
            onValueChanging={({ item }) => {
                onValueChanging(item.value);
            }}
            value={0}
            width={120}
            data={dataArr}
            itemTextStyle={[styles.itemTextStyle, disabled && {color: 'rgba(255,255,255,0.5)'}]}
            labelTextStyle={disabled && {color: 'rgba(255,255,255,0.5)'}}
            selectionOverlayLabel={overlayLabel}
            selectionOverlayStyle={[overlayStyle, disabled && {backgroundColor: 'rgba(255,255,255,0.03)'}]}
        />
    );
};

const styles = StyleSheet.create({
    itemTextStyle: {
        color: 'white',
        textAlign: 'right',
        position: 'absolute',
        right: 70
    }
})
export default memo(TimerTimePicker);
