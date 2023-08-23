import React, { useEffect, useState, useContext } from "react";

import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import Context from '../AppContext.js'
import MapView, { Marker, Callout } from 'react-native-maps'

import authenticateUser from "../logic/users/authenticateUser.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

import BG from '../../assets/bg-login.png'
import LOGO_SM from '../../assets/logo-sm.png'
import LOGO from '../../assets/logo.png'

import { validateEmail, validatePassword } from "../../com/validators.js";
import { ScrollView } from "react-native-gesture-handler";


export default function Login({ navigation }) {
    const { currentView, setCurrentView, colorScheme, TOKEN, setTOKEN, isLoggedIn, setIsLoggedIn } = useContext(Context)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [message, setMessage] = useState()

    useEffect(() => {
        // Linking.getInitialURL().then((messageURL) => {
        //     const index = messageURL.indexOf("=");
        //     console.log(messageURL)
        //     if (index !== -1) {
        //         const messageSplitted = messageURL.slice(index + 1).split('-')
        //         setMessage(messageSplitted.join(' '))
        //         console.log(message)

        //     }
        // });
    }, []);
    useEffect(() => {
        if (message) {
            Alert.alert('Success', `${message}`, [
                { text: 'OK', onPress: () => { } },
            ]);
            setMessage()
        }
    }, [message]);

    const handleLogin = () => {
        try {
            validateEmail(email)
            validatePassword(password)
            authenticateUser(email.toLowerCase().trim(), password.toLowerCase().trim())
                .then(async () => {
                    return AsyncStorage.getItem('@TOKEN')
                        .then(token => {
                            if (token) {
                                setTOKEN(token)
                                setIsLoggedIn(true)
                            }
                        })
                        .then(() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            })
                        })
                })
                .catch(error => alert(error.message))
        } catch (error) {
            Alert.alert('Error', `${error.message}`, [
                { text: 'OK', onPress: () => { } },
            ]);
        }
    }
    const handleForgetPassword = () => {
        navigation.navigate('ForgotPassword')
    }
    const handleGoToRegister = () => {
        navigation.navigate('Register')
    }

    return <>

        <ScrollView bounces={false}>
            <View className="flex-1 items-center justify-center w-full" onPress={() => { Keyboard.dismiss(); }} >
                <Image className="w-full h-screen top-0 absolute" source={BG} />
                <View className="w-full h-screen flex-1 justify-center items-center">
                    {/* <Image className="wz-8/12 max-w-[220px] mb-4 h-[119px]" source={LOGO} /> */}
                    <Image className="wz-8/12 max-w-[240px] mb-4 h-[51px]" source={LOGO_SM} />
                    <View className="bg-white dark:bg-gray-800 h-auto px-6 py-7 w-3/4 max-w-[300px] rounded-3xl">
                        {/* <Text className="dark:text-white text-2xl text-center font-semibold">{process.env.EXPO_PUBLIC_API_URL}</Text> */}

                        {/* <Text className="dark:text-white pt-4 text-xs text-center">{process.env.EXPO_PUBLIC_API_URL}</Text> */}
                        <Text className="dark:text-white text-2xl text-center font-semibold">Login</Text>
                        <Text className="dark:text-white pt-4 text-xs text-center">Your email</Text>
                        <TextInput
                            label="Email"
                            returnKeyType="next"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCompleteType="email"
                            placeholder="Email"
                            className="dark:text-white border border-mainGray bg-mainGray dark:border-gray-700 dark:bg-gray-700 rounded-full mt-1 mb-0 px-2 py-2 self-center w-full text-center"
                            inputMode="text"
                            keyboardType="email-address"
                        />
                        <Text className="dark:text-white pt-3 text-xs text-center">Your Password</Text>
                        <TextInput
                            label="Password"
                            returnKeyType="done"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholder="Password"
                            className="dark:text-white border border-mainGray bg-mainGray dark:border-gray-700 dark:bg-gray-700 rounded-full my-1 px-2 py-2 self-center w-full text-center"
                            inputMode="text"
                            keyboardType="default"
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            className="border border-mainLime bg-mainLime rounded-full mb-1 mt-4 self-center w-auto  text-center"
                            onPress={() => {
                                handleLogin()
                            }}
                        >
                            <View
                                className="font-bold text-center  px-6 py-2 self-center rounded-full"
                            >
                                <Text className="font-bold text-center text-lg   self-center rounded-full">Login</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="mt-1 self-center w-full text-center"
                            activeOpacity={0.8}
                            onPress={() => {
                                handleForgetPassword()
                            }}
                        >
                            <Text className=" text-mainRed dark:text-mainYellow pt-4 text-xs text-center">Forgot your password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="mb-2 self-center w-full text-center"
                            activeOpacity={1}
                            underlayColor="#ffffff"
                            onPress={() => {
                                handleGoToRegister()
                            }}
                        >
                            <Text
                                className="dark:text-white mt-3 text-xs text-center">
                                Not registered?
                                <Text className="font-bold">Register</Text></Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </ScrollView>

    </>
}