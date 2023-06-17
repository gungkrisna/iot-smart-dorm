import { memo, useMemo } from 'react';
import React from 'react';
import { StyleSheet } from 'react-native';
import WheelPicker from '@gungkrisna/react-native-ios-time-picker';

const ScheduleTimePicker = ({ start, end, onValueChanging, overlayStyle, initialValue }) => {
  const dataArr = useMemo(() => {
    const length = end - start + 1;
    return Array.from({ length }, (_, index) => ({
      value: index + start,
      label: String(index + start),
    }));
  }, [start, end]);

  const value = useMemo(() => {
    if (initialValue !== undefined) {
      return initialValue;
    }
    return start + 2;
  }, [start, initialValue]);

  return (
    <WheelPicker
      onValueChanging={({ item }) => {
        onValueChanging(item.value);
      }}
      value={value}
      width={120}
      data={dataArr}
      itemTextStyle={styles.itemTextStyle}
      selectionOverlayStyle={overlayStyle}
    />
  );
};

const styles = StyleSheet.create({
  itemTextStyle: {
    color: 'white',
  },
});

export default memo(ScheduleTimePicker);
