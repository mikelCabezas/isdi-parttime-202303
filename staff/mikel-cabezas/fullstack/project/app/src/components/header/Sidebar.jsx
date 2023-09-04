import React, { useEffect, useState, useContext } from "react";
import { Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import {
    CLOSE, LIKES, WHATS_NEW, ACCOUNT, LOGOUT, SHARE, FEEDBACK, FUTURE_VERSIONS,
    WHITE_CLOSE, WHITE_LIKES, WHITE_WHATS_NEW, WHITE_ACCOUNT, WHITE_LOGOUT, WHITE_SHARE, WHITE_FEEDBACK, WHITE_FUTURE_VERSIONS
} from '../../../assets/icons';
import { NativeWindStyleSheet } from "nativewind";
import Context from '../../AppContext.js'
import * as Animatable from 'react-native-animatable';

import AsyncStorage from '@react-native-async-storage/async-storage';

NativeWindStyleSheet.setOutput({
    default: "native",
});

export default function Sidebar({ navigation, closeHandle, user, likedHandler, whatsNewHandler, futureVersionsHandler, userSettingsHandler, setModal }) {
    const { currentView, setCurrentView, colorScheme, setIsLoggedIn } = useContext(Context)
    const [animation, setAnimation] = useState()
    let isDark
    if (colorScheme === 'dark') isDark = true
    const onClose = () => {
        setAnimation('fadeOutLeft')
        closeHandle()
    }

    useEffect(() => {
        setAnimation('fadeInLeft')
        setTimeout(() => {
            setAnimation()
        }, 300)

    }, [])

    useEffect(() => {
    }, [animation])

    const handleGoToMyAccount = () => {
        setAnimation('fadeOutLeft')
        setCurrentView('home')
        userSettingsHandler()
    }

    const onLiked = () => {
        setAnimation('fadeOutLeft')
        setCurrentView('home')
        likedHandler()
    }

    const handleGoToLogout = async () => {
        setIsLoggedIn(false)
        setTimeout(() => {
            // navigation.navigate('Login')
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
            AsyncStorage.clear();
        }, 100);
    }

    const handleGoToShareApp = () => {
        alert('TODO Go To ShareApp')
    }

    const handleGoToFutureVersions = () => {
        setAnimation('fadeOutLeft')
        futureVersionsHandler()
    }
    const handleGoToWhatsNew = () => {
        setAnimation('fadeOutLeft')
        whatsNewHandler()
    }

    const handleGoToSendFeedback = () => {
        alert('TODO Go To SendFeedback')
    }
    return <>
        <Animatable.View animation={animation} duration={250} className="absolute w-2/3 h-full flex top-0 left-0 bg-white dark:bg-zinc-800 z-50" >
            <View className="w-12/12 rounded-full left-0 flex flex-col pr-2 pl-4 pt-11 pb-8 h-full">
                <View className="w-12/12 flex-row py-3">
                    <TouchableOpacity
                        className=" m-auto absolute right-0 top-0 mr-0 mt-0 z-10"
                        activeOpacity={0.8}
                        underlayColor="#fff"
                        onPress={() => {
                            setAnimation('fadeInRight')
                            onClose()
                            setCurrentView('home')
                        }}>
                        <Image
                            className={`w-8 h-8 dark:opacity-80 m-auto `}
                            source={isDark ? WHITE_CLOSE : CLOSE}
                        />
                    </TouchableOpacity>
                </View>

                <View className="w-12/12 flex-row pb-3 pt-2">
                    <Text className="dark:text-zinc-200 px-1 flex-1 text-lg font-semibold" >
                        Hi {user.name}!
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToMyAccount()
                        onClose()
                        setCurrentView('home')
                    }}>
                    <View className="w-12/12 flex-row py-2">
                        <Image
                            className="w-8 h-8 dark:opacity-80"
                            source={isDark ? WHITE_ACCOUNT : ACCOUNT}
                        />
                        <Text className="dark:text-zinc-200 px-4 flex-1 self-center" >
                            My account
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    underlayColor="#fff"
                    onPress={onLiked}>
                    <View className="w-12/12 flex-row py-2">
                        <Image
                            className="w-8 h-8 dark:opacity-80"
                            source={isDark ? WHITE_LIKES : LIKES}
                        />
                        <Text className="dark:text-zinc-200 px-4 flex-1 self-center" >
                            My favorites
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    activeOpacity={0.8}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToMyIssues()
                        onClose()
                        setCurrentView('home')
                    }}>
                    <View className="w-12/12 flex-row pt-2 pb-4">
                        <Image
                            className="w-8 h-8 dark:opacity-80"
                            source={ISSUES}
                        />
                        <Text className="px-4 flex-1 self-center" >
                            My issues
                        </Text>
                    </View>
                </TouchableOpacity> */}

                <TouchableOpacity
                    activeOpacity={0.8}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToLogout()
                        onClose()
                        setCurrentView('home')
                    }}>
                    <View className="w-12/12 flex-row border-t-[1px] border-t-mainGray dark:border-t-zinc-700 pt-4 pb-2">
                        <Image
                            className="w-8 h-8 dark:opacity-80"
                            source={isDark ? WHITE_LOGOUT : LOGOUT}
                        />
                        <Text className="dark:text-zinc-200 px-4 flex-1 self-center" >
                            Logout
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToShareApp()
                        onClose()
                        setCurrentView('home')
                    }}>
                    <View className="w-12/12 flex-row py-2">
                        <Image
                            className="w-8 h-8 dark:opacity-80"
                            source={isDark ? WHITE_SHARE : SHARE}
                        />
                        <Text className="dark:text-zinc-200 px-4 flex-1 self-center" >
                            Share app with friends
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    className="mt-auto"
                    activeOpacity={0.8}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToWhatsNew()
                        onClose()
                    }}>
                    <View className="w-12/12 flex-row py-2 ">
                        <Image
                            className="w-8 h-8 dark:opacity-80"
                            source={isDark ? WHITE_WHATS_NEW : WHATS_NEW}
                        />
                        <Text className="dark:text-zinc-200 px-4 flex-1 self-center" >
                            Whats new
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToFutureVersions()
                        onClose()
                        setCurrentView('home')
                    }}>
                    <View className="w-12/12 flex-row py-2 ">
                        <Image
                            className="w-8 h-8 dark:opacity-80"
                            source={isDark ? WHITE_FUTURE_VERSIONS : FUTURE_VERSIONS}
                        />
                        <Text className="dark:text-zinc-200 px-4 flex-1 self-center" >
                            Future versions
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToSendFeedback()
                        onClose()
                        setCurrentView('home')
                    }}>

                    <View className="w-12/12 flex-row py-2  ">
                        <Image
                            className="w-8 h-8 dark:opacity-80"
                            source={isDark ? WHITE_FEEDBACK : FEEDBACK}
                        />
                        <Text className="dark:text-zinc-200 px-4 flex-1 self-center" >
                            Send feedback
                        </Text>
                    </View>
                </TouchableOpacity>

                <View className="w-12/12 flex-row py-2  ">
                    <Text className="mt-2 pl-1 flex-1 self-center text-black60 dark:text-zinc-400 " >
                        Version 1.0
                    </Text>
                </View>
            </View>
        </Animatable.View >
        <View className="bg-black60 w-full h-full flex-1 absolute left-0 top-0 z-40"></View>
    </>
}
