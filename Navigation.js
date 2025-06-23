import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import MainScreen from './screens/MainScreen';

const Stack = createStackNavigator();

const StackScreen = () => {
	return (
		<Stack.Navigator
			initialRouteName='메인 화면'
		// screenOptions={{ headerShown: false }}
		>
			<Stack.Screen
				name='메인 화면'
				component={MainScreen}
			/>
		</Stack.Navigator>
	);
}

const Navigation = () => {
	return (
		<NavigationContainer>
			<StackScreen />
		</NavigationContainer>
	);
}

export default Navigation;