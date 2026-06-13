import React, {

useState

} from 'react';

import {

View,

StyleSheet,

ImageBackground

} from 'react-native';

import Icon from './Icon';

import Calculator from '../apps/Calculator';

import Notes from '../apps/Notes';

import Gallery from '../apps/Gallery';

import Sudoku from '../apps/Sudoku';

import Chess from '../apps/Chess';

import Taskbar from './Taskbar';

export default function Desktop({

darkMode,

setDarkMode

}) {

const [app,setApp] = useState(null);

const [wallpaper, setWallpaper] = useState(require('../assets/fundoW11.jpg'));

return(

<ImageBackground

source={wallpaper}

style={styles.wallpaper}

imageStyle={styles.wallpaperImage}
>

<View style={[styles.container, darkMode ? styles.containerDark : styles.containerLight]}>

<View style={styles.wallpaperGlow1} />

<View style={styles.wallpaperGlow2} />

<View style={styles.desktopLayer}>

<Icon

icon="🧮"

name="Calculadora"

onPress={() => setApp('calc')}

darkMode={darkMode}

/>

<Icon

icon="📝"

name="Notas"

onPress={() => setApp('notes')}

darkMode={darkMode}

/>

<Icon

icon="🖼️"

name="Galeria"

onPress={() => setApp('gallery')}

darkMode={darkMode}

/>

<Icon

icon="🧩"

name="Sudoku"

onPress={() => setApp('sudoku')}

darkMode={darkMode}

/>

<Icon

icon="♟"

name="Xadrez"

onPress={() => setApp('chess')}

darkMode={darkMode}

/>

{

app === 'calc'

&&

<Calculator

onClose={() => setApp(null)}

darkMode={darkMode}

/>

}

{

app === 'notes'

&&

<Notes

onClose={() => setApp(null)}

darkMode={darkMode}

/>

}

{

app === 'gallery'

&&

<Gallery

onClose={() => setApp(null)}

darkMode={darkMode}

onSelectWallpaper={setWallpaper}

/>

}

{

app === 'sudoku'

&&

<Sudoku

onClose={() => setApp(null)}

darkMode={darkMode}

/>

}

{

app === 'chess'

&&

<Chess

onClose={() => setApp(null)}

darkMode={darkMode}

/>

}

<Taskbar

darkMode={darkMode}

setDarkMode={setDarkMode}

/>

</View>

</View>

</ImageBackground>

);

}

const styles = StyleSheet.create({

wallpaper:{

flex:1,

width:'100%',

height:'100%',

justifyContent:'flex-start'

},

wallpaperImage:{

resizeMode:'cover',

width:'100%',

height:'100%',

position:'absolute'

},

container:{

flex:1,

paddingTop:50,

overflow:'hidden',

backgroundColor:'transparent'

},

containerLight:{

backgroundColor:'transparent'

},

containerDark:{

backgroundColor:'transparent'

},

wallpaperGlow1:{

position:'absolute',

top:-20,

right:-30,

width:140,

height:140,

borderRadius:70,

backgroundColor:'rgba(148, 163, 184, 0.10)'

},

wallpaperGlow2:{

position:'absolute',

bottom:70,

left:-40,

width:180,

height:180,

borderRadius:90,

backgroundColor:'rgba(148, 163, 184, 0.08)'

},

desktopLayer:{

flex:1,

flexDirection:'row',

flexWrap:'wrap',

alignItems:'flex-start',

justifyContent:'flex-start',

paddingTop:10,

paddingBottom:90,

paddingHorizontal:12

}

});