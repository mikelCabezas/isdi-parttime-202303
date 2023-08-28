import { useEffect, useState, useContext } from "react"
import Playground from "./Playground"
import { View } from "react-native"

export default function Playgrounds({ onMarkerPressedHandler, playgrounds, user }) {

    return <>
        {/* <View
            className="playgrounds" key={false}
        > */}
        {playgrounds && playgrounds[0].map(playground => {
            return <Playground
                key={playground._id}
                playground={playground}
                user={user}
                id={playground._id}
                title={playground.title}
                description={playground.description}
                onMarkerPressedHandler={onMarkerPressedHandler}
            />
        })}

        {/* </View> */}
    </>

}