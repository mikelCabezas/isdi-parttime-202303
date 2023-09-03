import { View, Item, Text, Alert, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import AppContext from "../AppContext.js";
import Context from '../AppContext.js'
import BottomSheet from '@gorhom/bottom-sheet';

import { WHITE_CLOSE, CLOSE } from '../../assets/icons/index.js';

export default function Home({ user, handleCloseonCloseFutureVersions }) {
    const { colorScheme } = useContext(Context)

    // const [welcomeMessageStorage, setWelcomeMessageStorage] = useState(false)
    let mainColor
    if (colorScheme === 'dark') {
        mainColor = 'rgb(31 41 55)'
    } else if (colorScheme === 'light') {
        mainColor = '#ffffff'
    }

    const onCloseFutureVersions = () => {
        handleCloseonCloseFutureVersions()
    }

    const data = [
        'Mas idiomas: inglés, español y catalán',
        'Añadr parques desde cualquier sitio',
        'Issues, un nuevo método de interacción para comunicar los estados de los parques',

    ]

    return <>
        <View className="flex-1 w-full h-screen bg-black60 justify-center items-center absolute top-0">
            <TouchableOpacity activeOpacity={0.8} onPress={onCloseFutureVersions} className="absolute right-2 top-10 z-50 shadow-md shadow-black ">
                <Image source={WHITE_CLOSE} className="w-10 h-10" />
            </TouchableOpacity>
            <View className="w-10/12 max-h-[80vh] p-7 bg-white dark:bg-zinc-800 rounded-2xl">
                <ScrollView>
                    <Text className="dark:text-zinc-200 text-lg font-semibold">Próxima versión</Text>
                    <Text className="dark:text-zinc-200 mb-2">La siguiente versión aún no tiene fecha prevista, pero tendrá las siguientes novedades:</Text>
                    {data.map(element => {
                        return <View className="flex-row mb-2">
                            <Text className="dark:text-zinc-200 ml-1" >{'\u2022'} </Text>
                            <Text className="dark:text-zinc-200 flex-1 pl-1">{element}</Text>
                        </View>
                    })}
                </ScrollView>
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="border border-mainLime bg-mainLime rounded-full mt-4 self-center w-full  "
                    onPress={onCloseFutureVersions}
                >
                    <View className="font-bold px-6 py-2 self-center rounded-full" >
                        <Text className="font-bold text-lg">OK</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>

    </>
}