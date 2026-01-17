import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { PortalHost } from "@gorhom/portal";
import MainScreen from "./screens/MainScreen";
import DietLogScreen from "./screens/DietLogScreen";
import LoginScreen from "./screens/login/LoginScreen";
import SignUpScreen from "./screens/login/SignUpScreen";
import LandingScreen from "./screens/login/LandingScreen";
import WelcomeScreen from "./screens/login/WelcomeScreen";
import { handleLoginSession } from "./services/auth";
import useAuthStore from "./stores/authStore";
import { useEffect, useState } from "react";

const Stack = createStackNavigator();

const Navigation = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initNavigation = async () => {
      try {
        await handleLoginSession();
      } catch (error) {
        console.log("Error during login session restoration:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initNavigation();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="DietLog" component={DietLogScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
          </>
        )}
      </Stack.Navigator>
      <PortalHost name="modal" />
    </NavigationContainer>
  );
};

export default Navigation;
