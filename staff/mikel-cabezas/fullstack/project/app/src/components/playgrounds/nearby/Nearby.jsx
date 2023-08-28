import React, { useEffect, useState, useContext } from "react";

import { Text, Image, View, ScrollView, TouchableHighlight, Modal, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { CLOSE } from '../../../../assets/icons';
import Context from '../../../AppContext.js'

import { NativeWindStyleSheet } from "nativewind";
import NearbyPlaygrounds from "./NearbyPlaygrounds";
NativeWindStyleSheet.setOutput({
    default: "native",
});

export default function Nearby({ closeHandle, playground, handleMarkerPressedHandler }) {
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
                <View className="flex-row">
                    <Text className="dark:text-zinc-100 font-bold text-lg mb-2">Nearby</Text>
                </View>
                <View className="w-auto" >
                </View>
                <NearbyPlaygrounds onMarkerPressedHandler={handleMarkerPressedHandler} />
            </View>
        }
    </>
}