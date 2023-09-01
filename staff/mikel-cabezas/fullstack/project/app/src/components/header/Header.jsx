import React, { useEffect, useState, useContext, useRef } from "react";
import { Keyboard, View, Image, TextInput, TouchableOpacity, Text } from 'react-native';

import Context from '../../AppContext.js'
import SearchResults from "./SearchResults.jsx";

import * as Animatable from 'react-native-animatable';
import {
    MENU, FILTER,
    WHITE_MENU, WHITE_MY_LOCATION
} from '../../../assets/icons/index.js';
import retrievePlaygrounds from "../../logic/playgrounds/retrievePlaygrounds.js";
import retrievePlaygroundsCities from "../../logic/playgrounds/retrievePlaygroundsCities.js";


export default function Header({ navigation, onHandleViewPlaygroundsFromCity, handleToggleSidebar, onToggleFilter, setPlaygroundsCount }) {

    if (colorScheme === 'dark') isDark = true
    let isDark
    const clearTextInput = useRef(null);

    const { modal, setModal, colorScheme, TOKEN } = useContext(Context)
    const [text, setChangeText] = React.useState();
    const [searchQuery, setSearchQuery] = React.useState();
    const [loading, setIsLoading] = React.useState();
    const [isTyping, setIsTyping] = React.useState([]);
    const [data, setData] = React.useState();
    const [timeoutId, setTimeoutId] = useState()
    const [animation, setAnimation] = useState('fadeInDown')

    useEffect(() => {
        setIsLoading(true)
    }, []);

    const onToggleSidebar = () => {
        handleToggleSidebar()
    }

    // useEffect(() => {
    //     clearTimeout(isTyping)
    //     setData()
    //     setModal('simpleSearch')
    // }, [searchQuery])

    useEffect(() => {
    }, [data]);

    const onSearchPlayground = () => {
        setModal('simpleSearch')
    }

    const handleCloseModal = () => {
        setAnimation('fadeOutUp')
        setTimeout(() => {
            setModal()
            setAnimation()
        }, 300)
    }

    const simpleSearchRegion = (search) => {
    }
    useEffect(() => {
        const delayId = setTimeout(() => {
            (async () => {
                try {
                    const results = await retrievePlaygroundsCities(TOKEN, searchQuery)
                    if (results.length > 0) {
                        setData(results)
                    } else if (searchQuery) {
                        setData(['No results were found. Try another city name.'])
                    }
                } catch (error) {

                }
            })()
        }, 800);

    }, [searchQuery]);

    return <>
        {modal === 'simpleSearch' && data?.length > 0 && <View className="flex-1 w-full h-screen justify-center items-center absolute top-0">
            <TouchableOpacity activeOpacity={1} onPress={handleCloseModal}>
                <View className="bg-tranparent flex-1 h-screen w-screen" />
            </TouchableOpacity>
            <Animatable.View animation={animation} duration={250} key={-2} className="flex w-11/12 bg-white dark:bg-zinc-800 absolute top-12 m-auto pt-8 pb-3 flex-1 rounded-[22px] text-left">
                <View className="py-2 border-b-[1px] border-mainGray dark:border-zinc-600" key={-1} />
                <SearchResults data={data} handleViewPlaygroundsFromCity={onHandleViewPlaygroundsFromCity} setPlaygroundsCount={setPlaygroundsCount} handleCloseModal={handleCloseModal} />
            </Animatable.View>
        </View>
        }
        <View className="absolute w-full justify-center flex top-12 content-center">
            <View className="w-11/12 bg-white dark:bg-zinc-800  rounded-full left-0 m-auto flex flex-row px-4 h-12">
                <TouchableOpacity
                    className={`p-[2px]`}
                    activeOpacity={1.0}
                    onPress={onToggleSidebar}>
                    <Image
                        className={`w-8 h-8 m-auto ${isDark ? 'opacity-80' : ''}`}
                        source={isDark ? WHITE_MENU : MENU}
                    />
                </TouchableOpacity>
                <View className="flex-1">
                    <TouchableOpacity className="flex-1" >
                        <TextInput
                            onFocus={onSearchPlayground}
                            clearButtonMode="always"
                            inputMode="text"
                            className="px-5 py-3 flex-1 dark:text-zinc-200  text-left"
                            setChangeText={setChangeText}
                            onChangeText={(e) => setSearchQuery(e)}
                            value={text}
                            placeholder="Search playground in..."
                            keyboardType="default"
                            ref={clearTextInput}
                            returnKeyType="done"
                        />
                    </TouchableOpacity>

                </View>
                <TouchableOpacity
                    className={`p-[2px]`}
                    activeOpacity={1.0}
                    onPress={onToggleFilter}>
                    <Image
                        className="w-7 h-7 m-auto"
                        source={isDark ? FILTER : FILTER} />
                </TouchableOpacity>

            </View>
        </View >
    </>
}
