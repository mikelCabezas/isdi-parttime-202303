import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import SingleElement from '../SingleElement'
import editPlaygroundSunExposition from '../../../logic/playgrounds/editPlayground/editPlaygroundSunExposition.js'
import AddElement from "../addPlayground/AddElement.jsx";
import { SUNNY, SHADY } from '../../../../assets/icons';

export default function EditElements({ TOKEN, id, onEdited, onCancelEdit, sunExposition }) {
    const [modal, setModal] = useState()

    const [playgroundShady, setPlaygroundShady] = useState()
    const [playgroundSunny, setPlaygroundSunny] = useState()
    const [playgroundPartial, setPlaygroundPartial] = useState()

    useEffect(() => {
        sunExposition.shady ? setPlaygroundShady({ status: true, color: 'bg-mainLime' }) : setPlaygroundShady({ status: false, color: 'bg-mainGray' })
        sunExposition.sunny ? setPlaygroundSunny({ status: true, color: 'bg-mainYellow' }) : setPlaygroundSunny({ status: false, color: 'bg-mainGray' })
        sunExposition.partial ? setPlaygroundPartial({ status: true, color: 'bg-[#38F1A3]' }) : setPlaygroundPartial({ status: false, color: 'bg-mainGray' })
    }, []);

    const handleCancel = () => {
        Alert.alert('Confirm', 'Do you want to discard changes?', [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            {
                text: 'Discard', onPress: () => {
                    onCancelEdit()
                }
            },
        ]);

    }
    const handleSave = () => {
        const sunExposition = { shady: playgroundShady.status, sunny: playgroundSunny.status, partial: playgroundPartial.status }

        Alert.alert('Confirm', 'These modifications are public. Please verify the authenticity of these alterations and ensure that they do not adversely affect anyone.', [
            {
                text: 'Cancel',
                onPress: () => bottomSheetRef.current.snapToIndex(1),
                style: 'cancel',
            },
            {
                text: 'Save', onPress: () => {
                    return editPlaygroundSunExposition(TOKEN, id, sunExposition)
                        .then(() => { onEdited() })
                        .catch(error => console.log(error))
                }
            },
        ]);
    }

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
        {playgroundShady && playgroundSunny && playgroundPartial && <View className="flex-1 bg-black60  items-center justify-center z-50 absolute w-full h-full">
            <View className="bg-white dark:bg-zinc-800 h-auto px-6 py-7 w-11/12 rounded-3xl">
                <Text className="dark:text-zinc-200 text-lg mt-3 mb-3 font-semibold">Sun exposition</Text>
                <View className="flex-row flex-wrap mb-4 gap-1.5">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className={`border border-mainLime rounded-full mb-1 mt-2 mr-1.5z ${playgroundShady.color}`}
                        onPress={() => { handleShady() }}>
                        <View className="font-bold px-3 py-2 rounded-full flex-row">
                            <Image className="w-5 h-5 mr-2" source={SHADY} />
                            <Text className="font-bold text-center text-sm rounded-full">Shady</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className={`border border-mainYellow rounded-full mb-1 mt-2 mr-1.5z ${playgroundSunny.color}`}
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
                <TouchableOpacity
                    // disabled={fieldStatus}
                    activeOpacity={0.8}
                    className="box-border w-full"
                    onPress={handleSave}>
                    <View className="font-bold px-3 border border-mainLime rounded-full flex-row items-center py-1.5 bg-mainLime">
                        <Text className="font-bold text-center text-lg w-full">Save</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    className="mt-4 self-center w-full"
                    onPress={handleCancel}
                >
                    <View className="px-6  self-center " >
                        <Text className="dark:text-zinc-200 text-lg">Cancel</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>}


    </>
}