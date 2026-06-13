import React, {

useState

} from 'react';

import {

View,
Text,
TouchableOpacity,
StyleSheet

} from 'react-native';

import Window from '../components/Window';

export default function Calculator({

onClose

}) {

const [input, setInput] = useState('');

function press(value){

if(value === '='){

try{

setInput(eval(input).toString());

}

catch{

setInput('Erro');

}

}

else if(value === 'C'){

setInput('');

}

else{

setInput(input + value);

}

}

const buttons = [

['C', '(', ')', '/'],

['7', '8', '9', '*'],

['4', '5', '6', '-'],

['1', '2', '3', '+'],

['0', '.', '=']

];

return (

<Window

title="Calculadora"

onClose={onClose}

>

<Text style={styles.display}>

{input || '0'}

</Text>

<View style={styles.grid}>

{buttons.map((row, rowIndex) => (

<View key={`row-${rowIndex}`} style={styles.row}>

{row.map(btn => {

const isOperator = ['+', '-', '*', '/', '='].includes(btn);

const isClear = btn === 'C';

const isZero = btn === '0';

return (

<TouchableOpacity

key={btn}

style={[

styles.btn,

isOperator && styles.operator,

isClear && styles.clear,

isZero && styles.wide,

]}

onPress={() => press(btn)}

>

<Text style={[

styles.txt,

isOperator && styles.operatorTxt,

isClear && styles.clearTxt,

]}>

{btn}

</Text>

</TouchableOpacity>

);

})}

</View>

))}

</View>

</Window>

);

}

const styles = StyleSheet.create({

display:{

fontSize:32,

paddingHorizontal:14,

paddingVertical:16,

textAlign:'right',

backgroundColor:'#f3f4f6',

borderRadius:14,

minHeight:60,

color:'#111827'

},

grid:{

width:'100%',

marginTop:8

},

row:{

flexDirection:'row',

justifyContent:'space-between',

marginBottom:8

},

btn:{

flex:1,

minWidth:58,

height:58,

backgroundColor:'#f3f4f6',

justifyContent:'center',

alignItems:'center',

marginHorizontal:4,

borderRadius:14

},

wide:{

flex:2.2

},

operator:{

backgroundColor:'#2563eb'

},

clear:{

backgroundColor:'#fecaca'

},

operatorTxt:{

color:'#fff'

},

clearTxt:{

color:'#7f1d1d'

},

txt:{

fontSize:22,

color:'#111827'

}

});