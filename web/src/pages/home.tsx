import { FunctionalComponent, h } from "preact"
import { Layout } from "../components/layout"
import { v4 as uuidv4 } from 'uuid'
import { getUser } from "../user"

export const Home: FunctionalComponent = () => {
    return <Layout>
        <h1>Home</h1>

        <a href={`/game/${getUser()}/${uuidv4()}`}>New Game</a>
    </Layout>
}