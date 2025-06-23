import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import MainScreen from './screens/MainScreen';
import DietLogScreen from './screens/DietLogScreen';

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
			<Stack.Screen
				name='식단 기록 화면'
				component={DietLogScreen}
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