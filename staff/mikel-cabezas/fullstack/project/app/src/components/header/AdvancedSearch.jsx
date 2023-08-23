import React, { useEffect, useState, useContext } from "react";
import { Text, Image, View, ScrollView, TextInput, Switch, TouchableOpacity } from 'react-native';

import Slider from '@react-native-community/slider';

import { SHADY, LIKE, LIKE_FILLED, SUNNY, ADD } from '../../../assets/icons';
import Context from '../../AppContext.js'
import SingleElement from './SingleElement'
import SingleAge from './SingleAge'
import SunExposition from '../playgrounds/addPlayground/SunExposition'
import retrieveFromFilter from "../../logic/playgrounds/retrieveFromFilter";
import * as Animatable from 'react-native-animatable';

export default function AdvancedSearch({ closeHandle }) {
    const { currentView, setCurrentView, currentMarker, setCurrentMarker, TOKEN } = useContext(Context)
    const [playground, setPlayground] = useState()
    const [elements, setElements] = useState([{ status: false, type: 'Slide' }, { status: false, type: 'Rider' }, { status: false, type: 'Swing' }, { status: false, type: 'Double Swing' }, { status: false, type: 'Seesaw' }, { status: false, type: 'Sandbox' }, { status: false, type: 'House' }, { status: false, type: 'Climber' }])
    const [activeAges, setActiveAges] = useState()
    const ages = [1, 2, 3, 4, 5, 6,]
    // const [ages, setAges] = useState([{ status: false, number: '+1' }, { status: false, number: '+2' }, { status: false, number: '+3' }, { status: false, number: '+4' }, { status: false, number: '+5' }, { status: false, number: '+6' }])

    const [animation, setAnimation] = useState('')

    const [playgroundShady, setPlaygroundShady] = useState({ status: false, color: 'bg-mainGray' })
    const [playgroundSunny, setPlaygroundSunny] = useState({ status: false, color: 'bg-mainGray' })
    const [playgroundPartial, setPlaygroundPartial] = useState({ status: false, color: 'bg-mainGray' })

    const [isAccessible, setIsAccessible] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(false);
    const [showInputLocation, setShowInputLocation] = useState(false);
    const [inputLocation, setInputLocation] = useState();
    const [distance, setDistance] = useState(0);

    enableScroll = () => this.setState({ scrollEnabled: true });
    disableScroll = () => this.setState({ scrollEnabled: false });

    const toggleAccessible = () => {
        setIsAccessible(previousState => !previousState)
    }

    const toggleCurrentLocation = () => {
        console.log('current location on toggle', currentLocation)
        setCurrentLocation(previousState => !previousState)

        switch (currentLocation) {
            case false:
                setAnimation('')
                setShowInputLocation(previousState => !previousState)
                setTimeout(() => {
                }, 350);

                break;
            case true:
                setAnimation('')
                setShowInputLocation(previousState => !previousState)
                break;
        }
    }

    const handleQuerySearch = () => {
        try {
            let age
            if (activeAges.length > 0) age = activeAges.length
            const query = {
                sunExposition: [{ shady: playgroundShady }, { sunny: playgroundSunny }, { partial: playgroundPartial }],
                age: age,
                elements: elements,
                isAccessible: isAccessible,
                distance: distance
            }
            retrieveFromFilter(TOKEN, query)
                .then(playgroundsResult => {
                    console.log(playgroundsResult)
                    // handleViewPlaygroundsFromCity(playgroundsResult)
                })
        } catch (error) {
            console.log(error.message)
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

    useEffect(() => {
    }, [isAccessible, elements, activeAges])

    return <View className="h-full relative flex-column justify-between items-center w-full px-5">
        {!playground && <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="pb-12 bg-white dark:bg-gray-800 z-40" >

                    <View className="flex-row flex-wrap mt-4 mb-5">
                        <Text className="dark:text-white text-2xl font-semibold w-full">Advanced search</Text>
                        <SunExposition playgroundShady={playgroundShady} setPlaygroundShady={setPlaygroundShady} playgroundSunny={playgroundSunny} setPlaygroundSunny={setPlaygroundSunny} playgroundPartial={playgroundPartial} setPlaygroundPartial={setPlaygroundPartial} />
                    </View>
                    <View className="flex flex-wrap flex-row mb-5">
                        <Text className="dark:text-white text-lg font-semibold w-full">Age</Text>
                        {ages.map((age, index) => {
                            return <SingleAge activeAges={activeAges} age={age} mainColor="mainLime" onAgePressed={handleAgePressed} />
                        })}
                    </View>
                    <View className="flex flex-wrap flex-row mb-5">
                        <Text className="dark:text-white text-lg font-semibold w-full">Elements</Text>
                        {elements.map((element, index) => {
                            return <SingleElement element={element} key={index} mainColor="mainLime" onElementPressed={handleElementPressed} />
                        })}
                    </View>
                    <View className="flex-row items-center mb-5">
                        <Text className="dark:text-white text-lg font-bold mr-2 flex">Accessibility</Text>
                        <Switch
                            style={{ marginTop: 4, transform: [{ scaleX: .75 }, { scaleY: .75 }] }}
                            onValueChange={toggleAccessible}
                            value={isAccessible}
                        />
                    </View>
                    <View className="flex-row flex-wrap items-center mb-5 w-full">
                        <View className="bg-white z-10 w-full flex-row flex-wrap items-center">
                            <Text className="dark:text-white text-lg w-full font-bold mr-2 flex">Location</Text>
                            <Text className="dark:text-white text-sm mr-2 flex">Use my current location</Text>
                            <Switch
                                style={{ marginTop: 4, transform: [{ scaleX: .75 }, { scaleY: .75 }] }}
                                onValueChange={toggleCurrentLocation}
                                value={currentLocation}
                            />
                            {!showInputLocation && <Animatable.View animation={animation} duration={250} className="w-full ">
                                <Text className="dark:text-white text-lg w-full font-bold mr-2">Search by city</Text>
                                <TextInput
                                    label="City"
                                    returnKeyType="next"
                                    value={inputLocation}
                                    onChangeText={setInputLocation}
                                    autoCompleteType="city"
                                    placeholder="City"
                                    className="dark:text-white border border-mainGray bg-mainGray dark:border-gray-700 dark:bg-gray-700 rounded-full mt-1 mb-0 px-3 py-2 self-start w-full"
                                    inputMode="text"
                                    keyboardType="default"
                                />
                            </Animatable.View>}
                        </View>
                    </View>
                    <View className="mb-5">
                        <Text className="dark:text-white text-lg mb-1 font-semibold w-full">Distance</Text>
                        <View className="flex-row flex-wrap items-center">
                            <Slider
                                style={{ width: '60%', height: 40 }}
                                step={1}
                                minimumValue={0}
                                maximumValue={20}
                                minimumTrackTintColor="#B8F138"
                                maximumTrackTintColor="#ECECEC"
                                onValueChange={setDistance}
                            />
                            <Text className="ml-6">{distance} km</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        underlayColor="#ffffff"
                        activeOpacity={0.8}
                        className="border border-mainLime bg-mainLime rounded-full self-center w-full  "
                        onPress={handleQuerySearch}
                    >
                        <View className="font-bold px-6 py-2 self-center rounded-full" >
                            <Text className="font-bold text-lg">Search</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
        }

        <View className="flex-row absolute bottom-0 bg-mainGrays w-full mx-auto justify-center z-50 pb-11" />
    </View >
}