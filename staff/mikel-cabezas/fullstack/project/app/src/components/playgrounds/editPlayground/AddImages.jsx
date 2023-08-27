import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import UploadImages from '../addPlayground/UploadImages'
import editPlaygroundAddImages from '../../../logic/playgrounds/editPlayground/editPlaygroundAddImages.js'
import uploadImages from "../../../logic/playgrounds/uploadImages";

export default function EditElements({ TOKEN, id, onEdited, onCancelEdit, description }) {
    const [imagesResized, setImagesResized] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [playgroundDescription, setPlaygroundDescription] = useState()
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setPlaygroundDescription(description)
    }, []);

    useEffect(() => {
    }, [playgroundDescription])

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
                text: 'Save', onPress: async () => {
                    await uploadImagesHandler()
                    await editPlaygroundAddImages(TOKEN, id, newImages)
                    await onEdited()
                    await alert('finish!')
                        .catch(error => console.log(error))
                }
            },
        ]);
    }

    const uploadImagesHandler = () => {
        try {
            // setUploading(true)
            return uploadImages(imagesResized)
                .then(data => {
                    setNewImages(data)
                })
        } catch (error) {
            console.log(error.message)
        }
    }

    return <>
        {<View className="flex-1 bg-black60  items-center justify-center z-50 absolute w-full h-full">
            <View className="bg-white dark:bg-zinc-800 h-auto pl-6 py-7 w-11/12 rounded-3xl">
                <Text className="dark:text-zinc-100 text-xl font-semibold mb-2">Add images</Text>
                <Text className="dark:text-zinc-100 pt-3 text-xs mb-2">Images</Text>
                <UploadImages setImagesResized={setImagesResized} imagesResized={imagesResized} />
                {/* <UploadImages setImagesResized={setImagesResized} imagesResized={imagesResized} closeOnPlaygroundCreated={onCreatePlayground} /> */}
                <View className="pr-6 mt-2">
                    {!uploading ?
                        <TouchableOpacity
                            activeOpacity={0.8}
                            className={`mt-2 box-border w-full`}
                            onPress={handleSave}>
                            <View className={`font-bold px-3 border border-mainLime rounded-full flex-row items-center py-1.5 bg-mainLimez bg-mainLime`}>
                                <Text className="font-bold text-center text-lg w-full">Add</Text>
                            </View>
                        </TouchableOpacity>
                        : <ActivityIndicator size="large" />}
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
            </View>
        </View>}


    </>
}