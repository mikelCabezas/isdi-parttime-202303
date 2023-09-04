import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState, useContext } from 'react'
import Home from '../screens/Home'
import Login from '../screens/Login'
import UserValidationSuccess from '../screens/UserValidationSuccess'
import Register from '../screens/Register'
import ForgotPassword from '../screens/ForgotPassword'
import SetNewPassword from '../screens/SetNewPassword'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from "../AppContext.js";
const { Provider } = AppContext
import Context from '../AppContext.js'

const Stack = createNativeStackNavigator()
export default function MainStack() {
    const { TOKEN, setTOKEN, isLoggedIn, setIsLoggedIn } = useContext(Context)

    useEffect(() => {
        if (TOKEN) {
            setTOKEN(TOKEN)
            setIsLoggedIn(true)
        }
        (async () => {
            return AsyncStorage.getItem('@TOKEN')
                .then(token => {
                    if (token) {
                        setTOKEN(token)
                        setIsLoggedIn(true)
                    }
                })
        })();

    }, [])

    return (<>
        {isLoggedIn && <>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName="Home">

                <Stack.Screen
                    name='Home'
                    component={Home}
                />
                {!isLoggedIn && <Stack.Screen
                    name='Login'
                    component={Login}
                />}
            </Stack.Navigator>
        </>
        }
        {!isLoggedIn && <>

            <Stack.Navigator
                screenOptions={{ headerShown: false, }}
                initialRouteName="Login"
            >
                <Stack.Screen
                    name='Login'
                    component={Login}
                />
                <Stack.Screen
                    name='UserValidationSuccess'
                    component={UserValidationSuccess}
                />
                <Stack.Screen
                    name='Register'
                    component={Register}
                />
                <Stack.Screen
                    name='ForgotPassword'
                    component={ForgotPassword}
                />
                <Stack.Screen
                    name='SetNewPassword'
                    component={SetNewPassword}
                />

                {isLoggedIn && <Stack.Screen
                    name='Home'
                    component={Home}
                />}
            </Stack.Navigator>
        </>}
    </>
    )
}
