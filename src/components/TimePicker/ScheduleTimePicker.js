import { memo, useEffect, useState, useMemo } from 'react';
import React from 'react';
import { StyleSheet } from 'react-native';
import WheelPicker from '@gungkrisna/react-native-ios-time-picker';

const ScheduleTimePicker = ({ start, end, onValueChanging, overlayStyle }) => {
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
      value={2}
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
