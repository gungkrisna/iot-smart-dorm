import React from 'react';
import { View, Text, Pressable } from 'react-native';

const ListItem = ({
  iconComponent,
  text,
  subtitle,
  onPress,
  actionComponent
}) => (
  <Pressable
    style={({ pressed }) => [
      styles.listItem,
      onPress && { opacity: pressed ? 0.5 : 1.0 }
    ]}
    onPress={onPress}>
    <View style={styles.listItemLeading}>
      {iconComponent && (
        <View style={styles.listItemIcon}>
          {iconComponent}
        </View>
      )}
      <View>
        <Text style={styles.listItemText}>{text}</Text>
        {subtitle && <Text style={styles.listItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {actionComponent}
  </Pressable>
);

const styles = {
  listItem: {
    backgroundColor: 'rgb(245, 245, 245)',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgb(217, 217, 217)',
  },
  listItemLeading: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  listItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgb(217, 217, 217)',
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6
  },
  listItemSubtitle: {
    fontSize: 12,
    color: 'rgb(165, 165, 165)',
  },
};

export default ListItem;
