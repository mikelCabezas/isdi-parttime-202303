import React, { useEffect, useState, useContext } from "react";
import { Text, Image, View, Platform, Linking, Alert } from 'react-native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

import { SHADY, LIKE, LIKE_FILLED, SUNNY, ADD } from '../../../assets/icons';
import Context from '../../AppContext.js'
import SingleElement from './SingleElement'
import { toggleLikePlayground } from "../../logic/playgrounds/toggleLikePlayground";
import retrievePlaygroundById from "../../logic/playgrounds/retrievePlaygroundById";
import { EditSunExposition, EditElements, EditDescription, AddImages } from "./editPlayground/";
import retrieveUser from "../../logic/users/retrieveUser";
import { ScrollView } from 'react-native-gesture-handler';
export default function SinglePlayground({ colorScheme, setTopSheetModalColor, setTopSheetIndicatorColor, setSnapPointSinglePlayground, setSinglePlaygroundImages, onHandleOpenImages }) {
    const { currentMarker, TOKEN } = useContext(Context)
    const [modal, setModal] = useState()
    const [playground, setPlayground] = useState()
    const [shady, setShady] = useState('bg-mainGray')
    const [sunny, setSunny] = useState('bg-mainGray')
    const [partial, setPartial] = useState('bg-mainGray')
    const [likes, setLikes] = useState(false)
    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        refreshPlayground()
    }, [])

    useEffect(() => {
        refreshPlayground()
    }, [isLiked])

    useEffect(() => {
        refreshPlayground()
    }, [currentMarker])

    const onUpdate = async () => {
        await toggleLikePlayground(TOKEN, playground._id)
            .then(() => {
                refreshPlayground()
            })
    }
    const refreshPlayground = async () => {
        try {
            const playground = await retrievePlaygroundById(TOKEN, currentMarker._id)
            setPlayground(playground)
            setLikes(playground.likes)
            playground.sunExposition.shady ? setShady('bg-mainLime') : setShady('bg-mainGray')
            playground.sunExposition.sunny ? setSunny('bg-mainYellow') : setSunny('bg-mainGray')
            playground.sunExposition.partial ? setPartial('bg-[#38F1A3]') : setPartial('bg-mainGray')

            const user = await retrieveUser(TOKEN)
            const like = playground.likes.some(_user => _user === user._id)
            if (like) {
                setIsLiked(true)
            } else setIsLiked(false)

        } catch (error) {
            Alert.alert('Error', `${error.message}`, [
                { text: 'OK', onPress: () => { } },
            ]);
        }

    }


    const handleOpenMap = () => {
        // openMap({ latitude: playground.location.coordinates[0], longitude: playground.location.coordinates[1] })
        // createMapLink({ start, latitude: playground.location.coordinates[0], longitude: playground.location.coordinates[1], zoom: 20 })
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' })
        const latLng = `${playground.location.coordinates[0]},${playground.location.coordinates[1]}`
        const url = Platform.select({
            ios: `${scheme}?address=${latLng}`,
            android: `${scheme}${latLng}`
        });
        Linking.openURL(url)
    }

    const handleOpenImages = () => {
        setSinglePlaygroundImages(playground.images)
        onHandleOpenImages()
    }
    const onEditElements = () => {
        setModal('edit-element')
        if (colorScheme === 'light') {
            setTopSheetModalColor('#666666')
            setTopSheetIndicatorColor('#222')
        }
        if (colorScheme === 'dark') {
            setTopSheetModalColor('#111')
            setTopSheetIndicatorColor('#888')
        }

        setSnapPointSinglePlayground(1)
    }
    const onEditSunExposition = () => {
        setModal('edit-sun-exposition')
        if (colorScheme === 'light') {
            setTopSheetModalColor('#666666')
            setTopSheetIndicatorColor('#222')
        }
        if (colorScheme === 'dark') {
            setTopSheetModalColor('#111')
            setTopSheetIndicatorColor('#888')
        }
        setSnapPointSinglePlayground(1)
    }
    const onEditDescription = () => {
        setModal('edit-description')
        if (colorScheme === 'light') {
            setTopSheetModalColor('#111')
            setTopSheetIndicatorColor('#222')
        }
        if (colorScheme === 'dark') {
            setTopSheetModalColor('#27272A')
            setTopSheetIndicatorColor('#888')
        }
        setSnapPointSinglePlayground(1)
    }
    const onAddImages = () => {
        setModal('add-images')
        if (colorScheme === 'light') {
            setTopSheetModalColor('#111')
            setTopSheetIndicatorColor('#222')
        }
        if (colorScheme === 'dark') {
            setTopSheetModalColor('#27272A')
            setTopSheetIndicatorColor('#888')
        }
        setSnapPointSinglePlayground(1)
    }
    const onEdited = () => {
        setModal()
        refreshPlayground()
        setSnapPointSinglePlayground(0)
        if (colorScheme === 'light') {
            setTopSheetModalColor('#fff')
            setTopSheetIndicatorColor('#777')
        }

        if (colorScheme === 'dark') {
            setTopSheetModalColor('#27272A')
            setTopSheetIndicatorColor('#888')
        }

        Alert.alert('Success"', `Thank you! \n Playground updated.`, [
            { text: 'OK', onPress: () => { } },
        ]);

    }
    const onCancelEdit = () => {
        if (colorScheme === 'light') {
            setTopSheetModalColor('#fff')
            setTopSheetIndicatorColor('#777')
        }

        if (colorScheme === 'dark') {
            setTopSheetModalColor('#27272A')
            setTopSheetIndicatorColor('#888')
        }

        setModal()
        setSnapPointSinglePlayground(0)
    }
    let sunExposition = false
    if (shady === 'bg-mainLime' || sunny === 'bg-main' || partial === 'bg-mainLime')
        sunExposition = true

    return <View className="h-full bg-red-500z relative flex-column justify-between items-center bg-[blue]">
        {playground && <>
            <ScrollView showsVerticalScrollIndicator={false} className="bg-[blue]">
                <View className="w-full px-5 pb-12 bg-white dark:bg-zinc-800  z-40 relative" >
                    <View className="ml-auto mt-1 z-50 flex-row items-center">
                        <Text className="dark:text-zinc-200 text-center mr-2 text-lg">{likes.length}</Text>
                        <TouchableOpacity
                            className=""
                            activeOpacity={0.8}
                            onPress={() => {
                                onUpdate()
                            }}>
                            <Image
                                className={`w-7 h-7 mx-auto `}
                                source={isLiked ? LIKE_FILLED : LIKE} />
                        </TouchableOpacity>

                    </View>
                    <Text className="dark:text-zinc-200 text-xl font-semibold">{playground.name}</Text>
                    <Text className="pt-1 text-sm max-w-[80vw] text-darkGreen dark:text-mainLime mb-2">{playground.location.street}</Text>
                    <TouchableOpacity
                        onPress={handleOpenMap}>
                        <View className={`border border-mainLime bg-mainLime rounded-full mt-1 mb-2`}>
                            <Text className="font-bold text-center text-sm px-5 py-2 w-full">Go to playground</Text>
                        </View>
                    </TouchableOpacity>

                    <View className="flex-row flex-wrap  mb-4">
                        <View className="flex-row w-full mt-3 mb-2">
                            <Text className="dark:text-zinc-200 text-lg font-semibold mr-2">Sun Exposition</Text>
                            <TouchableOpacity className="" onPress={onEditSunExposition}><View className="my-auto px-2 mr-3 rounded-full"><Text className="text-darkGreen dark:text-mainLime text-xs font-semibold mt-1">Edit details</Text></View></TouchableOpacity>
                        </View>
                        {!sunExposition && <>
                            <Text className="dark:text-zinc-200 mb-3 font-semibold w-full">There is no info yet... Tap add details for edit!</Text>
                        </>}
                        <View className="gap-3 flex-row flex-wrap">
                            <View
                                className={`border border-mainLime rounded-full ${shady}`}
                                onPress={() => { handleShady() }}>
                                <View className="font-bold px-3 py-2 rounded-full flex-row">
                                    <Image className="w-5 h-5 mr-2" source={SHADY} />
                                    <Text className="font-bold text-center text-sm rounded-full">Shady</Text>
                                </View>
                            </View>

                            <View
                                className={`border border-mainYellow rounded-full ${sunny}`}
                                onPress={() => { handleShady() }}>
                                <View className="font-bold px-3 py-2 rounded-full flex-row">
                                    <Image className="w-5 h-5 mr-2" source={SUNNY} />
                                    <Text className="font-bold text-center text-sm rounded-full">Sunny</Text>
                                </View>
                            </View>

                            <View
                                className={`border border-[#38F1A3] rounded-full ${partial}`}
                                onPress={() => { handleShady() }}>
                                <View className="font-bold px-3 py-2 rounded-full flex-row">
                                    <Image className="w-5 h-5 mr-2" source={SUNNY} />
                                    <Text className="font-bold text-center text-sm rounded-full">Partial</Text>
                                </View>
                            </View>

                        </View>

                    </View>
                    <View className="flex-row flex-wrap mb-4">
                        <View className="flex-row w-full mt-3 mb-2">
                            <Text className="dark:text-zinc-200 text-lg font-semibold mr-3">Elements</Text>
                            <TouchableOpacity activeOpacity={0.8} onPress={onEditElements}><View className="my-auto px-2 mr-3 rounded-full"><Text className="text-darkGreen dark:text-mainLime text-xs font-semibold mt-1">Edit elements</Text></View></TouchableOpacity>
                        </View>

                        {playground.elements.length !== 0 ? playground.elements.map((element, index) => {
                            return <SingleElement element={element} index={index} />
                        }) :
                            <View className="flex-row flex-wrap mb-">
                                <Text className="dark:text-zinc-200 mb-1.5 font-semibold w-full">There are no elements yet...</Text>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    className="border border-mainLime  rounded-full mb-1 mt-2 mr-2 bg-mainGray"  >
                                    <View className="font-bold px-3 py-0.5 flex-row items-center border border-mainLime  rounded-full mb-1 mt-2 mr-2 bg-mainGray">
                                        <Text className={`font-bold text-center text-sm`}>Add one!</Text>

                                        <View className="flex justify-center justify-items-center p-1 ml-2">
                                            <Image className="h-6 w-6 object-cover" source={ADD} />
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    <View className="flex-column mb-4 w-full">
                        <View className="flex-row w-full mt-3 mb-2">
                            <Text className="dark:text-zinc-200 text-lg font-semibold mr-3">Description</Text>
                            {playground.description && playground.description === '-' &&
                                <TouchableOpacity onPress={onEditDescription} className="">
                                    <View className="my-auto px-2 mr-3 rounded-full">
                                        <Text className="text-darkGreen dark:text-mainLime text-xs font-semibold mt-1">Add description</Text>
                                    </View>
                                </TouchableOpacity>}

                            {playground.description && playground.description !== '-' &&
                                <TouchableOpacity onPress={onEditDescription} className="">
                                    <View className="my-auto px-2 mr-3 rounded-full">
                                        <Text className="text-darkGreen dark:text-mainLime text-xs font-semibold mt-1">Edit description</Text>
                                    </View>
                                </TouchableOpacity>}

                        </View>
                        {playground.description && playground.description !== '-' &&
                            <Text className="dark:text-zinc-200 text-lgs font-normal">{playground.description}</Text>
                        }
                    </View>

                    <View className="flex-row w-full mb-2">
                        <Text className="dark:text-zinc-200 text-lg font-semibold mr-3">Images</Text>
                        <TouchableOpacity onPress={onAddImages} className=""><View className="my-auto px-2 mr-3 rounded-full"><Text className="text-darkGreen dark:text-mainLime text-xs font-semibold mt-1">Add images</Text></View></TouchableOpacity>
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true} >
                        <View className="flex-row gap-3">

                            {playground.images.length > 0 && playground.images.map((image, index) => {
                                return <TouchableOpacity
                                    activeOpacity={0.8}
                                    className="border border-mainLime  rounded-full mb-1 mt-2 mr-2 bg-mainGray"
                                    onPress={handleOpenImages}
                                    key={index} >
                                    <Image
                                        className="w-36 h-40 object-cover rounded-2xl"
                                        key={index}
                                        source={{ uri: image }}
                                    />
                                </TouchableOpacity>
                            })}
                        </View>

                    </ScrollView>
                    <View className="mb-36" />
                </View>
            </ScrollView>

            {modal === 'edit-sun-exposition' && <EditSunExposition TOKEN={TOKEN} id={playground._id} sunExposition={playground.sunExposition} onEdited={onEdited} onCancelEdit={onCancelEdit} setTopSheetModalColor={setTopSheetModalColor} setTopSheetIndicatorColor={setTopSheetIndicatorColor} colorScheme={colorScheme} />}
            {modal === 'edit-element' && <EditElements TOKEN={TOKEN} id={playground._id} elements={playground.elements} onEdited={onEdited} onCancelEdit={onCancelEdit} setTopSheetModalColor={setTopSheetModalColor} setTopSheetIndicatorColor={setTopSheetIndicatorColor} colorScheme={colorScheme} />}
            {modal == 'edit-description' && <EditDescription TOKEN={TOKEN} id={playground._id} description={playground.description} onEdited={onEdited} onCancelEdit={onCancelEdit} setTopSheetModalColor={setTopSheetModalColor} setTopSheetIndicatorColor={setTopSheetIndicatorColor} colorScheme={colorScheme} />}
            {modal == 'add-images' && <AddImages TOKEN={TOKEN} id={playground._id} onEdited={onEdited} onCancelEdit={onCancelEdit} setTopSheetModalColor={setTopSheetModalColor} setTopSheetIndicatorColor={setTopSheetIndicatorColor} colorScheme={colorScheme} />}
        </>}

    </View >
}