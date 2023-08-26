import { View, Image, Text } from 'react-native'
import LOADING from '../../assets/loading.gif'


export default function Loader({ text, details, background }) {
    return <>
        <View className="flex-1 justify-center items-center w-full">
            <Image className="w-full h-screen top-0 absolute" source={background} />

            <View className="w-4/5 px-6 py-8 bg-white border-2 border-[#010658] mx-auto rounded-2xl">
                <Image source={LOADING} className="w-full h-16" />
                <Text className="text-center font-bold mt-5 text-xl">{text}</Text>
                <Text className="text-center mt-2 text-">{details}</Text>
            </View>
        </View>
    </>
}