import React, { useMemo, useRef, useState } from 'react';

import {

Image,
ScrollView,
StyleSheet,
Text,
TouchableOpacity,
View

} from 'react-native';

import Window from '../components/Window';

const galleryOptions = [

{

  id: 'default',

  label: 'Fundo Windows 11',

  source: require('../assets/fundoW11.jpg')

},

{

  id: 'cleiton-1',

  label: 'Cleiton 1',

  source: require('../assets/Cleiton1.jpeg')

},

{

  id: 'cleiton-2',

  label: 'Cleiton 2',

  source: require('../assets/Cleiton2.jpeg')

},

{

  id: 'cleiton-3',

  label: 'Cleiton 3',

  source: require('../assets/Cleiton 3.jpeg')

},

{

  id: 'cleiton-4',

  label: 'Cleiton 4',

  source: require('../assets/Cleiton4.jpeg')

}

];

export default function Gallery({

onClose,

onSelectWallpaper

}) {

const fileInputRef = useRef(null);

const [activeLabel, setActiveLabel] = useState('Fundo Windows 11');

const openFilePicker = () => {

  if (typeof document === 'undefined') return;

  const input = document.createElement('input');

  input.type = 'file';

  input.accept = 'image/*';

  input.onchange = (event) => {

    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      const dataUri = reader.result;

      onSelectWallpaper({ uri: dataUri });

      setActiveLabel(file.name);

    };

    reader.readAsDataURL(file);

  };

  input.click();

};

const selectedPreview = useMemo(() => {

  return galleryOptions.find((option) => option.label === activeLabel) ?? galleryOptions[0];

}, [activeLabel]);

return (

<Window

title="Galeria"

onClose={onClose}

windowStyle={styles.galleryWindow}

contentStyle={styles.galleryContent}

>

<View style={styles.panel}>

<Text style={styles.title}>Escolha um papel de parede</Text>

<Text style={styles.subtitle}>Você pode usar uma imagem da galeria ou carregar sua própria foto.</Text>

<TouchableOpacity style={styles.button} onPress={openFilePicker}>

<Text style={styles.buttonText}>Escolher imagem do dispositivo</Text>

</TouchableOpacity>

<ScrollView style={styles.list}>

<View style={styles.grid}>

{galleryOptions.map((item) => (

<TouchableOpacity

key={item.id}

style={styles.card}

onPress={() => {

  onSelectWallpaper(item.source);

  setActiveLabel(item.label);

}}

>

<Image source={item.source} style={styles.img} resizeMode="contain" />

<Text style={styles.cardLabel}>{item.label}</Text>

</TouchableOpacity>

))}

</View>

</ScrollView>

</View>

</Window>

);

}

const styles = StyleSheet.create({

panel: {

flex: 1,

paddingBottom: 8

},

title: {

fontSize: 16,

fontWeight: '700',

marginBottom: 4

},

subtitle: {

fontSize: 12,

color: '#6b7280',

marginBottom: 10

},

button: {

backgroundColor: '#2563eb',

paddingVertical: 10,

paddingHorizontal: 12,

borderRadius: 10,

marginBottom: 12

},

buttonText: {

color: '#fff',

fontWeight: '700',

textAlign: 'center'

},

previewBox: {

backgroundColor: 'rgba(148, 163, 184, 0.12)',

borderRadius: 14,

padding: 6,

marginBottom: 8,

maxHeight: 90

},

previewImage: {

width: '100%',

height: 70,

borderRadius: 10,

marginBottom: 4,

backgroundColor: 'rgba(255,255,255,0.04)'

},

previewLabel: {

fontSize: 12,

color: '#111827'

},

list: {

flex: 1,

maxHeight: '100%'

},

grid: {

flexDirection: 'row',

flexWrap: 'wrap',

justifyContent: 'space-between'

},

card: {

width: '48%',

marginBottom: 10,

backgroundColor: 'rgba(255,255,255,0.06)',

borderRadius: 14,

padding: 8,

borderWidth: 1,

borderColor: 'rgba(255,255,255,0.08)'

},

img: {

width: '100%',

height: 150,

borderRadius: 10,

marginBottom: 6,

backgroundColor: 'rgba(255,255,255,0.04)'

},

cardLabel: {

fontSize: 12,

fontWeight: '600'

},

galleryWindow: {

top: 6,

left: 6,

right: 6,

bottom: 6,

borderRadius: 18

},

galleryContent: {

paddingHorizontal: 10,

paddingVertical: 10

}

});