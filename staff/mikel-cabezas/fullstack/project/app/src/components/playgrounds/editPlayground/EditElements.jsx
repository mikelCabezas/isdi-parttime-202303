import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import Context from '../../../AppContext.js'
import { Picker } from 'react-native-wheel-pick';
import { DROPDOWN, ADD } from "../../../../assets/icons/index.js";
import SingleElement from '../SingleElement'
import editPlaygroundElements from '../../../logic/playgrounds/editPlayground/editPlaygroundElements.js'
import AddElement from "../addPlayground/AddElement.jsx";
export default function EditElements({ TOKEN, id, colorScheme, setTopSheetModalColor, setTopSheetIndicatorColor, onEdited, onCancelEdit, elements }) {
    const [modal, setModal] = useState()
    const [newElements, setNewElements] = useState();

    useEffect(() => {
        setNewElements(elements)
    }, []);

    const onCancelHandleElement = () => {
        setModal()
        if (colorScheme === 'light') {
            setTopSheetModalColor('#666')
            setTopSheetIndicatorColor('#777')
        }
        if (colorScheme === 'dark') {
            setTopSheetModalColor('#111')
            setTopSheetIndicatorColor('#888')
        }
    }
    const onNewElement = element => {
        setNewElements(currentElements => [...currentElements, element])
        setModal()
        if (colorScheme === 'light') {
            setTopSheetModalColor('#fff')
            setTopSheetIndicatorColor('#777')
        }
        if (colorScheme === 'dark') {
            setTopSheetModalColor('#27272A')
            setTopSheetIndicatorColor('#333')
        }
    }
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
                    if (colorScheme === 'light') {
                        setTopSheetModalColor('#fff')
                        setTopSheetIndicatorColor('#777')
                    }
                    if (colorScheme === 'dark') {
                        setTopSheetModalColor('#27272A')
                        setTopSheetIndicatorColor('#333')
                    }
                }
            },
        ]);
    }
    const handleSave = () => {
        Alert.alert('Confirm', 'These modifications are public. Please verify the authenticity of these alterations and ensure that they do not adversely affect anyone.', [
            {
                text: 'Cancel',
                onPress: () => bottomSheetRef.current.snapToIndex(1),
                style: 'cancel',
            },
            {
                text: 'Save', onPress: () => {
                    return editPlaygroundElements(TOKEN, id, newElements)
                        .then(() => {
                            onEdited()
                            if (colorScheme === 'light') {
                                setTopSheetModalColor('#fff')
                                setTopSheetModalColor('#777')
                            }
                            if (colorScheme === 'dark') {
                                setTopSheetModalColor('#27272A')
                                setTopSheetIndicatorColor('#333')
                            }
                        })
                        .catch(error => console.log(error))
                }
            },
        ]);
    }
    const onAddElement = () => {
        setModal('add-element')
        if (colorScheme === 'light') {
            setTopSheetModalColor('#2a2a2a')
            setTopSheetIndicatorColor('#888')
        }
        if (colorScheme === 'dark') {
            setTopSheetModalColor('#070707')
            setTopSheetIndicatorColor('#333')
        }
    }

    const handleEditElement = () => {
        setTopSheetModalColor('#2a2a2a')
        setTopSheetIndicatorColor('#888')
    }

    return <>
        {newElements && <View className="flex-1 bg-black60  items-center justify-center z-50 absolute w-full h-full">
            <View className="bg-white dark:bg-zinc-800 h-auto px-6 py-7 w-11/12 rounded-3xl">
                <Text className="dark:text-zinc-200 text-xl font-semibold mb-2">Edit elements</Text>
                <View className="flex-row flex-wrap w-full mb-2">
                    <Text className="dark:text-zinc-200 text-lg mb-2 font-semibold w-full">Elements</Text>
                    {newElements.length !== 0 && newElements.map((element, index) => {
                        return <SingleElement element={element} index={index} handleEditElement={handleEditElement} />
                    })}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className={`border border-mainYellow rounded-full mb-2  bg-mainGray py-1.5 pr-1`}
                        onPress={onAddElement}>
                        <View className="font-bold px-3 py-0.5 flex-row items-center my-auto" >
                            <Image className="w-5 h-5 mr-2" source={ADD} />
                            <Text className="font-bold text-center text-sm">Add element</Text>
                        </View>
                    </TouchableOpacity>
                </View>

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
                    onPress={handleCancel} >
                    <View className="px-6  self-center " >
                        <Text className="dark:text-zinc-200 text-lg">Cancel</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>}

        {modal === 'add-element' && <AddElement onElementCreated={onNewElement} id={newElements.length} onCancelAddElement={onCancelHandleElement} setTopSheetModalColor={setTopSheetModalColor} colorScheme={colorScheme} setTopSheetIndicatorColor={setTopSheetIndicatorColor} />}
    </>
}