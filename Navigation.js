import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const StackScreen = () => {
	return (
		<Stack.Navigator
			initialRouteName='MainScreen'
			screenOptions={{ headerShown: false }}
		>

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