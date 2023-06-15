import { memo, useMemo } from 'react';
import React from 'react';
import { StyleSheet } from 'react-native';
import Picker from '@quidone/react-native-wheel-picker';

const CustomTimePicker = ({ start, end, onValueChange, overlayStyle }) => {
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
      value={start + 2}
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

export default memo(CustomTimePicker);
