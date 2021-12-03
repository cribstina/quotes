import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, FlatList, Text, View, Image, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

/* ----- meu código ----- */
const { width, height } = Dimensions.get('screen');
import api from './config/api';

const fetchImagesFromPexels = async () => {
  const data = await fetch(api.API_URL, {
    headers: {
      'Authorization': api.API_KEY
    }
  })

  const { photos } = await data.json();

  return photos;
}


export default function App() {
  const [images, setImages] = React.useState(null);
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  React.useEffect(() => {
      const fetchImages = async () => {
        const images = await fetchImagesFromPexels();

        setImages(images);
      }

      fetchImages();

  }, [])

 

  if (!images) {
    return null;
  } else {
    console.log(images)
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
        <FlatList
          data={images}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {
          
            return <View style={{width, height}}>
              <Image
                source={{uri: item.src.portrait}}
                style={[StyleSheet.absoluteFillObject]} 
                />
              </View>
            }}
        />
          
      </SafeAreaProvider>
    );
  }
}
