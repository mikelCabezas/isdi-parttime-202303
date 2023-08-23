import React, { useEffect, useState, useContext } from "react";
import { Text, View, Image, SafeAreaView, ScrollView, TouchableHighlight } from 'react-native';
import { MENU, MY_LOCATION, CLOSE, LIKES, ISSUES, ACCOUNT, LOGOUT, SHARE, FEEDBACK, FUTURE_VERSIONS } from '../../../assets/icons';
import { NativeWindStyleSheet } from "nativewind";
import Context from '../../AppContext.js'
import * as Animatable from 'react-native-animatable';

import AsyncStorage from '@react-native-async-storage/async-storage';

NativeWindStyleSheet.setOutput({
    default: "native",
});

export default function Sidebar({ navigation, closeHandle, user, likedHandler, userSettingsHandler }) {
    const { currentView, setCurrentView, isLoggedIn, setIsLoggedIn } = useContext(Context)
    const [animation, setAnimation] = useState()

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
        // setAnimation('fadeInRight')
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

    const handleGoToMyIssues = () => {
        alert('TODO Go To My Issues')
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
        alert('TODO Go To Future versions')
    }

    const handleGoToSendFeedback = () => {
        alert('TODO Go To SendFeedback')
    }
    return <>
        <Animatable.View animation={animation} duration={250} className="absolute w-2/3 h-full flex top-0 left-0 bg-white z-50" >
            <View className="w-12/12 rounded-full left-0 flex flex-col pr-2 pl-4 pt-11 pb-8 h-full">
                <View className="w-12/12 flex-row py-3">
                    <TouchableHighlight
                        className=" m-auto absolute right-0 top-0 mr-0 mt-0 z-10"
                        activeOpacity={1.0}
                        underlayColor="#fff"
                        onPress={() => {
                            setAnimation('fadeInRight')
                            onClose()
                            setCurrentView('home')
                        }}>
                        <Image
                            className={`w-8 h-8 m-auto `}
                            source={CLOSE}
                        />
                    </TouchableHighlight>
                </View>

                <View className="w-12/12 flex-row pb-3 pt-2">
                    <Text className="px-1 flex-1 text-lg font-semibold" >
                        Hi {user.name}!
                    </Text>
                </View>

                <TouchableHighlight
                    activeOpacity={1.0}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToMyAccount()
                        onClose()
                        setCurrentView('home')
                    }}>
                    <View className="w-12/12 flex-row py-2">
                        <Image
                            className="w-8 h-8"
                            source={ACCOUNT}
                        />
                        <Text className="px-4 flex-1 self-center" >
                            My account
                        </Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    activeOpacity={1.0}
                    underlayColor="#fff"
                    onPress={onLiked}>
                    <View className="w-12/12 flex-row py-2">
                        <Image
                            className="w-8 h-8"
                            source={LIKES}
                        />
                        <Text className="px-4 flex-1 self-center" >
                            My favorites
                        </Text>
                    </View>
                </TouchableHighlight>

                {/* <TouchableHighlight
                    activeOpacity={1.0}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToMyIssues()
                        onClose()
                        setCurrentView('home')
                    }}>
                    <View className="w-12/12 flex-row pt-2 pb-4">
                        <Image
                            className="w-8 h-8"
                            source={ISSUES}
                        />
                        <Text className="px-4 flex-1 self-center" >
                            My issues
                        </Text>
                    </View>
                </TouchableHighlight> */}

                <TouchableHighlight
                    activeOpacity={1.0}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToLogout()
                        onClose()
                        setCurrentView('home')
                    }}>
                    <View className="w-12/12 flex-row border-t-[1px] border-t-mainGray pt-4 pb-2">
                        <Image
                            className="w-8 h-8"
                            source={LOGOUT}
                        />
                        <Text className="px-4 flex-1 self-center" >
                            Logout
                        </Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    activeOpacity={1.0}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToShareApp()
                        onClose()
                        setCurrentView('home')
                    }}>
                    <View className="w-12/12 flex-row py-2">
                        <Image
                            className="w-8 h-8"
                            source={SHARE}
                        />
                        <Text className="px-4 flex-1 self-center" >
                            Share app with friends
                        </Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    className="mt-auto"
                    activeOpacity={1.0}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToFutureVersions()
                        onClose()
                        setCurrentView('home')
                    }}>
                    <View className="w-12/12 flex-row py-2 ">
                        <Image
                            className="w-8 h-8"
                            source={FUTURE_VERSIONS}
                        />
                        <Text className="px-4 flex-1 self-center" >
                            Future versions
                        </Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    activeOpacity={1.0}
                    underlayColor="#fff"
                    onPress={() => {
                        setAnimation('fadeInRight')
                        handleGoToSendFeedback()
                        onClose()
                        setCurrentView('home')
                    }}>

                    <View className="w-12/12 flex-row py-2  ">
                        <Image
                            className="w-8 h-8"
                            source={FEEDBACK}
                        />
                        <Text className="px-4 flex-1 self-center" >
                            Send feedback
                        </Text>
                    </View>
                </TouchableHighlight>

                <View className="w-12/12 flex-row py-2  ">
                    <Text className="mt-2 pl-1 flex-1 self-center text-black60" >
                        Version 1.0
                    </Text>
                </View>
            </View>
        </Animatable.View >
        <View className="bg-black60 w-full h-full flex-1 absolute left-0 top-0 z-40"></View>
    </>
}
