import Playground from "./Playground"

export default function Playgrounds({ onMarkerPressedHandler, playgrounds, user }) {
    return <>
        {playgrounds && playgrounds[0].map(playground => {
            if (playground.visibility === 'public') {
                return <Playground
                    key={playground._id}
                    playground={playground}
                    user={user}
                    id={playground._id}
                    title={playground.title}
                    description={playground.description}
                    onMarkerPressedHandler={onMarkerPressedHandler}
                />
            }
        })}
    </>
}