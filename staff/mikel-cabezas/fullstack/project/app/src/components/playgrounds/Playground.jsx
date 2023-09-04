import { PIN } from '../../../assets/icons';
import { useContext } from "react"

import MapView, { Marker, Callout } from 'react-native-maps'
import Context from "../../AppContext"
import { Image } from 'react-native';

export default function Post({ playground, playground: { title, text, id, image, address, location }, onToggleLikePost, onToggleSavePost, onEditPostButton, onHideMenuOptions, user, onPostDeleted, onMarkerPressedHandler }) {
    const { setCurrentMarker } = useContext(Context)

    const markerPressedHandler = () => {
        setCurrentMarker()
        setCurrentMarker(playground)
        onMarkerPressedHandler()
    }
    return <>
        <Marker
            tooltip={false}
            key={playground._id}
            width={48}
            coordinate={{ latitude: location.coordinates[0], longitude: location.coordinates[1] }}
            title={title}
            description={text}
            onPress={markerPressedHandler}
        >
            <Image source={PIN} className="w-[38px] h-[45px] object-contain" />
            <Callout tooltip />
        </Marker>
    </>
}



