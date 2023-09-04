import React, { useEffect, useContext } from "react";
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { SUNNY, SHADY } from '../../../../assets/icons';
import Context from '../../../AppContext'

export default function SunExposition({ playgroundShady, setPlaygroundShady, playgroundSunny, setPlaygroundSunny, playgroundPartial, setPlaygroundPartial }) {
    const { colorScheme } = useContext(Context)
    let isDark
    if (colorScheme === 'dark') isDark = true
    const handleShady = () => {
        playgroundShady.status ? setPlaygroundShady({ status: false, color: isDark ? 'bg-zinc-300' : 'bg-mainGray' })
            : setPlaygroundShady({ status: true, color: 'bg-mainLime' })
    }

    const handleSunny = () => {
        playgroundSunny.status ? setPlaygroundSunny({ status: false, color: isDark ? 'bg-zinc-300' : 'bg-mainGray' })
            : setPlaygroundSunny({ status: true, color: 'bg-mainYellow' })
    }

    const handlePartial = () => {
        playgroundPartial.status ? setPlaygroundPartial({ status: false, color: isDark ? 'bg-zinc-300' : 'bg-mainGray' })
            : setPlaygroundPartial({ status: true, color: 'bg-[#38F1A3]' })
    }

    useEffect(() => {
    }, [playgroundShady, playgroundSunny, playgroundPartial])

    return <>
        <Text className="dark:text-zinc-200 text-lg mt-3 font-semibold" key="main-title">Sun exposition</Text>
        <View className="flex-row" key="all-view">
            <TouchableOpacity
                key="shady-container"
                activeOpacity={0.8}
                className={`border border-mainLime rounded-full mb-1 mt-2 mr-3 ${playgroundShady.color}`}
                onPress={() => { handleShady() }}>
                <View className="font-bold px-3 py-2 rounded-full flex-row" key="shady-view">
                    <Image className="w-5 h-5 mr-2" source={SHADY} key="shady-img" />
                    <Text className="font-bold text-center text-sm rounded-full" key="shady-txt">Shady</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                key="sunny-container"
                activeOpacity={0.8}
                className={`border border-mainYellow rounded-full mb-1 mt-2 mr-3 ${playgroundSunny.color}`}
                onPress={() => { handleSunny() }}>
                <View className="font-bold px-3 py-2 rounded-full flex-row" key="sunny-view">
                    <Image className="w-5 h-5 mr-2" source={SUNNY} key="sunny-img" />
                    <Text className="font-bold text-center text-sm rounded-full" key="sunny-txt">Sunny</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                key="partial-container"
                activeOpacity={0.8}
                className={`border border-[#38F1A3] rounded-full mb-1 mt-2 ${playgroundPartial.color}`}
                onPress={() => { handlePartial() }}>
                <View className="font-bold px-3 py-2 rounded-full flex-row" key="partial-view">
                    <Image className="w-5 h-5 mr-2" source={SUNNY} key="partial-img" />
                    <Text className="font-bold text-center text-sm rounded-full" key="partial-txt">Partial</Text>
                </View>
            </TouchableOpacity>
        </View >
    </>
}