import React, { useEffect, useState, useContext } from "react";

import { Text, Image, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import * as Animatable from 'react-native-animatable';
import { CLOSE } from '../../assets/icons';
import Context from '../AppContext.js'

import retrieveUser from "../logic/users/retrieveUser";
import { validateEmail, validatePassword, validateName } from "../../com/validators.js";
import { updateUserEmail } from "../logic/users/updateUserEmail";
import { updateUserName } from "../logic/users/updateUserName";
import { updateUserPassword } from "../logic/users/updateUserPassword";
// import { updateUserEmail, updateUserName, updateUserPassword } from "../../logic/";


export default function UserSettings({ closeHandle, handleMarkerPressedHandler }) {
    const { colorScheme, TOKEN } = useContext(Context)
    const [user, setUser] = useState()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [currentPassword, setCurrentPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [repeatPassword, setRepeatPassword] = useState()

    let isDark
    if (colorScheme === 'dark') isDark = true

    useEffect(() => {
        retrieveUser(TOKEN)
            .then(user => {
                setUser(user)
            })
    }, [])

    useEffect(() => {
    }, [name, email, currentPassword, newPassword, repeatPassword, user]);
    const handleSaveUser = () => {
        try {
            if (name) {
                validateName(name)
                updateUserName(TOKEN, name)
                    .then(() => {
                        Alert.alert('Success', `${'Your name was updated!'}`, [
                            { text: 'OK', onPress: () => { } },
                        ])
                        retrieveUser(TOKEN)
                            .then(user => {
                                setUser(user)
                            })
                        setName()
                    })
            }
            if (email) {
                validateEmail(email)
                updateUserEmail(TOKEN, email)
                    .then(() => {
                        Alert.alert('Check your email', `${'Verify your new email'}`, [
                            { text: 'OK', onPress: () => { } },
                        ])
                        retrieveUser(TOKEN)
                            .then(user => {
                                setUser(user)
                            })
                        setEmail()
                    })
                    .catch(error =>
                        Alert.alert('Error', `${error.message}`, [
                            { text: 'OK', onPress: () => { } },
                        ])
                    )
            }
        } catch (error) {
            Alert.alert('Error', `${error.message}`, [
                { text: 'OK', onPress: () => { } },
            ]);
        }
    }
    const handleSavePassword = () => {
        try {
            validatePassword(currentPassword)
            validatePassword(newPassword)
            validatePassword(repeatPassword)
            if (currentPassword === newPassword) throw new Error('New password must be different as previous password')
            if (newPassword !== repeatPassword) throw new Error('New password and new password confirmation does not match')

            updateUserPassword(TOKEN, currentPassword, newPassword, repeatPassword)
                .then(() => {
                    Alert.alert('Success', `${'Your password was updated!'}`, [
                        { text: 'OK', onPress: () => { } },
                    ])
                    retrieveUser(TOKEN)
                        .then(user => {
                            setUser(user)
                        })
                    setCurrentPassword()
                    setNewPassword()
                    setRepeatPassword()
                })
                .catch(error =>
                    Alert.alert('Error', `${error.message}`, [
                        { text: 'OK', onPress: () => { } },
                    ])
                )
        } catch (error) {
            Alert.alert('Error', `${error.message}`, [
                { text: 'OK', onPress: () => { } },
            ]);
        }
    }

    return <>
        {user &&
            <View className="w-full p-5  pt-1 bg-red-s400" >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="">
                        <Text className="dark:text-zinc-200 font-bold text-2xl mt-2">My account</Text>
                    </View>
                    <View className="" >
                        <Text className="dark:text-zinc-200 mt-2 text-lg  font-semibold">Edit profile</Text>
                        <Text className="dark:text-zinc-200 mt-2 text-xs">Your name</Text>
                        <TextInput
                            label="Name"
                            returnKeyType="next"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="none"
                            autoCompleteType="email"
                            placeholder={user.name}
                            placeholderTextColor={`${isDark ? '#a1a1aa' : ''}`}
                            className="dark:text-zinc-200 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full mt-1 mb-0 px-3 py-2 self-start w-full"
                            inputMode="text"
                            keyboardType="default"
                        />
                        <Text className="dark:text-zinc-200 pt-4 text-xs ">Your email</Text>
                        <TextInput
                            label="Email"
                            returnKeyType="next"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCompleteType="email"
                            placeholder={user.email}
                            placeholderTextColor={`${isDark ? '#a1a1aa' : ''}`}
                            className="dark:text-zinc-200 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full mt-1 mb-0 px-3 py-2 self-start w-full "
                            inputMode="text"
                            keyboardType="email-address"
                        />

                        <TouchableOpacity
                            activeOpacity={0.8}
                            className="border border-mainLime bg-mainLime rounded-full mb-1 mt-4 self-start w-auto  "
                            onPress={() => {
                                handleSaveUser()
                            }} >
                            <View className="font-bold   px-6 py-1.5 self-start rounded-full" >
                                <Text className="font-bold  text-lg   self-start rounded-full">Update</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View className="" >
                        <Text className="dark:text-zinc-200 mt-5 text-lg font-semibold">Edit password</Text>
                        <Text className="dark:text-zinc-200 mt-2 text-xs ">Your current password</Text>
                        <TextInput
                            label="Password"
                            returnKeyType="done"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                            placeholder="Password"
                            placeholderTextColor={`${isDark ? '#a1a1aa' : ''}`}
                            className="dark:text-zinc-200 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full my-1 px-3 py-2 self-start w-full"
                            inputMode="text"
                            keyboardType="default"
                        />
                        <Text className="dark:text-zinc-200 mt-2 text-xs ">Your password</Text>
                        <TextInput
                            label="Password"
                            returnKeyType="done"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            placeholder="Password"
                            placeholderTextColor={`${isDark ? '#a1a1aa' : ''}`}
                            className="dark:text-zinc-200 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full my-1 px-3 py-2 self-start w-full"
                            inputMode="text"
                            keyboardType="default"
                        />
                        <Text className="dark:text-zinc-200 pt-3 text-xs">Repeat password</Text>
                        <TextInput
                            label="Repeat password"
                            returnKeyType="done"
                            value={repeatPassword}
                            onChangeText={setRepeatPassword}
                            secureTextEntry
                            placeholder="Repeat password"
                            placeholderTextColor={`${isDark ? '#a1a1aa' : ''}`}
                            className="dark:text-zinc-200 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full my-1 px-3 py-2 self-start w-full"
                            inputMode="text"
                            keyboardType="default"
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            className="border border-mainLime bg-mainLime rounded-full mb-1 mt-4 self-start w-auto  "
                            onPress={() => {
                                handleSavePassword()
                            }} >
                            <View className="font-bold   px-6 py-1.5 rounded-full" >
                                <Text className="font-bold  text-lg   self-start rounded-full">Update</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        }







    </>
}