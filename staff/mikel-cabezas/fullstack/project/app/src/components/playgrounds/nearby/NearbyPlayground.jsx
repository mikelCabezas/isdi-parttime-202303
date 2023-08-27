import { useContext, useEffect, useState } from "react"
import Context from "../../../AppContext"
import { Text, Image, View, TouchableOpacity } from 'react-native';

// import { utils } from '../../../com'

// const { extractSubFromToken } = utils

export default function NearbyPlayground({ playground, playground: { name, text, id, images, address, location: { coordinates, city, country, street } }, onToggleLikePost, onToggleSavePost, onEditPostButton, onHideMenuOptions, user, onPostDeleted, onMarkerPressedHandler }) {
    // const userId = extractSubFromToken(context.token)
    // const userId = extractSubFromToken(context.token)
    const image = images[0]

    const [userData, setUserData] = useState(user)
    const { setCurrentMarker } = useContext(Context)

    const markerPressedHandler = () => {
        setCurrentMarker(playground)
        onMarkerPressedHandler()
    }
    const handleOpenMap = () => {
        // openMap({ latitude: playground.location.coordinates[0], longitude: playground.location.coordinates[1] })
        // createMapLink({ start, latitude: playground.location.coordinates[0], longitude: playground.location.coordinates[1], zoom: 20 })

        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' })
        const latLng = `${playground.location.coordinates[0]},${playground.location.coordinates[1]}`
        const label = playground.name
        const url = Platform.select({
            ios: `${scheme}?address=${latLng}`,
            android: `${scheme}${latLng}`
        });
        Linking.openURL(url)
    }
    return <>
        <TouchableOpacity activeOpacity={0.8} key={id} onPress={markerPressedHandler} underlayColor="#fff">
            <View className="flex flex-col relative" key={`container-${id}`}>
                <Image source={{ uri: image }} key={`image-${id}`} className="rounded-2xl w-full h-[168px] object-contain" />
                <Text key={`name-${id}`} className="dark:text-zinc-100 font-bold text-sm text-[13px] leading-4 mt-2 pr-1">{name}</Text>
                <Text key={`street-${id}`} className="dark:text-zinc-100 text-[11px] pr-1">{street}</Text>

            </View>
        </TouchableOpacity>
    </>
}



