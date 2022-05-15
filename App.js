import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import Places from './Places';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="My Places" component={Places} />
        <Stack.Screen name="Map" component={Map} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};
