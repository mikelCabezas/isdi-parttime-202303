import { useContext } from "react"
import Context from "../../../AppContext"
import { Text, Image, View, TouchableOpacity } from 'react-native';

export default function NearbyPlayground({ playground, playground: { name, text, id, images, address, location: { coordinates, city, country, street } }, onToggleLikePost, onToggleSavePost, onEditPostButton, onHideMenuOptions, user, onPostDeleted, onMarkerPressedHandler }) {
    const image = images[0]
    const { setCurrentMarker } = useContext(Context)

    const markerPressedHandler = () => {
        setCurrentMarker(playground)
        onMarkerPressedHandler()
    }
    return <>
        <TouchableOpacity activeOpacity={0.8} key={id} onPress={markerPressedHandler} underlayColor="#fff">
            <View className="flex flex-col relative" key={`container-${id}`}>
                <Image source={{ uri: image }} key={`image-${id}`} className="rounded-2xl w-full h-[168px] object-contain" />
                <Text key={`name-${id}`} className="dark:text-zinc-200 font-bold text-sm text-[13px] leading-4 mt-2 pr-1">{name}</Text>
                <Text key={`street-${id}`} className="dark:text-zinc-200 text-[11px] pr-1">{street}</Text>

            </View>
        </TouchableOpacity>
    </>
}



