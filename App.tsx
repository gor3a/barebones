import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Appbar, Provider} from "react-native-paper";
import {PetsListScreen} from "@/screens/PetsList.screen";
import {SingleProfileScreen} from "@/screens/SingleProfile.screen";
import {ActivityIndicator} from "react-native";
import {useAuth} from "@/hooks/useAuth";
import {AuthScreen} from "@/screens/auth/Auth.screen";
import Toast from "react-native-toast-message";
import {StyleSheet} from "react-native";
import {supabase} from "@/services/supabase";

export type RootStackParamList = {
  PetsList: undefined;
  SingleProfile: { id: string };
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const {user, initializing} = useAuth();
  if (initializing) {
    return <ActivityIndicator style={{flex: 1}}/>;
  }
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="PetsList">
          {user ? (
            <>
              <Stack.Screen
                name="PetsList"
                component={PetsListScreen}
                options={{
                  header: (props) => (
                    <Appbar.Header style={styles.appHeader}>
                      {props.navigation.canGoBack() && <Appbar.BackAction onPress={() => props.navigation.goBack()}/>}
                      <Appbar.Content title="Pet Profile"/>
                      <Appbar.Action icon="logout" onPress={() => supabase.auth.signOut()}/>
                    </Appbar.Header>
                  )
                }}

              />
              <Stack.Screen
                name="SingleProfile"
                component={SingleProfileScreen}
                options={{title: 'Pet Profile'}}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{headerShown: false}}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast/>
    </Provider>

  );
}

const styles = StyleSheet.create({
  appHeader: {
    backgroundColor: 'white',
    shadowColor: 'transparent',
    elevation: 1,
  }
})
