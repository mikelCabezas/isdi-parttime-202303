import React, { useEffect, useState } from "react";

import { HOME, NEARBY, SEARCH, LIKES, MORE_OPTIONS } from '../../assets/icons';
import { View, Image, TouchableHighlight, Alert } from 'react-native';
import { NativeWindStyleSheet } from "nativewind";
NativeWindStyleSheet.setOutput({
    default: "native",
});
export default function Footer({ nearbyHandler }) {
    const [activeElement, setActiveElement] = useState()
    const onNearby = () => {
        nearbyHandler()
    }

    return <View className="absolute w-full justify-center flex bottom-8 content-center">
        <View className="w-10/12 h-12 p-1 bg-white rounded-full left-0 m-auto flex flex-row ">
            <Image
                className="w-8 h-8 m-auto"
                source={HOME}
            />

            <TouchableHighlight
                className={`p-[2px] ${activeElement === 'nearby' && 'bg-[#B8F138] rounded-[10px]'}`}
                activeOpacity={1.0}
                underlayColor="#fff"
                onPress={() => {
                    onNearby()
                    setActiveElement('nearby')
                }}>
                <Image
                    className={`w-8 h-8 m-auto`}
                    source={NEARBY}
                />
            </TouchableHighlight>
            <Image
                className={`w-8 h-8 m-auto`}
                source={LIKES}
            />
            <Image
                className="w-8 h-8 m-auto"
                source={SEARCH}
            />
            <Image
                className="w-8 h-8 m-auto ml-0"
                source={MORE_OPTIONS}
            />
        </View>
    </View >
}