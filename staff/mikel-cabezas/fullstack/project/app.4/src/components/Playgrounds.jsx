import { useEffect, useState, useContext } from "react"
import retrievePlaygrounds from "../logic/retrievePlaygrounds"
import Playground from "./Playground"
import { View } from "react-native"
import retrieveUser from "../logic/retrieveUser"

export default function Playgrounds({ onMarkerPressedHandler }) {
    const userId = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDk0ODAwM2JmMTJmMTNmNmIxY2I4NTIiLCJpYXQiOjE2ODk4NzM1NTksImV4cCI6MjU1Mzc4NzE1OX0.eyIACfSeGUU2PqPxjtMDISYb4agP5F700rCW_8eoulg"
    const [playgrounds, setPlaygrounds] = useState()
    const [user, setUser] = useState()

    useEffect(() => {
        console.log('Refresh Posts -> render in useEffect')
        try {
            console.log('   Show all Posts -> render in useEffect onLoad compo')
            retrievePlaygrounds(userId)
                .then(playgrounds => {
                    setPlaygrounds(playgrounds)
                })
                .catch(error => {
                    alert(error.message)
                })
            retrieveUser(userId)
                .then(user => setUser(user))
                .catch(error => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }, [])




    return <>
        {/* <View
            className="playgrounds" key={false}
        > */}
        {playgrounds && playgrounds.map(playground => {
            return <Playground
                key={playground.id}
                playground={playground}
                user={user}
                id
                title
                description
                onMarkerPressedHandler={onMarkerPressedHandler}
            />
        })}

        {/* </View> */}
    </>

}