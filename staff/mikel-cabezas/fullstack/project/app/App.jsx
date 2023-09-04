import React, { useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, SafeAreaView, useColorScheme, View } from "react-native";
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import * as Location from 'expo-location';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import serverStatus from "./src/logic/helpers/serverStatus.js";
import Loader from "./src/library/Loader.jsx";
import BG from './assets/bg-login.png'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import MainStack from "./src/navigation/MainStack.jsx";

import AppContext from "./src/AppContext.js";
const { Provider } = AppContext

const prefix = Linking.createURL('/');

const HideKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default function App({ }) {
  const [TOKEN, setTOKEN] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState()

  const [modal, setModal] = useState()
  const [currentView, setCurrentView] = useState()
  const [animation, setAnimation] = useState()

  const [loader, setLoader] = useState(false)
  const [loaderTitle, setloaderTitle] = useState(null);
  const [loaderMessage, setloaderMessage] = useState(null);
  const freeze = () => setLoader(true)
  const unfreeze = () => {
    setTimeout(() => {
      setLoader(false)
    }, 800);
  }


  const [origin, setOrigin] = useState({})
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [serverStatusResponse, setServerStatusResponse] = useState(null);
  const [loadCurrentLocation, setLoadCurrentLocation] = useState(false)
  const [currentMarker, setCurrentMarker] = useState({})
  const [colorPalette, setColorPalette] = useState()
  let colorScheme = useColorScheme();

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        UserValidationSuccess: {
          path: "UserValidationSuccess",
        },
        Login: {
          path: 'Login/:message',
          parse: {
            message: (message) => `${message}`
          }
        },
        Register: {
          path: 'Register/:token',
          parse: {
            token: (token) => `${token}`
          }
        },
        SetNewPassword: {
          path: 'SetNewPassword/:token',
          parse: {
            token: (token) => `${token}`
          }
        }
      },
    }
  };

  useEffect(() => {
    try {
      freeze()
      if (colorScheme === 'dark') {
        setColorPalette({ mainDark: 'rgb(31 41 55)' })
      }
      checkServer()
        .then(unfreeze())
        .catch(error => {
          setloaderTitle('Error')
          setloaderMessage(error.message)
          checkServer()
        })
    } catch (error) {
      alert(error.message)
    }
  }, [])
  const checkServer = async () => {
    return serverStatus()
      .then(res => {
        if (res === 200) {
          setServerStatusResponse(true)
          unfreeze()
          return res
        }
        if (res !== 200) {
          setServerStatusResponse(false)
          throw new Error('Connection error')
        }

      })
  };

  useEffect(() => {
    (async () => {
      Location.enableNetworkProviderAsync()
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return;
      }
      await Location.getCurrentPositionAsync({ enableHighAccuracy: true, timeout: 1000 }).then(res => {
        // console.log('res.coords in App.jsx', res.coords)
        setLocation(res.coords);
        setLoadCurrentLocation(true)
      })
    })()
  }, [])

  return (<>
    <HideKeyboard>
      <Provider value={{
        currentView, setCurrentView, currentMarker, setCurrentMarker, modal, setModal, colorScheme, animation, setloaderTitle, setloaderMessage, freeze, unfreeze,
        setAnimation, TOKEN, setTOKEN, origin, setOrigin, location, setLocation, loadCurrentLocation, setLoadCurrentLocation, isLoggedIn, setIsLoggedIn
      }}>

        {<GestureHandlerRootView style={{ flex: 1 }}>
          <ActionSheetProvider>
            <NavigationContainer linking={linking} >
              <MainStack />
            </NavigationContainer>
          </ActionSheetProvider></GestureHandlerRootView>}
      </Provider>
    </HideKeyboard>
    {loader && <>
      <View className="absolute top-0 left-0 w-full h-screen z-50">
        <Loader text="Conecting..." details={loaderMessage} background={BG} />
      </View>
    </>}
  </>
  )
}

