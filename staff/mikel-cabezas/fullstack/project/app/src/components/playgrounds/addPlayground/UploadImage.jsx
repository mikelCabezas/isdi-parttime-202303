import React, { useState, useEffect } from 'react';
import { View, Button, Text, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';


import { firebase } from '../../config/firebase.js'

export default function Upload() {
    const [ready, setReady] = useState(false);
    const [image, setImage] = useState(null);
    const [imageResized, setImageResized] = useState(null);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);

            const manipResult = await manipulateAsync(
                result.assets[0].uri,
                [{ resize: { height: 1000 } }],
                { compress: 0.5, format: SaveFormat.JPEG }
            );
            setImageResized(manipResult);

            setReady(true);
            result.assets[0].uri = manipResult.uri
        }
    }

    const uploadImage = async () => {
        setUploading(true)
        // const response = await fetch(image.uri)
        const response = await fetch(imageResized.uri)
        const blob = await response.blob()
        const filename = imageResized.uri.substring(imageResized.uri.lastIndexOf('/') + 1)

        // const ref = firebase.storage().ref().child(filename).put(blob)

        try {
            const { ref } = await firebase.storage().ref().child(filename).put(blob)
            const url = await ref.getDownloadURL()
            console.log(url)
        } catch (error) {
            console.log(error)
        }
        setUploading(false)

        Alert.alert('Succeed', `Image uploaded`, [
            { text: 'OK', onPress: () => { } },
        ]);

        setImage(null)
    }
    // const uploadImage = async () => {
    //     setUploading(true)
    //     const response = await fetch(imageResized.uri)
    //     const blob = response.blob()
    //     const filename = imageResized.uri.substring(imageResized.uri.lastIndexOf('/') + 1)
    //     try {
    //         var ref = firebase.storage().ref().child(filename).put(blob)
    //         const url = await ref.getDownloadURL()
    //         console.log(url)
    //     } catch (e) {
    //         console.log(e)
    //     }
    //     setUploading(false)
    //     alert(
    //         'Photo uploaded!'
    //     );
    //     setImage(null);
    // }

    const _renderImage = () => (
        <View>
            <Image source={imageResized} className="mx-auto w-48 h-48" />
        </View>
    );

    return (
        <>
            <View>
                <View className="w-full justify-center flex-row">
                    <Text className="text-center bg-mainLime p-2 mb-2" onPress={pickImage} >
                        Choose a picture
                    </Text>
                </View>
                {image && <>
                    <View className="flex justify-center w-full">
                        <Image source={{ uri: image.uri }} className="mx-auto w-48 h-48 border" />
                        {ready && image && _renderImage()}

                    </View>
                </>}
                {!uploading ? <Button title="Upload" onPress={uploadImage} /> : <ActivityIndicator size="large" />}

            </View>
        </>
    );
};
