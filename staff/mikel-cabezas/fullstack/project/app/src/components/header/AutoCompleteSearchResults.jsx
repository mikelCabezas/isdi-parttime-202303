import React, { useEffect, useState, useContext } from "react";
import { Keyboard, View, Image, TextInput, TouchableOpacity, Text } from 'react-native';

import Context from '../../AppContext.js'
import * as Animatable from 'react-native-animatable';
import {
    MENU, FILTER,
    WHITE_MENU, WHITE_MY_LOCATION
} from '../../../assets/icons/index.js';

import retrievePlaygroundsFromCity from "../../logic/playgrounds/retrievePlaygroundsFromCity.js";


export default function SearchResults({ handleCloseModal, retrievedCitiesList, handleViewPlaygroundsFromCity, setPlaygroundsCount, handleAutocomplete }) {

    if (colorScheme === 'dark') isDark = true
    let isDark
    let searchTimeOut

    const { modal, setModal, colorScheme, TOKEN } = useContext(Context)
    const [animation, setAnimation] = useState('fadeInDown')

    useEffect(() => {
    }, [retrievedCitiesList]);

    const onSearchPlayground = () => {

    }

    const autoComplete = (city) => {
        handleAutocomplete(city)
    }

    return <View className="bg-mainGray dark:bg-zinc-700 w-full py-1 absolute top-0 mt-[4px] rounded-[22px] ">
        <View className=" w-full my-5 " />
        {retrievedCitiesList?.length > 0 && retrievedCitiesList?.map((result, index) => {
            return <View className="pt-3  border-[#d2d2d2] dark:border-zinc-700  border-t" key={index} >
                <TouchableOpacity activeOpacity={0.7} key={`${index}-touchable`} className="pt-1 pb-3 px-4" onPress={() => autoComplete(result)}>
                    <Text className="text-zinc-200" key={`${index}-text`}> {result}</Text>
                </TouchableOpacity>
            </View>
        })}

    </View>
}


