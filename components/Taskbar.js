import React, { useEffect, useMemo, useState } from 'react';

import {

View,
Text,
TouchableOpacity,
StyleSheet

} from 'react-native';

function buildCalendarDays(date) {

  const year = date.getFullYear();

  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let i = 0; i < firstDay; i += 1) {

    days.push(null);

  }

  for (let day = 1; day <= daysInMonth; day += 1) {

    days.push(day);

  }

  while (days.length % 7 !== 0) {

    days.push(null);

  }

  return days;

}

function isSameDay(a, b) {

  return a.getFullYear() === b.getFullYear()

    && a.getMonth() === b.getMonth()

    && a.getDate() === b.getDate();

}

export default function Taskbar({

darkMode,
setDarkMode

}) {

const [now, setNow] = useState(new Date());

const [selectedMonth, setSelectedMonth] = useState(new Date());

const [showCalendar, setShowCalendar] = useState(false);

useEffect(() => {

  const timer = setInterval(() => setNow(new Date()), 1000);

  return () => clearInterval(timer);

}, []);

const timeLabel = useMemo(

  () => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(now),

  [now]

);

const dateLabel = useMemo(

  () => new Intl.DateTimeFormat('pt-BR', {

    weekday: 'short',

    day: '2-digit',

    month: 'short'

  }).format(now).replace('.', ''),

  [now]

);

const monthLabel = useMemo(

  () => new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(selectedMonth),

  [selectedMonth]

);

const calendarDays = useMemo(() => buildCalendarDays(selectedMonth), [selectedMonth]);

const goToMonth = (offset) => {

  setSelectedMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));

};

const resetToToday = () => {

  const today = new Date();

  setSelectedMonth(new Date(today.getFullYear(), today.getMonth(), 1));

  setNow(today);

};

return (

<View style={[styles.container, darkMode ? styles.containerDark : styles.containerLight]}>

<View style={styles.left}>

<TouchableOpacity style={[styles.start, darkMode ? styles.startDark : styles.startLight]}>

<Text style={[styles.startText, darkMode ? styles.textDark : styles.textLight]}>⊞</Text>

</TouchableOpacity>

<View style={[styles.search, darkMode ? styles.searchDark : styles.searchLight]}>

<Text style={[styles.searchText, darkMode ? styles.textDark : styles.textLight]}>Pesquisar</Text>

</View>

</View>

<View style={styles.right}>

<TouchableOpacity

  style={[styles.button, darkMode ? styles.buttonDark : styles.buttonLight]}

  onPress={() => setDarkMode(!darkMode)}

>

<Text style={styles.icon}>{darkMode ? '☀️' : '🌙'}</Text>

</TouchableOpacity>

<TouchableOpacity

  onPress={() => setShowCalendar((prev) => !prev)}

  style={[styles.clockBox, darkMode ? styles.clockDark : styles.clockLight]}

>

<Text style={[styles.timeText, darkMode ? styles.textDark : styles.textLight]}>{timeLabel}</Text>

<Text style={[styles.dateText, darkMode ? styles.textMutedDark : styles.textMutedLight]}>{dateLabel}</Text>

</TouchableOpacity>

</View>

{showCalendar && (

<View style={[styles.calendarPanel, darkMode ? styles.calendarDark : styles.calendarLight]}>

<View style={styles.calendarHeader}>

<TouchableOpacity

  style={[styles.navButton, darkMode ? styles.navButtonDark : styles.navButtonLight]}

  onPress={() => goToMonth(-1)}

>

<Text style={[styles.navButtonText, darkMode ? styles.textDark : styles.textLight]}>‹</Text>

</TouchableOpacity>

<TouchableOpacity style={styles.titleBox} onPress={resetToToday}>

<Text style={[styles.calendarTitle, darkMode ? styles.textDark : styles.textLight]}>{monthLabel}</Text>

</TouchableOpacity>

<TouchableOpacity

  style={[styles.navButton, darkMode ? styles.navButtonDark : styles.navButtonLight]}

  onPress={() => goToMonth(1)}

>

<Text style={[styles.navButtonText, darkMode ? styles.textDark : styles.textLight]}>›</Text>

</TouchableOpacity>

</View>

<View style={styles.weekRow}>

{['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((label, index) => (

<Text key={`${label}-${index}`} style={[styles.weekLabel, darkMode ? styles.textMutedDark : styles.textMutedLight]}>{label}</Text>

))}

</View>

<View style={styles.daysGrid}>

{calendarDays.map((day, index) => {

  const isToday = day

    ? isSameDay(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day), now)

    : false;

  return (

    <View

      key={`${day ?? 'empty'}-${index}`}

      style={[styles.dayCell, !day && styles.dayEmpty, isToday && styles.dayToday]}

    >

      {day ? (

        <Text style={[styles.dayText, darkMode ? styles.textDark : styles.textLight, isToday && styles.dayTextToday]}>

          {day}

        </Text>

      ) : null}

    </View>

  );

})}

</View>

</View>

)}

</View>

);

}

const styles = StyleSheet.create({

container: {

position: 'absolute',

bottom: 10,

left: 10,

right: 10,

height: 60,

borderRadius: 18,

flexDirection: 'row',

justifyContent: 'space-between',

alignItems: 'center',

paddingHorizontal: 10,

borderWidth: 1,

borderColor: 'rgba(255,255,255,0.12)'

},

containerLight: {

backgroundColor: 'rgba(255,255,255,0.92)'

},

containerDark: {

backgroundColor: 'rgba(9, 15, 25, 0.94)'

},

left: {

flexDirection: 'row',

alignItems: 'center',

gap: 8

},

right: {

flexDirection: 'row',

alignItems: 'center',

gap: 8

},

start: {

width: 36,

height: 36,

borderRadius: 10,

justifyContent: 'center',

alignItems: 'center'

},

startLight: {

backgroundColor: 'rgba(37, 99, 235, 0.10)'

},

startDark: {

backgroundColor: 'rgba(255,255,255,0.10)'

},

startText: {

fontSize: 18,

fontWeight: '700'

},

search: {

minWidth: 140,

paddingHorizontal: 12,

paddingVertical: 8,

borderRadius: 999

},

searchLight: {

backgroundColor: 'rgba(15, 23, 42, 0.06)'

},

searchDark: {

backgroundColor: 'rgba(255,255,255,0.08)'

},

searchText: {

fontSize: 12

},

button: {

padding: 8,

borderRadius: 10

},

buttonLight: {

backgroundColor: 'rgba(15, 23, 42, 0.08)'

},

buttonDark: {

backgroundColor: 'rgba(255,255,255,0.12)'

},

clockBox: {

paddingHorizontal: 10,

paddingVertical: 6,

borderRadius: 12,

minWidth: 90,

alignItems: 'flex-end'

},

clockLight: {

backgroundColor: 'rgba(15, 23, 42, 0.06)'

},

clockDark: {

backgroundColor: 'rgba(255,255,255,0.08)'

},

timeText: {

fontSize: 12,

fontWeight: '700'

},

dateText: {

fontSize: 10,

textTransform: 'capitalize'

},

calendarPanel: {

position: 'absolute',

right: 6,

bottom: 70,

width: 280,

padding: 12,

borderRadius: 18,

borderWidth: 1,

borderColor: 'rgba(255,255,255,0.10)'

},

calendarLight: {

backgroundColor: 'rgba(255,255,255,0.97)'

},

calendarDark: {

backgroundColor: 'rgba(17, 24, 39, 0.98)'

},

calendarHeader: {

flexDirection: 'row',

alignItems: 'center',

justifyContent: 'space-between',

marginBottom: 8,

gap: 6

},

navButton: {

width: 28,

height: 28,

borderRadius: 8,

justifyContent: 'center',

alignItems: 'center'

},

navButtonLight: {

backgroundColor: 'rgba(15, 23, 42, 0.06)'

},

navButtonDark: {

backgroundColor: 'rgba(255, 255, 255, 0.08)'

},

navButtonText: {

fontSize: 18,

fontWeight: '700'

},

calendarTitle: {

fontSize: 12,

fontWeight: '700',

textTransform: 'capitalize',

textAlign: 'center'

},

titleBox: {

flex: 1,

alignItems: 'center'

},

weekRow: {

flexDirection: 'row',

justifyContent: 'space-between',

marginBottom: 6

},

weekLabel: {

fontSize: 10,

width: 32,

textAlign: 'center'

},

textMutedLight: {

color: '#4b5563'

},

textMutedDark: {

color: '#cbd5e1'

},

textLight: {

color: '#111827'

},

textDark: {

color: '#fff'

},

daysGrid: {

flexDirection: 'row',

flexWrap: 'wrap',

justifyContent: 'space-between'

},

dayCell: {

width: 32,

height: 32,

justifyContent: 'center',

alignItems: 'center',

borderRadius: 8,

marginBottom: 4

},

dayToday: {

backgroundColor: 'rgba(56, 189, 248, 0.18)'

},

dayEmpty: {

backgroundColor: 'transparent'

},

dayText: {

fontSize: 11

},

dayTextToday: {

fontWeight: '700',

color: '#38bdf8'

},

icon: {

fontSize: 18

}

});