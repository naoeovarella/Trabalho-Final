import React from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';

export default function Icon({ icon, name, onPress, darkMode }) {

  return (

    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >

      <Text style={styles.icon}>

        {icon}

      </Text>

      <Text style={[styles.name, darkMode && styles.nameDark]}>

        {name}

      </Text>

    </TouchableOpacity>

  );

}

const styles = StyleSheet.create({

  container: {

    width: 72,

    alignItems: 'center',
    margin: 12

  },

  icon: {

    fontSize: 50

  },

  name: {

    color: '#1f2937',
    marginTop: 5,
    textAlign: 'center',
    fontSize: 11

  },

  nameDark: {

    color: '#f3f4f6'

  }

});