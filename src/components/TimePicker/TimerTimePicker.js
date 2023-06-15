import { memo, useMemo } from 'react';
import React from 'react';
import { StyleSheet } from 'react-native';
import Picker from '@quidone/react-native-wheel-picker';

const TimerTimePicker = ({disabled, start, end, onValueChange, overlayLabel, overlayStyle }) => {
    const dataArr = useMemo(() => {
        const length = end - start + 1;
        return Array.from({ length }, (_, index) => ({
          value: index + start,
          label: String(index + start),
        }));
      }, [start, end]);

    return (
        <Picker
            onValueChanging={({ item }) => {
                onValueChange(item.value);
            }}
            value={0}
            width={120}
            data={dataArr}
            itemTextStyle={[style.itemTextStyle, disabled && {color: 'rgba(255,255,255,0.5)'}]}
            labelTextStyle={disabled && {color: 'rgba(255,255,255,0.5)'}}
            selectionOverlayLabel={overlayLabel}
            selectionOverlayStyle={[overlayStyle, disabled && {backgroundColor: 'rgba(255,255,255,0.03)'}]}
        />
    );
};

const style = StyleSheet.create({
    itemTextStyle: {
        color: 'white',
        textAlign: 'right',
        position: 'absolute',
        right: 70
    }
})
export default memo(TimerTimePicker);
