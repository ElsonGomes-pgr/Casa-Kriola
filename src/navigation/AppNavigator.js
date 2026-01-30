import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/Splash';
import LoginScreen from '../screens/Login';
import HomeScreen from '../screens/Home';
import RegisterScreen from '../screens/register';
import ProfileChoiceScreen from '../screens/ProfileChoiceScreen';
import HomeSeekerScreen from '../screens/seeker/HomeSeekerScreen';
import HomeOwnerScreen from '../screens/owner/HomeOwnerScreen';
import AddPropertyScreen from '../screens/owner/AddPropertyScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeSeeker" component={HomeSeekerScreen} />
        <Stack.Screen name="HomeOwner" component={HomeOwnerScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="ProfileChoice" component={ProfileChoiceScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AddProperty" component={AddPropertyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
