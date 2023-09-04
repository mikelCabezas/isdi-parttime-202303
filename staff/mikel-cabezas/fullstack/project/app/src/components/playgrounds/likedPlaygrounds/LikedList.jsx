import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { NativeWindStyleSheet } from "nativewind";
import LikedPlaygrounds from "./LikedPlaygrounds";
NativeWindStyleSheet.setOutput({
    default: "native",
});

export default function LikedList({ playground, handleMarkerPressedHandler }) {
    return <>
        {playground &&
            <View className="w-full h-auto max-h-max pl-5 pr-0 pt-1 rounded-[20px] mx-auto " >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="flex-row">
                        <Text className="dark:text-zinc-200  font-bold text-lg mb-2">My favorites</Text>
                    </View>

                    <LikedPlaygrounds onMarkerPressedHandler={handleMarkerPressedHandler} />
                    <View className="w-auto" />
                </ScrollView>
            </View>
        }
    </>
}