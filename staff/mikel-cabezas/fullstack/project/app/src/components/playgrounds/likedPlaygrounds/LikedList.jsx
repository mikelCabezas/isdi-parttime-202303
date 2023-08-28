import React, { useEffect, useState, useContext } from "react";

import { Text, Image, View, TouchableHighlight, Modal, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import * as Animatable from 'react-native-animatable';
import { CLOSE } from '../../../../assets/icons';
import Context from '../../../AppContext.js'

import { NativeWindStyleSheet } from "nativewind";
import LikedPlaygrounds from "./LikedPlaygrounds";
NativeWindStyleSheet.setOutput({
    default: "native",
});

export default function LikedList({ closeHandle, playground, handleMarkerPressedHandler }) {
    const { currentView, setCurrentView } = useContext(Context)
    // const { currentMarker, setCurrentMarker } = useContext(Context)
    const [animation, setAnimation] = useState('fadeInUp')

    const onClose = () => {
        setAnimation('fadeOutDown')
        closeHandle()
        // alert('hola')
        setAnimation()
    }


    return <>
        {playground &&
            <View className="w-full h-auto max-h-max pl-5 pr-0 pt-1 rounded-[20px] mx-auto " >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="flex-row">
                        <Text className="dark:text-zinc-100  font-bold text-lg mb-2">My favorites</Text>
                    </View>
                    <LikedPlaygrounds onMarkerPressedHandler={handleMarkerPressedHandler} />
                    <View className="w-auto" />
                </ScrollView>
            </View>
        }


    </>
}