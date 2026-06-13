import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default function Window({ title, children, onClose, darkMode, windowStyle, contentStyle }) {

  return (

    <View style={[styles.window, darkMode ? styles.windowDark : styles.windowLight, windowStyle]}>

      <View style={[styles.header, darkMode ? styles.headerDark : styles.headerLight]}>

        <View style={styles.headerLeft}>

          <View style={styles.dot} />

          <Text style={[styles.title, darkMode ? styles.titleDark : styles.titleLight]}>
            {title}
          </Text>

        </View>

        <View style={styles.windowControls}>

          <View style={[styles.control, styles.controlRed]} />

          <View style={[styles.control, styles.controlYellow]} />

          <View style={[styles.control, styles.controlGreen]} />

          <TouchableOpacity onPress={onClose} style={[styles.closeButton, darkMode ? styles.closeButtonDark : styles.closeButtonLight]}>

            <Text style={[styles.close, darkMode ? styles.closeDark : styles.closeLight]}>×</Text>

          </TouchableOpacity>

        </View>

      </View>

      <View style={[styles.content, darkMode ? styles.contentDark : styles.contentLight, contentStyle]}>

        {children}

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  window: {

    position: 'absolute',

    top: 80,

    left: 18,

    right: 18,

    bottom: 76,

    borderRadius: 18,

    overflow: 'hidden',

    elevation: 12,

    shadowColor: '#000',

    shadowOpacity: 0.18,

    shadowRadius: 14,

    shadowOffset: { width: 0, height: 8 }

  },

  windowLight: {

    backgroundColor: '#ffffff'

  },

  windowDark: {

    backgroundColor: '#111827'

  },

  header: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    paddingHorizontal: 12,

    paddingVertical: 10,

    borderBottomWidth: 1

  },

  headerLight: {

    backgroundColor: '#f3f4f6',

    borderBottomColor: '#e5e7eb'

  },

  headerDark: {

    backgroundColor: '#1f2937',

    borderBottomColor: '#374151'

  },

  headerLeft: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 8

  },

  dot: {

    width: 10,

    height: 10,

    borderRadius: 5,

    backgroundColor: '#60a5fa'

  },

  title: {

    fontWeight: '600',

    fontSize: 14

  },

  titleLight: {

    color: '#111827'

  },

  titleDark: {

    color: '#f3f4f6'

  },

  windowControls: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 6

  },

  control: {

    width: 10,

    height: 10,

    borderRadius: 5

  },

  controlRed: {

    backgroundColor: '#ef4444'

  },

  controlYellow: {

    backgroundColor: '#fbbf24'

  },

  controlGreen: {

    backgroundColor: '#22c55e'

  },

  closeButton: {

    width: 28,

    height: 28,

    borderRadius: 14,

    justifyContent: 'center',

    alignItems: 'center'

  },

  closeButtonLight: {

    backgroundColor: '#fee2e2'

  },

  closeButtonDark: {

    backgroundColor: '#374151'

  },

  close: {

    fontWeight: '700',

    fontSize: 18,

    lineHeight: 18

  },

  closeLight: {

    color: '#b91c1c'

  },

  closeDark: {

    color: '#fca5a5'

  },

  content: {

    flex: 1

  },

  contentLight: {

    backgroundColor: '#fff'

  },

  contentDark: {

    backgroundColor: '#111827'

  }

});