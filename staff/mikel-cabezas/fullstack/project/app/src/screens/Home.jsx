import { View, StatusBar, Text } from 'react-native';
import { useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import AppContext from "../AppContext.js";
const { Provider } = AppContext
import Context from '../AppContext.js'

import * as Animatable from 'react-native-animatable';
import BottomSheet from '@gorhom/bottom-sheet';

import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BaseMap from '../components/Playgrounds/BaseMap';
import Nearby from '../components/Playgrounds/Nearby.jsx';
import SinglePlayground from '../components/Playgrounds/SinglePlayground.jsx';
import CreatePlayground from '../components/Playgrounds/AddPlayground.jsx';

export default function Home({ }) {
    const { modal, setModal, colorScheme, animation, setAnimation, currentView, setCurrentView } = useContext(Context)
    const [currentMarker, setCurrentMarker] = useState({})

    const bottomSheetRef = useRef();
    const snapPoints = useMemo(() => ['90%', '95%'], []);
    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            setModal('')
            setCurrentView('')
        }
        console.log('handleSheetChanges', index);
    }, []);

    const onHome = () => {
        setModal('')
    }
    const onNearby = () => {
        setModal('nearby')
    }
    const onCreatePlayground = () => {
        setModal('createPlayground')
    }
    const onCloseModal = () => {
        setAnimation('fadeOutDown')
        setTimeout(() => {
            setModal()
            setAnimation()
        }, 300)
        setModal('')
    }
    const onCancelAddPlayground = () => bottomSheetRef.current.close()
    const markerPressedHandler = props => {
        // const playground = currentMarker
        setModal('singlePlayground')
    }
    const onCloseSidebar = () => {
        setTimeout(() => {
            setModal()
        }, 300)
    }

    return <>
        <View className="flex-1 bg-white items-center justify-center">
            {modal === 'sidebar' && <Sidebar closeHandle={onCloseSidebar} />}
            <BaseMap className="-z-20" onMarkerPressed={markerPressedHandler} />
            <Header />
            <Footer nearbyHandler={onNearby} createPlaygroundHandler={onCreatePlayground} homeHandler={onHome} />
            {modal === 'singlePlayground' && <Animatable.View animation={animation} duration={250} className="w-full absolute bottom-0" ><SinglePlayground className="z-[90]" closeHandle={onCloseModal} park={currentMarker}></SinglePlayground></Animatable.View>}
            {modal === 'nearby' && <Animatable.View animation={animation} duration={250} className="w-full absolute bottom-0 z-50" ><Nearby closeHandle={onCloseModal} park={currentMarker}></Nearby></Animatable.View>}
            {modal === 'createPlayground' &&
                <BottomSheet
                    enablePanDownToClose
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}>
                    <CreatePlayground closeHandle={onCloseModal} cancelAddPlayground={onCancelAddPlayground} />
                </BottomSheet>
            }
            <StatusBar style="auto" />
        </View >
    </>
}