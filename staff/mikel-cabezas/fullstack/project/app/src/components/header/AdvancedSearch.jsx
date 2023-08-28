import React, { useEffect, useState, useContext } from "react";
import { Text, Image, View, TextInput, Switch, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Slider from '@react-native-community/slider';

import { SHADY, LIKE, LIKE_FILLED, SUNNY, ADD } from '../../../assets/icons';
import Context from '../../AppContext.js'
import SingleElement from './SingleElement'
import SingleAge from './SingleAge'
import AutoCompleteSearchResults from './AutoCompleteSearchResults'
import SunExposition from '../playgrounds/addPlayground/SunExposition'
import retrieveFromFilter from "../../logic/playgrounds/retrieveFromFilter";
import retrievePlaygroundsCities from "../../logic/playgrounds/retrievePlaygroundsCities";
import * as Animatable from 'react-native-animatable';

export default function AdvancedSearch({ closeHandle, setPlaygroundsCount, onHandleViewPlaygroundsFromCity }) {
    const { TOKEN, currentView, setCurrentView, currentMarker, location, freeze, unfreeze } = useContext(Context)
    const [playground, setPlayground] = useState()
    const [elements, setElements] = useState([{ status: false, type: 'Slide' }, { status: false, type: 'Rider' }, { status: false, type: 'Swing' }, { status: false, type: 'Double Swing' }, { status: false, type: 'Seesaw' }, { status: false, type: 'Sandbox' }, { status: false, type: 'House' }, { status: false, type: 'Climber' }])
    const [activeAges, setActiveAges] = useState()
    const ages = [1, 2, 3, 4, 5, 6,]
    const [searchQuery, setSearchQuery] = React.useState();
    const [timeoutId, setTimeoutId] = useState()
    const [retrievedCitiesList, setRetrievedCitiesList] = useState()

    const [animation, setAnimation] = useState('')

    const [playgroundShady, setPlaygroundShady] = useState({ status: false, color: 'bg-mainGray' })
    const [playgroundSunny, setPlaygroundSunny] = useState({ status: false, color: 'bg-mainGray' })
    const [playgroundPartial, setPlaygroundPartial] = useState({ status: false, color: 'bg-mainGray' })

    const [isAccessible, setIsAccessible] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(false);
    const [useUserLocation, setUseUserLocation] = useState(false);
    const [inputLocation, setInputLocation] = useState();
    const [distance, setDistance] = useState(1);

    enableScroll = () => this.setState({ scrollEnabled: true });
    disableScroll = () => this.setState({ scrollEnabled: false });

    const toggleAccessible = () => setIsAccessible(previousState => !previousState)
    const toggleUseUserLocation = () => setUseUserLocation(previousState => !previousState)

    const closeCitiesList = () => {
        setRetrievedCitiesList()
    }
    const toggleCurrentLocation = () => {
        console.log('current location on toggle', currentLocation)
        setCurrentLocation(previousState => !previousState)

        switch (currentLocation) {
            case false:
                setAnimation('')
                toggleUseUserLocation()
                setTimeout(() => {
                }, 350);

                break;
            case true:
                setAnimation('')
                toggleUseUserLocation()
                break;
        }
    }

    const handleQuerySearch = () => {
        try {
            let age
            if (!activeAges) age = null
            if (activeAges?.length > 0) age = activeAges.length
            const query = {
                sunExposition: [{ shady: playgroundShady }, { sunny: playgroundSunny }, { partial: playgroundPartial }],
                age: age,
                elements: elements,
                isAccessible: isAccessible,
                userCoordinates: location,
                citySearch: inputLocation,
                distance: distance
            }
            if (!useUserLocation) delete query.userCoordinates
            if (useUserLocation) delete query.citySearch
            if (!useUserLocation && !inputLocation) {
                throw new Error(`Set your current location or a city`)
            }
            retrieveFromFilter(TOKEN, query)
                .then(playgroundsResult => {
                    try {
                        if (playgroundsResult[1][0].length > 0) {
                            // freeze()
                            // setTimeout(() => {
                            //     unfreeze()
                            // }, 500);
                            onHandleViewPlaygroundsFromCity(playgroundsResult)
                            setPlaygroundsCount(playgroundsResult[1][0].length)
                        }
                        else {
                            Alert.alert('No results found', 'Do you want to search with other parameters?', [
                                {
                                    text: 'Close',
                                    onPress: () => {
                                        bottomSheetRef.current.close()
                                        setModal('')
                                        setCurrentView('')
                                    },
                                    style: 'cancel',
                                },
                                {
                                    text: 'Yes', onPress: () => {

                                    }
                                },
                            ]);
                        }
                    } catch (error) {
                        alert(error.message)
                    }

                })
                .catch(error => alert(error.message))
        } catch (error) {
            // Alert.alert('Error', `${error.message}`, [
            //     { text: 'OK', onPress: () => { } },
            // ]);
            alert(error.message)
        }
    }

    const handleElementPressed = elementName => {
        const updateElements = elements.map(element => {
            if (element.type === elementName)
                return { ...element, status: !element.status }
            return element
        })
        setElements(updateElements)
    }
    const handleAgePressed = age => {
        if (age === 1) setActiveAges([1])
        if (age === 2) setActiveAges([1, 2])
        if (age === 3) setActiveAges([1, 2, 3])
        if (age === 4) setActiveAges([1, 2, 3, 4])
        if (age === 5) setActiveAges([1, 2, 3, 4, 5])
        if (age === 6) setActiveAges([1, 2, 3, 4, 5, 6])
    }

    const handleSearch = (query) => {
        setInputLocation(query)
        setSearchQuery(query)

        if (timeoutId)
            clearTimeout(timeoutId)

        const newTimeoutId = setTimeout(async () => {
            try {
                if (searchQuery)
                    await retrievePlaygroundsCities(TOKEN, searchQuery).then(data => {
                        if (data.length > 0) {
                            console.log('data', data)
                            setRetrievedCitiesList(data)
                        } else {
                            setRetrievedCitiesList(['No results found. Try another city name.'])
                        }
                    })
            } catch (error) {
                console.log(error.message)
            }
        }, 2000);
        setTimeoutId(newTimeoutId)
    }

    onAutocomplete = (city) => {
        // alert(city)
        setInputLocation(city)
        setRetrievedCitiesList()
        Keyboard.dismiss();
    }

    useEffect(() => {
    }, [isAccessible, elements, activeAges])

    return <View className="h-full relative flex-column justify-between items-center w-full px-5">
        {!playground && <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="pb-12 bg-white dark:bg-zinc-800 z-40" >
                    <View className="flex-row flex-wrap mt-4 mb-5">
                        <Text className="dark:text-zinc-100 text-2xl font-semibold w-full mb-3">Advanced search</Text>
                        <View className="flex-row flex-wrap items-center mb-5 w-full z-30">
                            <View className="bg-white z-10 w-full flex-row flex-wrap items-center">
                                <Text className="dark:text-zinc-100 text-lg w-full font-bold mr-2 flex">Location</Text>
                                <Text className="dark:text-zinc-100 text-sm mr-2 flex">Use my current location</Text>
                                <Switch
                                    style={{ marginTop: 4, transform: [{ scaleX: .75 }, { scaleY: .75 }] }}
                                    onValueChange={toggleCurrentLocation}
                                    value={currentLocation}
                                />
                                {!useUserLocation && <Animatable.View animation={animation} duration={250} className="w-full z-50">
                                    {/* {retrievedCitiesList && <>
                                        <TouchableOpacity onPress={closeCitiesList} className="flex-1 w-full h-screen absolute left-0 top-0 bg-red-500z z-[99]" />
                                    </>} */}
                                    <Text className="dark:text-zinc-100 text-lg w-full font-bold mr-2">Search by city</Text>

                                    <View className="z-[100]">
                                        <TextInput
                                            label="City"
                                            returnKeyType="next"
                                            value={inputLocation}
                                            // onChangeText={setInputLocation}
                                            onChangeText={(query) => handleSearch(query)}
                                            // autoCompleteType="city"
                                            clearButtonMode="always"
                                            placeholder="City"
                                            className="dark:text-zinc-100 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full mt-1 mb-0 pl-3 pr-6 py-3 self-start w-full z-10"
                                            inputMode="text"
                                            keyboardType="default"
                                        />
                                        {retrievedCitiesList && <>
                                            <Animatable.View animation={animation} duration={250} className="absolute w-full -z-10">
                                                <AutoCompleteSearchResults retrievedCitiesList={retrievedCitiesList} handleAutocomplete={onAutocomplete} />
                                            </Animatable.View>
                                        </>
                                        }
                                    </View>
                                </Animatable.View>}
                            </View>
                        </View>
                        <View className="mb-5 z-10">
                            <Text className="dark:text-zinc-100 text-lg mb-1 font-semibold w-full">Distance</Text>
                            <View className="flex-row flex-wrap items-center">
                                <Slider
                                    style={{ width: '60%', height: 40 }}
                                    step={1}
                                    minimumValue={1}
                                    maximumValue={20}
                                    minimumTrackTintColor="#B8F138"
                                    maximumTrackTintColor="#ECECEC"
                                    onValueChange={setDistance}
                                />
                                <Text className="ml-6">{distance} km</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center mb-2 w-full z-10">
                            <Text className="dark:text-zinc-100 text-lg font-bold mr-2 flex">Accessibility</Text>
                            <Switch
                                style={{ marginTop: 0, transform: [{ scaleX: .75 }, { scaleY: .75 }] }}
                                onValueChange={toggleAccessible}
                                value={isAccessible}
                            />
                        </View>
                        <SunExposition playgroundShady={playgroundShady} setPlaygroundShady={setPlaygroundShady} playgroundSunny={playgroundSunny} setPlaygroundSunny={setPlaygroundSunny} playgroundPartial={playgroundPartial} setPlaygroundPartial={setPlaygroundPartial} />
                    </View>
                    <View className="flex flex-wrap flex-row mb-5 -z-10">
                        <Text className="dark:text-zinc-100 text-lg font-semibold w-full">Age</Text>
                        {ages.map((age, index) => {
                            return <SingleAge activeAges={activeAges} age={age} mainColor="mainLime" onAgePressed={handleAgePressed} />
                        })}
                    </View>
                    <View className="flex flex-wrap flex-row mb-6 -z-10">
                        <Text className="dark:text-zinc-100 text-lg font-semibold w-full">Elements</Text>
                        {elements.map((element, index) => {
                            return <SingleElement element={element} index={index} mainColor="mainLime" onElementPressed={handleElementPressed} />
                        })}
                    </View>


                    <TouchableOpacity
                        underlayColor="#ffffff"
                        activeOpacity={0.8}
                        className="border border-mainLime bg-mainLime rounded-full self-center w-full  "
                        onPress={handleQuerySearch} >
                        <View className="font-bold px-6 py-2 self-center rounded-full" >
                            <Text className="font-bold text-lg">Search</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>}
        <View className="flex-row absolute bottom-0 bg-mainGrays w-full mx-auto justify-center z-50 pb-11" />
    </View >
}