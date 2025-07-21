import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import MainScreen from './screens/MainScreen';
import DietLogScreen from './screens/DietLogScreen';
import LoginScreen from './screens/login/LoginScreen';
import SignUpScreen from './screens/login/SignUpScreen';
import EmailVerifyScreen from './screens/login/EmailVerifyScreen';
import LandingScreen from './screens/login/LandingScreen';

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
			<Stack.Screen
				name="Landing"
				component={LandingScreen}
				options={{ title: '랜딩' }}
			/>
			<Stack.Screen
				name="Login"
				component={LoginScreen}
				options={{ title: '로그인' }}
			/>
			<Stack.Screen
				name="SignUp"
				component={SignUpScreen} 
				options={{ title: '회원가입' }} 
			/>
			<Stack.Screen
				name="EmailVerify"
				component={EmailVerifyScreen}
				options={{ title: '회원가입' }}
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