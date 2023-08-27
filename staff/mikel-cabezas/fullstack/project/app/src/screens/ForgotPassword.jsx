import React, { useEffect, useState, useContext } from "react";

import { View, Text, TextInput, Image, TouchableOpacity, Aler, ScrollView } from 'react-native';
import Context from '../AppContext.js'
import * as Linking from 'expo-linking';
import forgotPassword from '../logic/users/forgotPassword.js'

import BG from '../../assets/bg-login.png'
import LOGO_SM from '../../assets/logo-sm.png'
import LOGO from '../../assets/logo.png'
export default function Login({ navigation }) {
    const { currentView, setCurrentView, colorScheme } = useContext(Context)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [repeatPassword, setRepeatPassword] = useState()
    const [url, setUrl] = useState()
    const [passwordToken, setPasswordToken] = useState()


    useEffect(() => {
        Linking.getInitialURL().then((url) => {
            setUrl(url)
            const index = url.indexOf("=");
            const token = url.slice(index + 1)
            setPasswordToken(token)
        });
    }, []);
    const handleRegister = () => {
        forgotPassword(email)
            .then(token => {
                Alert.alert('Success', `Email sent!`, [
                    { text: 'OK', onPress: () => { } },
                ]);
                navigation.navigate('Login')
            })
            .catch(error => {
                Alert.alert('Error', `${error.message}`, [
                    { text: 'OK', onPress: () => { } },
                ]);
            })
    }

    const handleGoToLogin = () => {
        navigation.navigate('Login')
    }

    return <>
        <ScrollView bounces={false}>
            <View className="flex-1 items-center justify-center w-full h-screen">
                <Image className="w-full h-screen top-0 absolute" source={BG} />

                <View className="flex-1 items-center justify-center w-full">
                    <View className="bg-white dark:bg-zinc-800 h-auto px-6 py-7 w-3/4 rounded-3xl">
                        {/* <Text className="dark:text-zinc-100 text-2xl text-center font-semibold">{url}</Text> */}
                        <Text className="dark:text-zinc-100 text-2xl text-center font-semibold">Forgot password</Text>

                        <Text className="dark:text-zinc-100 pt-4 text-xs text-center">Your email</Text>
                        <TextInput
                            label="Email"
                            returnKeyType="next"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCompleteType="email"
                            placeholder="Email"
                            className="dark:text-zinc-100 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full mt-1 mb-0 px-2 py-2 self-center w-full text-center"
                            inputMode="text"
                            keyboardType="email-address"
                        />

                        <TouchableOpacity
                            activeOpacity={0.8}
                            className="border border-mainLime bg-mainLime rounded-full mb-1 mt-4 self-center w-auto  text-center"
                            onPress={handleRegister}
                        >
                            <View
                                className="font-bold text-center  px-6 py-2 self-center rounded-full"
                            >
                                <Text className="font-bold text-center text-lg   self-center rounded-full">Get link</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="mb-2 self-center w-full text-center"
                            activeOpacity={1}
                            onPress={handleGoToLogin}
                        >
                            <Text
                                className="dark:text-zinc-100 mt-3 text-xs text-center" >
                                Already registered?
                                <Text className="font-bold">Login</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    </>
}