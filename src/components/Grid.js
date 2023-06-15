import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

const Grid = ({renderItem, data}) => {

  return (
    <FlatList
      scrollEnabled={false}
      data={data}
      numColumns={2}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      marginHorizontal={-5}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 5,
  }
});

export default Grid;
