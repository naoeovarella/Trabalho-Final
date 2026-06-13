import React, {

useState

} from 'react';

import {

SafeAreaView,

StyleSheet

} from 'react-native';

import Desktop from './components/Desktop';

export default function App(){

const [darkMode,setDarkMode] = useState(true);

return(

<SafeAreaView

style={[

styles.container,

darkMode

? styles.containerDark

: styles.containerLight

]}

>

<Desktop

darkMode={darkMode}

setDarkMode={setDarkMode}

/>

</SafeAreaView>

);

}

const styles = StyleSheet.create({

container:{

flex:1

},

containerLight:{

backgroundColor: '#dbeafe'

},

containerDark:{

backgroundColor: '#060b16'

}

});