import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { apiKey } from './Keys';
import MapView, { Marker } from 'react-native-maps';

export default function Map({ route }) {
  const { address } = route.params;
  const initialRegion = {
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  }
  const initialCoordinates = {
    latitude: 60.201373,
    longitude: 24.934041
  }

  const [region, setRegion] = useState(initialRegion);
  const [markerPosition, setMarkerPosition] = useState(initialCoordinates);
  const [title, setTitle] = useState('Haaga-Helia');

  useEffect(() => {
    (async () => {
      const response = await fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=${apiKey}&location=${address}`);
      const data = await response.json();
      const { lat, lng } = data.results[0].locations[0].latLng;
      setRegion({ ...region, latitude: lat, longitude: lng });
      setMarkerPosition({ latitude: lat, longitude: lng });
      setTitle(address);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MapView
        style={styles.map}
        region={region}>
        <Marker
          coordinate={markerPosition}
          title={title} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '90%',
    flex: 1
  }
});