import { View, Image, Text } from 'react-native'
import LOADING from '../../assets/loading.gif'
import WHITE_LOADING from '../../assets/white-loading.gif'


export default function Loader({ text, details, background, colorScheme }) {

    let isDark
    if (colorScheme === 'dark') isDark = true
    return <>
        <View className="flex-1 justify-center items-center w-full">
            <Image className="w-full h-screen top-0 absolute" source={background} />

            <View className="w-4/5 px-6 py-8 bg-white dark:bg-zinc-800 border-2 border-[#010658] dark:border-zinc-800 mx-auto rounded-2xl">
                <Image source={isDark ? WHITE_LOADING : LOADING} className="w-full h-16 dark:opacity-80" />
                <Text className="text-center font-bold mt-5 text-xl dark:text-zinc-200">{text}</Text>
                <Text className="text-center mt-2 text- dark:text-zinc-200">{details}</Text>
            </View>
        </View>
    </>
}