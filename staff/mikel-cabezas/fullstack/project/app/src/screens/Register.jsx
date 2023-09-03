import React, { useEffect, useState, useContext } from "react";

import { View, Text, TextInput, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Context from '../AppContext.js'
import * as Linking from 'expo-linking';
import registerUser from '../logic/users/registerUser.js'

import { validateEmail, validatePassword, validateName } from "../../com/validators.js";


import BG from '../../assets/bg-login.png'
import LOGO_SM from '../../assets/logo-sm.png'
import LOGO from '../../assets/logo.png'
export default function Login({ navigation }) {
    const { colorScheme } = useContext(Context)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [repeatPassword, setRepeatPassword] = useState()
    const [url, setUrl] = useState()
    const [passwordToken, setPasswordToken] = useState()
    let isDark
    if (colorScheme === 'dark') isDark = true

    useEffect(() => {

        Linking.getInitialURL().then((url) => {
            setUrl(url)
            const index = url.indexOf("=");
            const token = url.slice(index + 1)
            setPasswordToken(token)
        });

        // Linking.parse().then((url) => {
        //     console.log(`url`, url);
        // });
    }, []);
    const handleRegister = () => {
        try {
            validateName(name)
            validateEmail(email)
            validatePassword(password)
            registerUser(name, email, password)
                .then(token => {
                    Alert.alert('Success', `New user registered! \n Check your email for to activate your account.`, [
                        { text: 'OK', onPress: () => { } },
                    ]);
                    navigation.navigate('Login')
                })
                .catch(error => {
                    Alert.alert('Error', `${error.message}`, [
                        { text: 'OK', onPress: () => { } },
                    ]);
                })
        } catch (error) {
            Alert.alert('Error', `${error.message}`, [
                { text: 'OK', onPress: () => { } },
            ]);
        }


    }
    const handleForgetPassword = () => {
        alert('TODO Forget Password')
    }
    const handleGoToLogin = () => {
        navigation.navigate('Login')
    }

    return <>
        <ScrollView bounces={false} >

            <View className="flex-1 items-center justify-center w-full h-screen">
                <Image className="w-full h-screen top-0 absolute" source={BG} />

                <View className="flex-1 items-center justify-center w-full">
                    <View className="bg-white dark:bg-zinc-800 h-auto px-6 py-7 w-3/4 rounded-3xl">
                        {/* <Text className="dark:text-zinc-200 text-2xl text-center font-semibold">{url}</Text> */}
                        <Text className="dark:text-zinc-200 text-2xl text-center font-semibold">Register</Text>
                        <Text className="dark:text-zinc-200 pt-4 text-xs text-center">Your name</Text>
                        <TextInput
                            label="Name"
                            returnKeyType="next"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="none"
                            autoCompleteType="email"
                            placeholder="Name"
                            placeholderTextColor={`${isDark ? '#a1a1aa' : ''}`}
                            className="dark:text-zinc-200 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full mt-1 mb-0 px-2 py-2 self-center w-full text-center"
                            inputMode="text"
                            keyboardType="default"
                        />
                        <Text className="dark:text-zinc-200 pt-4 text-xs text-center">Your email</Text>
                        <TextInput
                            label="Email"
                            returnKeyType="next"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCompleteType="email"
                            placeholder="Email"
                            placeholderTextColor={`${isDark ? '#a1a1aa' : ''}`}
                            className="dark:text-zinc-200 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full mt-1 mb-0 px-2 py-2 self-center w-full text-center"
                            inputMode="text"
                            keyboardType="email-address"
                        />
                        <Text className="dark:text-zinc-200 pt-3 text-xs text-center">Your Password</Text>
                        <TextInput
                            label="Password"
                            returnKeyType="done"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholder="Password"
                            placeholderTextColor={`${isDark ? '#a1a1aa' : ''}`}
                            className="dark:text-zinc-200 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full my-1 px-2 py-2 self-center w-full text-center"
                            inputMode="text"
                            keyboardType="default"
                        />
                        <Text className="dark:text-zinc-200 pt-3 text-xs text-center">Repeat password</Text>
                        <TextInput
                            label="Repeat password"
                            returnKeyType="done"
                            value={repeatPassword}
                            onChangeText={setRepeatPassword}
                            secureTextEntry
                            placeholder="Repeat password"
                            placeholderTextColor={`${isDark ? '#a1a1aa' : ''}`}
                            className="dark:text-zinc-200 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full my-1 px-2 py-2 self-center w-full text-center"
                            inputMode="text"
                            keyboardType="default"
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            className="border border-mainLime bg-mainLime rounded-full mb-1 mt-4 self-center w-auto  text-center"
                            onPress={handleRegister}
                        >
                            <View
                                className="font-bold text-center  px-6 py-2 self-center rounded-full"
                            >
                                <Text className="font-bold text-center text-lg   self-center rounded-full">Create account</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="mb-2 self-center w-full text-center"
                            activeOpacity={1}
                            onPress={handleGoToLogin}
                        >
                            <Text
                                className="dark:text-zinc-200 mt-3 text-xs text-center" >
                                Already registered?
                                <Text className="font-bold">Login</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    </>
}