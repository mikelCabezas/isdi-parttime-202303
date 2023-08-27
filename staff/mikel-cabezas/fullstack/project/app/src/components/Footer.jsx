import React, { useEffect, useState, useContext } from "react";

import {
    HOME, NEARBY, LIKES, MORE_OPTIONS, ADD,
    WHITE_HOME, WHITE_NEARBY, WHITE_LIKES, WHITE_MORE_OPTIONS, WHITE_ADD
} from '../../assets/icons';
import { View, Image, TouchableHighlight, Alert } from 'react-native';
import Context from '../AppContext.js'


export default function Footer({ nearbyHandler, likedHandler, createPlaygroundHandler, homeHandler }) {
    const { currentView, setCurrentView, colorScheme } = useContext(Context)

    let isDark
    if (colorScheme === 'dark') isDark = true

    const onHome = () => {
        homeHandler()
    }
    const onNearby = () => {
        nearbyHandler()
    }
    const onLiked = () => {
        likedHandler()
        setCurrentView('liked')
    }

    const onCreatePlayground = () => {
        createPlaygroundHandler()
    }

    useEffect(() => {
        console.log('footer status changed')
    }, [currentView])

    return <View className="absolute w-full justify-center flex bottom-8 content-center">
        <View className="w-11/12 h-12 p-1 bg-white dark:bg-zinc-800 rounded-full left-0 m-auto flex flex-row justify-between px-10">
            <TouchableHighlight
                className={`p-[2px]${currentView === 'home' && 'bg-[#B8F138] rounded-[10px]'}`}
                activeOpacity={1.0}
                underlayColor="#fff"
                onPress={() => {
                    onHome()
                    setCurrentView('home')
                }}>
                <Image
                    className={`w-8 h-8 m-auto ${isDark ? 'opacity-80' : ''}`}
                    source={isDark ? WHITE_HOME : HOME}
                />
            </TouchableHighlight>

            <TouchableHighlight
                className={`p-[2px] ${currentView === 'nearby' && 'bg-[#B8F138] rounded-[10px]'}`}
                activeOpacity={1.0}
                underlayColor="#fff"
                onPress={() => {
                    onNearby()
                    setCurrentView('nearby')
                }}>
                <Image
                    className={`w-8 h-8 m-auto ${isDark ? 'opacity-80' : ''}`}
                    source={isDark ? WHITE_NEARBY : NEARBY}
                />
            </TouchableHighlight>

            <TouchableHighlight
                className={`p-[2px] ${currentView === 'liked' && 'bg-[#B8F138] rounded-[10px]'}`}
                activeOpacity={1.0}
                underlayColor="#fff"
                onPress={onLiked}>
                <Image
                    className={`w-8 h-8 m-auto ${isDark ? 'opacity-80' : ''}`}
                    source={isDark ? WHITE_LIKES : LIKES}
                />
            </TouchableHighlight>

            {/* <TouchableHighlight
                className={`p-[2px] ${currentView === 'search' && 'bg-[#B8F138] rounded-[10px] p-[2px] '}`}
                activeOpacity={1.0}
                underlayColor="#fff"
                onPress={() => {
                    onNearby()
                    setCurrentView('search')
                }}>
                <Image
                    className={`w-8 h-8 m-auto ${isDark ? 'opacity-80' : ''}`}
                    source={SEARCH}
                />
            </TouchableHighlight> */}

            <TouchableHighlight
                className={`p-[2px] ${currentView === 'createPlayground' && 'bg-[#B8F138] rounded-[10px]'}`}
                activeOpacity={1.0}
                underlayColor="#fff"
                onPress={() => {
                    setCurrentView('createPlayground')
                    onCreatePlayground()
                }}
            >
                <Image
                    className={`w-8 h-8 m-auto ${isDark ? 'opacity-80' : ''}`}
                    source={isDark ? WHITE_ADD : ADD}
                />
            </TouchableHighlight>
            {/* <TouchableHighlight
                className={`p-[2px] pl-0 ${currentView === 'moreOptions' && 'bg-[#B8F138] rounded-[10px]'}`}
                activeOpacity={1.0}
                underlayColor="#fff"
                onPress={() => {
                    setCurrentView('moreOptions')
                    onCreatePlayground()
                }}
            >
                <Image
                    className="w-8 h-8 m-auto ml-0 "
                    source={isDark ? WHITE_MORE_OPTIONS : MORE_OPTIONS}
                />
            </TouchableHighlight> */}


        </View>
    </View >
}