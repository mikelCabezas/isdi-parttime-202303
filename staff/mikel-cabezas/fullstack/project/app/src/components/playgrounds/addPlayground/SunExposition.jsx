import React, { useEffect } from "react";
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { SUNNY, SHADY } from '../../../../assets/icons';

export default function SunExposition({ playgroundShady, setPlaygroundShady, playgroundSunny, setPlaygroundSunny, playgroundPartial, setPlaygroundPartial }) {
    const handleShady = () => {
        playgroundShady.status ? setPlaygroundShady({ status: false, color: 'bg-mainGray' })
            : setPlaygroundShady({ status: true, color: 'bg-mainLime' })
    }

    const handleSunny = () => {
        playgroundSunny.status ? setPlaygroundSunny({ status: false, color: 'bg-mainGray' })
            : setPlaygroundSunny({ status: true, color: 'bg-mainYellow' })
    }

    const handlePartial = () => {
        playgroundPartial.status ? setPlaygroundPartial({ status: false, color: 'bg-mainGray' })
            : setPlaygroundPartial({ status: true, color: 'bg-[#38F1A3]' })
    }

    useEffect(() => {
    }, [playgroundShady, playgroundSunny, playgroundPartial])

    return <>
        <Text className="dark:text-zinc-100 text-lg mt-3 font-semibold">Sun exposition</Text>
        <View className="flex-row">
            <TouchableOpacity
                activeOpacity={0.8}
                className={`border border-mainLime rounded-full mb-1 mt-2 mr-3 ${playgroundShady.color}`}
                onPress={() => { handleShady() }}>
                <View className="font-bold px-3 py-2 rounded-full flex-row">
                    <Image className="w-5 h-5 mr-2" source={SHADY} />
                    <Text className="font-bold text-center text-sm rounded-full">Shady</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.8}
                className={`border border-mainYellow rounded-full mb-1 mt-2 mr-3 ${playgroundSunny.color}`}
                onPress={() => { handleSunny() }}>
                <View className="font-bold px-3 py-2 rounded-full flex-row">
                    <Image className="w-5 h-5 mr-2" source={SUNNY} />
                    <Text className="font-bold text-center text-sm rounded-full">Sunny</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.8}
                className={`border border-[#38F1A3] rounded-full mb-1 mt-2 ${playgroundPartial.color}`}
                onPress={() => { handlePartial() }}>
                <View className="font-bold px-3 py-2 rounded-full flex-row">
                    <Image className="w-5 h-5 mr-2" source={SUNNY} />
                    <Text className="font-bold text-center text-sm rounded-full">Partial</Text>
                </View>
            </TouchableOpacity>
        </View >
    </>
}