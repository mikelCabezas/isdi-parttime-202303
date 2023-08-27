import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import SingleElement from '../SingleElement'
import editPlayGroundDescription from '../../../logic/playgrounds/editPlayground/editPlaygroundDescription.js'
import AddElement from "../addPlayground/AddElement.jsx";
import { SUNNY, SHADY } from '../../../../assets/icons';

export default function EditElements({ TOKEN, id, onEdited, onCancelEdit, description }) {
    const [modal, setModal] = useState()
    const [playgroundDescription, setPlaygroundDescription] = useState()


    useEffect(() => {
        setPlaygroundDescription(description)
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

        Alert.alert('Confirm', 'These modifications are public. Please verify the authenticity of these alterations and ensure that they do not adversely affect anyone.', [
            {
                text: 'Cancel',
                onPress: () => bottomSheetRef.current.snapToIndex(1),
                style: 'cancel',
            },
            {
                text: 'Save', onPress: () => {
                    return editPlayGroundDescription(TOKEN, id, playgroundDescription)
                        .then(() => onEdited())
                        .catch(error => console.log(error))
                }
            },
        ]);
    }



    useEffect(() => {
    }, [playgroundDescription])

    return <>
        {<View className="flex-1 bg-black60  items-center justify-center z-50 absolute w-full h-full">
            <View className="bg-white dark:bg-zinc-800 h-auto px-6 py-7 w-11/12 rounded-3xl">
                <Text className="dark:text-zinc-100 text-xl font-semibold mb-2">Edit Description</Text>
                <Text className="dark:text-zinc-100 pt-3 text-xs ">Description</Text>
                <TextInput
                    label="Description"
                    returnKeyType="done"
                    value={playgroundDescription}
                    onChangeText={setPlaygroundDescription}
                    secureTextEntry
                    placeholder="Description"
                    className="dark:text-zinc-100 border border-mainGray bg-mainGray dark:border-zinc-600 dark:bg-zinc-600  rounded-xl mt-1 mb-4 px-2 py-2 self-start w-full h-[85px]"
                    inputMode="text"
                    keyboardType="default"
                    multiline={true}
                />
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
                        <Text className="dark:text-zinc-100 text-lg">Cancel</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>}


    </>
}