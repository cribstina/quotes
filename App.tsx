import React from 'react';
import { Dimensions, FlatList, Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import api from "./config/api";

/* ----- meu código ----- */
const img_size = 80;
const spacing = 5;
const { width, height } = Dimensions.get('screen');


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

  }, []);

  const topRef = React.useRef();
  const thumbRef = React.useRef();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const scrollToActiveIndex = (index: any) => {
    setActiveIndex(index)
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true
    })

    //if the middle the thumbnail of the selected image is greater than the middle of the screen, the thumbnail should scroll to the middle

    if (index * (img_size + spacing) - img_size/2 > width/2) {
        thumbRef?.current?.scrollToOffset({
          offset: index * (img_size + spacing) - width/2 + img_size/2,
          animated: true
        })
        
      } else {
        thumbRef?.current?.scrollToOffset({
          offset: 0,
          animated: true,
        });
      }
  }

  if (!images) {
    return null;
  } else {

    
    console.log(images)
    return (
      <SafeAreaProvider>
        
        <FlatList
          ref={topRef}
          data={images}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(ev) => {
            setActiveIndex(ev.nativeEvent.contentOffset.x / width);
          }}
          renderItem={({ item }) => {
            return (
              <View style={{ width, height }}>
                <Image
                  source={{ uri: item.src.portrait }}
                  style={[StyleSheet.absoluteFillObject]}
                />
              </View>
            );
          }}
        />

        <FlatList
          ref={thumbRef}
          data={images}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ position: "absolute", bottom: 20 }}
          contentContainerStyle={{ paddingHorizontal: spacing }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
                <Image
                  source={{ uri: item.src.portrait }}
                  style={{
                    width: img_size,
                    height: img_size,
                    borderRadius: 12,
                    borderWidth: 2,
                    marginRight: spacing,
                    borderColor: activeIndex === index ? "#fff" : "#000",
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaProvider>
    );
  }
}
