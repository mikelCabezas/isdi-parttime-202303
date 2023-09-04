import * as React from 'react';
import { USER_LOCATION, MY_LOCATION, WHITE_MY_LOCATION } from '../../../assets/icons';
import BG from '../../../assets/bg-login.png'
import { Image, TouchableOpacity, Alert, Keyboard } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps'
import { useRef, useContext, useState, useEffect } from 'react';
import Playgrounds from './Playgrounds.jsx';
import AppContext from "../../AppContext.js"
const { Provider } = AppContext
import Context from '../../AppContext'
import retrievePlaygrounds from "../../logic/playgrounds/retrievePlaygrounds"
import Loader from '../../library/Loader'

export default function BaseMap({ user, onMarkerPressed, searchResult, onHomeHandler, setPlaygroundsCount, newPlaygroundStatus, setAnimation }) {
    const mapRef = useRef(null);
    const { TOKEN, colorScheme, currentMarker, location, loadCurrentLocation, freeze, unfreeze } = useContext(Context)
    const [playgrounds, setPlaygrounds] = useState()

    let isDark
    if (colorScheme === 'dark') isDark = true

    const onMarkerPressedHandler = () => onMarkerPressed()

    useEffect(() => {
        freeze()
    }, []);

    useEffect(() => {
        if (loadCurrentLocation) {
            unfreeze()
        }
    }, [playgrounds, loadCurrentLocation])
    useEffect(() => {
        try {
            if (newPlaygroundStatus) {
                retrievePlaygrounds(TOKEN, location)
                    .then(playgrounds => {
                        setPlaygrounds(playgrounds)
                        setPlaygroundsCount(playgrounds[0].length)
                        setAnimation('fadeInDown')
                        setTimeout(() => {
                            setAnimation('fadeOutUp')
                        }, 3000);
                    })
                    .catch(error => {
                        Alert.alert('Error', `${error.message}`, [
                            { text: 'OK', onPress: () => { } },
                        ]);
                    })
                unfreeze()
            }
        } catch (error) {
            Alert.alert('Error', `${error.message}`, [
                { text: 'OK', onPress: () => { } },
            ]);
        }
    }, [newPlaygroundStatus])

    useEffect(() => {
        try {
            if (loadCurrentLocation) {
                retrievePlaygrounds(TOKEN, location)
                    .then(playgrounds => {
                        setPlaygrounds(playgrounds)
                        if (playgrounds[0].length > 0) {
                            setPlaygroundsCount(playgrounds[0].length)
                        } else if (playgrounds[0].length === 0) {
                            setPlaygroundsCount(null)
                        }
                        setAnimation('fadeInDown')
                        setTimeout(() => {
                            setAnimation('fadeOutUp')
                        }, 3000);
                    })
                    .catch(error => {
                        Alert.alert('Error', `${error.message}`, [
                            { text: 'OK', onPress: () => { } },
                        ]);
                    })
                unfreeze()
                const onCurrentMarkerRegion = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }
                mapRef.current.animateToRegion(onCurrentMarkerRegion, 1 * 1000);
            }
        } catch (error) {
            Alert.alert('Error', `${error.message}`, [
                { text: 'OK', onPress: () => { } },
            ]);
        }
    }, [loadCurrentLocation])

    useEffect(() => {
        if (searchResult) {
            setPlaygrounds(searchResult[1])
            const onCurrentMarkerRegion = {
                latitude: searchResult[0][0],
                longitude: searchResult[0][1],
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }
            mapRef.current.animateToRegion(onCurrentMarkerRegion, 1 * 1000);
        }
    }, [searchResult]);

    useEffect(() => {
        if (loadCurrentLocation) {
            const onCurrentMarkerRegion = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }
            mapRef.current.animateToRegion(onCurrentMarkerRegion, 1 * 1000);
        }
    }, [onHomeHandler])

    const onCurrentLocation = () => {
        const onCurrentMarkerRegion = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }
        mapRef.current.animateToRegion(onCurrentMarkerRegion, 1 * 1000);
    }

    useEffect(() => {
        if (currentMarker.location) {
            const onCurrentMarkerRegion = {
                latitude: currentMarker.location.coordinates[0] - (((50 / 2) + 25) / 10000),
                longitude: currentMarker.location.coordinates[1] - 0.0001,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }
            mapRef.current.animateToRegion(onCurrentMarkerRegion, 1 * 1000);
        }
    }, [currentMarker])

    return <>
        {/* <Image className="w-full h-screen top-0 absolute" source={BG} /> */}
        <Loader text="Loading..." details="Fetching your location" background={BG} />
        {loadCurrentLocation && <MapView
            ref={mapRef}
            showsUserLocation={true}
            onPress={() => { Keyboard.dismiss() }}
            onRegionChange={() => { Keyboard.dismiss() }}
            className="w-full h-[120%] top-[-10%] absolute"
            initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}>

            <Marker
                tooltip={false}
                key={-1}
                width={48}
                coordinate={location} >
                <Image source={USER_LOCATION} className="w-[38px] h-[45px] object-contain" />
                <Callout tooltip />
            </Marker>

            {playgrounds && <Playgrounds user={user} playgrounds={playgrounds} onMarkerPressedHandler={onMarkerPressedHandler} />}
        </MapView>}
        <TouchableOpacity className="bg-white dark:bg-zinc-800 p-1.5 rounded-full absolute right-4 bottom-[75px] mb-4"
            activeOpacity={0.8}
            onPress={() => onCurrentLocation()}>
            <Image
                className={`w-8 h-8 m-auto ${isDark ? 'opacity-80' : ''}`}
                source={isDark ? WHITE_MY_LOCATION : MY_LOCATION} />
        </TouchableOpacity>
    </>
}