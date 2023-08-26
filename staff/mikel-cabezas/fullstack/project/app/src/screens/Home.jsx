import { View, StatusBar, Alert, Dimensions, Image, TouchableHighlight, Text } from 'react-native';
import { useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import AppContext from "../AppContext.js";
const { Provider } = AppContext
import Context from '../AppContext.js'
import WelcomeMessage from '../library/WelcomeMessage'

import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

import { WHITE_CLOSE, CLOSE } from '../../assets/icons';
import Sidebar from '../components/header/Sidebar.jsx';
import Header from '../components/header/Header.jsx';
import AdvancedSearch from '../components/header/AdvancedSearch.jsx';
import Footer from '../components/Footer.jsx';
import Nearby from '../components/playgrounds/nearby/Nearby.jsx';
import SinglePlayground from '../components/playgrounds/SinglePlayground.jsx';
import CreatePlayground from '../components/playgrounds/addPlayground/AddPlayground.jsx';
import retrieveUser from "../logic/users/retrieveUser"
import { BaseMap } from '../components/playgrounds/index.js';

import Carousel, { Pagination, PaginationLight } from 'react-native-x-carousel';
import LikedList from '../components/playgrounds/likedPlaygrounds/LikedList.jsx';
import UserSettings from '../components/playgrounds/UserSettings.jsx';
import welcomeMessage from '../logic/welcomeMessage.js';
import checkLoggedInUser from '../logic/users/checkLoggedInUser.js';

export default function Home({ route, navigation, onSendViewPlaygroundsFromCity }) {
    const { modal, setModal, setIsLoggedIn, colorScheme, TOKEN, loadCurrentLocation, setCurrentView } = useContext(Context)
    const [currentMarker, setCurrentMarker] = useState({})
    const [newPlaygroundStatus, setNewPlaygroundStatus] = useState(false)
    const [playgroundsCount, setPlaygroundsCount] = useState()
    const [searchResult, setSearchResult] = useState(false)
    const [user, setUser] = useState()
    const [singlePlaygroundImages, setSinglePlaygroundImages] = useState()
    const [modalImages, setModalImages] = useState()
    const [welcomeMessageStorage, setWelcomeMessageStorage] = useState(false)
    const [onHomeHandler, setOnHomeHandler] = useState(null);
    const [animation, setAnimation] = useState('fadeInDown')


    const { params } = route;
    const { width } = Dimensions.get('window');

    const bottomSheetRef = useRef();
    const snapPoints = useMemo(() => ['75%', '94%'], []);
    const snapPointsSmall = useMemo(() => ['42%', '65%'], []);

    let mainColor
    if (colorScheme === 'dark') {
        mainColor = 'rgb(31 41 55)'
    } else if (colorScheme === 'light') {
        mainColor = '#ffffff'
    }

    useEffect(() => {
        // console.log('params', params)
        // navigation.getParam('message', 'default value')
        // const message = JSON.stringify(params)

        if (params?.message === 'Success. New email setted') {
            Alert.alert('Success', `New email setted`, [
                { text: 'OK', onPress: () => { } },
            ]);
            setModal('userSettings')
        }

        (async () => {
            if (TOKEN) await checkLoggedInUser(TOKEN)
                .catch(async user => {
                    if (!user || !user._id && user !== null) {
                        Alert.alert('Error', `This user does not exist`, [
                            { text: 'OK', onPress: () => { } },
                        ]);
                        setIsLoggedIn(false)
                        await navigation.navigate('Login')
                        // AsyncStorage.clear();
                        AsyncStorage.getAllKeys()
                            .then(keys => AsyncStorage.multiRemove(keys))
                            .then(() => alert('success'));
                    }
                })

        })();
        (async () => {
            await retrieveUser(TOKEN)
                .then(user => {
                    setUser(user)
                })
        })();

        if (!welcomeMessageStorage) {
            (async () => {
                await AsyncStorage.getItem('@WELCOME_MESSAGE')
                    .then(state => {
                        if (!state) {
                            setWelcomeMessageStorage(true)
                        }
                    })
            })();
        }
    }, [])

    useEffect(() => {

        // JSON.stringify(navigation.getParam('otherParam', 'default value'))
        // navigation

        // if (message) {
        //     Alert.alert('Success', `${message}`, [
        //         { text: 'OK', onPress: () => { } },
        //     ]);
        //     setMessage()
        // }
    }, []);

    const handleSheetChangesCreate = useCallback((index) => {
        if (newPlaygroundStatus === false && index === -1) {
            confirmCloseModal()
        }
    }, []);

    const handleSheetChangesSingle = useCallback((index) => {
        if (index === -1) {
            bottomSheetRef.current.close()
            setModal('')
            setCurrentView('')
        }
    }, []);

    useEffect(() => {
        if (playgroundsCount > 0) {
            setAnimation('fadeInDown')
            setTimeout(() => {
                setAnimation('fadeOutUp')
            }, 3000);
        }

    }, [playgroundsCount])


    const onCloseWelcomeMessage = () => {
        welcomeMessage()
        setWelcomeMessageStorage(false)
    }

    const onHome = () => {
        setModal('')
        setOnHomeHandler(true)
        setTimeout(() => {
            setOnHomeHandler(false)
        }, 50);
    }
    const onNearby = () => {
        setModal('nearby')
    }
    const onLiked = () => {
        setModal('liked')
    }
    const onCreatePlayground = () => {
        setModal('createPlayground')
    }
    const onCloseModal = () => {
        if (modal === 'createPlayground') {
            confirmCloseModal()
        } else if (modal) {
            bottomSheetRef.current.close()
            setModal()
        }
    }
    const onCloseImages = () => {
        setModalImages(false)
        setSinglePlaygroundImages()
    }
    const onCloseAddPlayground = () => {
        setNewPlaygroundStatus(true)
        bottomSheetRef.current.close()
        setModal('')
        setCurrentView('')
        setTimeout(() => {
            setNewPlaygroundStatus(false)
        }, 1000);
    }
    const markerPressedHandler = props => {
        // const playground = currentMarker
        setModal('singlePlayground')
    }
    const onCloseSidebar = () => {
        setTimeout(() => {
            setModal()
        }, 300)
    }
    const onOpenLikedFromSidebar = () => {
        setTimeout(() => {
            setModal('')
        }, 300)
        setTimeout(() => {
            setModal('liked')
        }, 305)
    }
    const onUserSettingsFromSidebar = () => {
        setTimeout(() => {
            setModal('')
        }, 300)
        setTimeout(() => {
            setModal('userSettings')
        }, 305)
    }
    const confirmCloseModal = () =>
        Alert.alert('Confirm', 'Do you want to discard changes?', [
            {
                text: 'Cancel',
                onPress: () => bottomSheetRef.current.snapToIndex(1),
                style: 'cancel',
            },
            {
                text: 'Discard', onPress: () => {
                    bottomSheetRef.current.close()
                    setModal('')
                    setCurrentView('')
                }
            },
        ]);

    const handleViewPlaygroundsFromCity = (results) => {
        if (modal) bottomSheetRef.current.close()
        setSearchResult(results)
    }

    const handleToggleSidebar = () => {
        setModal('sidebar')
    }

    const onToggleFilter = () => {
        if (modal !== 'searchFilter') {
            setModal('searchFilter')
        } else {
            bottomSheetRef.current.close()
            setModal('')
        }
    }

    const onHandleOpenImages = () => {
        setModalImages(true)
    }
    const onMarkerPressedHandler = () => {
        setModalImages(true)
    }
    const renderItem = data => (
        <View key={data} >
            <Image source={{ uri: data }} resizeMode="cover" style={{ width: width * .98, height: width * 0.7 }} />
        </View>
    );

    return <>



        <View className="flex-1 bg-white items-center justify-center">
            {modal === 'sidebar' && <Sidebar likedHandler={onOpenLikedFromSidebar} navigation={navigation} user={user} closeHandle={onCloseSidebar} userSettingsHandler={onUserSettingsFromSidebar} />}
            <BaseMap setAnimation={setAnimation} animation={animation} setPlaygroundsCount={setPlaygroundsCount} onHomeHandler={onHomeHandler} user={user} className="-z-20" onMarkerPressed={markerPressedHandler} searchResult={searchResult} />

            {playgroundsCount && <>
                <Animatable.View animation={animation} duration={350} className="position absolute top-[10vh]">
                    <View className=" flex-row justify-cente bg-white px-4 py-2 mt-5 left-0 w-auto rounded-full">
                        <Text className="text-center text-r">{playgroundsCount} playgrounds loaded</Text>
                    </View>
                </Animatable.View>
            </>}

            <Header setPlaygroundsCount={setPlaygroundsCount} handleToggleSidebar={handleToggleSidebar} onToggleFilter={onToggleFilter} handleCloseModals={onCloseModal} onHandleViewPlaygroundsFromCity={handleViewPlaygroundsFromCity} />
            <Footer likedHandler={onLiked} nearbyHandler={onNearby} createPlaygroundHandler={onCreatePlayground} homeHandler={onHome} />
            {modal === 'singlePlayground' && <BottomSheet
                backgroundStyle={{ backgroundColor: `${mainColor}` }}
                enablePanDownToClose
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChangesSingle}>
                <SinglePlayground className="z-[90] h-screen relative " closeHandle={onCloseModal} playground={currentMarker} setSinglePlaygroundImages={setSinglePlaygroundImages} onHandleOpenImages={onHandleOpenImages}></SinglePlayground>
            </BottomSheet>}
            {modalImages && <>
                <View className={`absolute w-full  h-full left-0 top-0 bg-black80 items-center justify-center`}>
                    <TouchableHighlight onPress={onCloseImages} className="absolute right-2 top-10 z-50 shadow-md shadow-black">
                        <Image source={WHITE_CLOSE} className="w-10 h-10" />
                    </TouchableHighlight>
                    <Carousel
                        pagination={PaginationLight}
                        renderItem={renderItem}
                        loop={true}
                        data={singlePlaygroundImages}
                    />
                </View>
            </>}
            {modal === 'searchFilter' && <>
                <BottomSheet
                    // style={{ backgroundColor: "transparent" }}
                    backgroundStyle={{ backgroundColor: `${mainColor}` }}
                    enablePanDownToClose
                    ref={bottomSheetRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChangesSingle}>
                    <AdvancedSearch setPlaygroundsCount={setPlaygroundsCount} className="z-[90] h-screen relative " closeHandle={onCloseModal} onHandleViewPlaygroundsFromCity={handleViewPlaygroundsFromCity} />
                </BottomSheet>

            </>}

            {modal === 'nearby' &&
                <BottomSheet
                    // style={{ width: '90%', marginLeft: '5%' }}
                    enablePanDownToClose
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPointsSmall}
                    onChange={handleSheetChangesSingle}>
                    <Nearby closeHandle={onCloseModal} playground={currentMarker} handleMarkerPressedHandler={markerPressedHandler}></Nearby>
                </BottomSheet>}

            {modal === 'liked' &&
                <BottomSheet
                    enablePanDownToClose
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPointsSmall}
                    onChange={handleSheetChangesSingle}>
                    <LikedList closeHandle={onCloseModal} playground={currentMarker} handleMarkerPressedHandler={markerPressedHandler}></LikedList>
                </BottomSheet>}

            {modal === 'createPlayground' &&
                <BottomSheet
                    enablePanDownToClose
                    ref={bottomSheetRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChangesCreate}>
                    <CreatePlayground closeHandle={onCloseAddPlayground} cancelAddPlayground={confirmCloseModal} />
                </BottomSheet>}

            {modal === 'userSettings' &&
                <BottomSheet
                    enablePanDownToClose
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    onChange={handleSheetChangesSingle}>
                    <UserSettings user={user} />
                </BottomSheet>}


            <StatusBar style="auto" />
            {welcomeMessageStorage && user && loadCurrentLocation && <WelcomeMessage user={user} handleCloseWelcomeMessage={onCloseWelcomeMessage} />}
        </View >
    </>
}