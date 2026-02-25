import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { PortalHost } from "@gorhom/portal";
import MainScreen from "./screens/MainScreen";
import DietLogScreen from "./screens/DietLogScreen";
import LoginScreen from "./screens/login/LoginScreen";
import SignUpScreen from "./screens/login/SignUpScreen";
import LandingScreen from "./screens/login/LandingScreen";
import WelcomeScreen from "./screens/login/WelcomeScreen";
import AccountInfoScreen from "./screens/settings/AccountInfoScreen";
import ChangePasswordScreen from "./screens/settings/ChangePasswordScreen";
import { handleLoginSession } from "./services/auth";
import { useAuthStore } from "./stores/authStore";
import { useEffect, useState } from "react";
import LikedScreen from "./screens/LikedScreen";

const Stack = createStackNavigator();

const Navigation = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  const isFullyAuthorized = isLoggedIn && user && user?.isAgreed;

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
        {isFullyAuthorized ? (
          <>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="DietLog" component={DietLogScreen} />
            <Stack.Screen name="Liked" component={LikedScreen} />
            <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
            />
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
