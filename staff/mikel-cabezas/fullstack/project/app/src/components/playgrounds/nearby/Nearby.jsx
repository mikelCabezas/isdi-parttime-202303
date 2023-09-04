import React, { useState } from "react";
import { Text, View } from 'react-native';

import NearbyPlaygrounds from "./NearbyPlaygrounds";

export default function Nearby({ playground, handleMarkerPressedHandler }) {
    return <>
        {playground &&
            <View className="w-full h-auto max-h-max pl-5 pr-0 pt-1 rounded-[20px] mx-auto " >
                <View className="flex-row">
                    <Text className="dark:text-zinc-200 font-bold text-lg mb-2">Nearby</Text>
                </View>
                <View className="w-auto" >
                </View>
                <NearbyPlaygrounds onMarkerPressedHandler={handleMarkerPressedHandler} />
            </View>
        }
    </>
}