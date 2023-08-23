import * as React from 'react';
import { USER_LOCATION, MY_LOCATION, WHITE_MY_LOCATION } from '../../../assets/icons';
import { Image, TouchableOpacity, Alert, Keyboard, View, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps'
import { useRef, useContext, useState, useEffect } from 'react';
import { NativeWindStyleSheet } from "nativewind";
import Playgrounds from './Playgrounds.jsx';
import AppContext from "../../AppContext.js"
import Loader from '../../library/Loader';
const { Provider } = AppContext
import Context from '../../AppContext'
import retrievePlaygrounds from "../../logic/playgrounds/retrievePlaygrounds"
import * as Animatable from 'react-native-animatable';

export default function BaseMap({ user, onMarkerPressed, searchResult, onHomeHandler }) {
    const mapRef = useRef(null);
    const { colorScheme, currentMarker, setCurrentMarker, origin, setOrigin, location, setLocation, currentLocation, loadCurrentLocation, setLoadCurrentLocation, TOKEN } = useContext(Context)
    const [playgrounds, setPlaygrounds] = useState()
    const [animation, setAnimation] = useState('fadeInDown')

    let isDark
    if (colorScheme === 'dark') isDark = true

    const onMarkerPressedHandler = () => onMarkerPressed()


    // useEffect(() => {
    // }, [playgrounds])

    useEffect(() => {
        console.log('Refresh Posts -> render in useEffect')
        try {
            console.log('   Show all Posts -> render in useEffect onLoad compo')

        } catch (error) {
            Alert.alert('Error', `${error.message}`, [
                { text: 'OK', onPress: () => { } },
            ]);
        }
    }, [])
    useEffect(() => {
        console.log('Refresh Posts -> render in useEffect')
        try {
            if (loadCurrentLocation)
                retrievePlaygrounds(TOKEN, location)
                    .then(playgrounds => {
                        setPlaygrounds(playgrounds)
                        console.log('playgrounds[0].length', playgrounds[0].length)
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

                    .catch(error => {
                        Alert.alert('Error', `${error.message}`, [
                            { text: 'OK', onPress: () => { } },
                        ]);
                    })

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
        if (loadCurrentLocation) {
            const onCurrentMarkerRegion = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }
            mapRef.current.animateToRegion(onCurrentMarkerRegion, 1 * 1000);
        }
    }, [loadCurrentLocation])




    useEffect(() => {
        if (currentMarker.location) {
            const onCurrentMarkerRegion = {
                // latitude: currentMarker.location.coordinates[0] - 0.0065,
                // longitude: currentMarker.location.coordinates[1] - 0.0001,
                latitude: currentMarker.location.coordinates[0] - (((50 / 2) + 25) / 10000),
                longitude: currentMarker.location.coordinates[1] - 0.0001,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }
            mapRef.current.animateToRegion(onCurrentMarkerRegion, 1 * 1000);
        }
    }, [currentMarker])



    return <>
        {!loadCurrentLocation && <>
            <MapView
                // userInterfaceStyle={'dark'}
                ref={mapRef}
                showsUserLocation={true}
                // followsUserLocation={true}
                onPress={() => { Keyboard.dismiss(); }}
                onRegionChange={() => { Keyboard.dismiss() }}
                className="w-full h-[120%] top-[-10%] absolute"
                initialRegion={{
                    // latitude: 43.228833,
                    // longitude: 1.7255048,
                    latitude: 40.2085,
                    longitude: -3.713,
                    latitudeDelta: 4,
                    longitudeDelta: 4,
                }} />
            <Loader text="Loading..." details="This may be take a while. Loading current position" />
        </>}

        {loadCurrentLocation && <MapView
            ref={mapRef}
            showsUserLocation={true}
            // followsUserLocation={true}
            onPress={() => { Keyboard.dismiss(); }}
            onRegionChange={() => { Keyboard.dismiss(); }}
            className="w-full h-[120%] top-[-10%] absolute"
            initialRegion={{
                // latitude: 43.228833,
                // longitude: 1.7255048,
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            <Marker
                tooltip={false}
                key={-1}
                width={48}
                coordinate={location} >
                <Image source={USER_LOCATION} className="w-[38px] h-[45px] object-contain" />
                <Callout tooltip >

                </Callout>
            </Marker>

            {!playgrounds || playgrounds[0] <= 0 && <Loader text="Loading..." details="This may be take a while. Loading playgrounds" />}

            {playgrounds && <>
                <Animatable.View animation={animation} duration={250} className=" position absolute top-[10vh] py-2 left-0 w-full flex-row justify-center">
                    <View className="bg-white px-4 py-2 mt-24 left-0 w-auto rounded-full">

                        <Text className="text-center text-lg">{playgrounds[0].length} playgrounds loaded</Text>
                    </View>
                </Animatable.View>
                <Playgrounds user={user} playgrounds={playgrounds} onMarkerPressedHandler={onMarkerPressedHandler} />
            </>}

        </MapView>}
        <TouchableOpacity className="bg-white p-1 rounded-full absolute right-4 bottom-20 mb-4"
            activeOpacity={0.8}
            onPress={() => onCurrentLocation()}>
            <Image
                className="w-8 h-8 m-auto "
                source={isDark ? WHITE_MY_LOCATION : MY_LOCATION} />
        </TouchableOpacity>

    </>
}