import { FunctionalComponent, h } from 'preact'
import { useState, useCallback, useReducer, useEffect } from 'preact/hooks'
import { PinchZoom } from '../components/pinch-zoom'
import styles from './game.module.scss'
import classNames from 'classnames'
import { Token, TokenC } from '../components/token'
import { getUser } from '../user'
import { connect, Connection } from '../room'

interface GameState {
    background: string;
    dm: string
    grid: {
        size: number;
        offset: Point;
        visible: boolean;
    };
    tokens: Token[];
}

interface Props {
    matches: {
        id: string
    }
}

let conn: Connection<GameState> | undefined

export const Game: FunctionalComponent<Props> = props => {
    const [game, setGame] = useState<GameState>({
        background: 'https://i.redd.it/7igkmw001p121.jpg',
        dm: getUser(),
        grid: {
            size: 50,
            offset: { x: 0, y: 0 },
            visible: true,
        },
        tokens: [
            {
                id: "1",
                position: { x: 7, y: 1 },
                image: "https://5e.tools/img/MM/Young%20Black%20Dragon.png?v=1.102.7",
                size: 4,
                user: getUser(),
            },
            {
                id: "2",
                position: { x: 1, y: 1 },
                image: "https://5e.tools/img/MM/Young%20Black%20Dragon.png?v=1.102.7",
                size: 3,
                user: '',
            },
            {
                id: "3",
                position: { x: 10, y: 6 },
                image: "https://5e.tools/img/MM/Young%20Black%20Dragon.png?v=1.102.7",
                size: 2,
                user: '',
            },
            {
                id: "4",
                position: { x: 13, y: 6 },
                image: "https://5e.tools/img/MM/Young%20Black%20Dragon.png?v=1.102.7",
                size: 1,
                user: '',
            },
        ],
    })

    useEffect(() => {
        connect<GameState>(props.matches.id).then(c => {
            c.onMessage(gs => setGame(gs))
            conn = c
        })

        return () => conn?.close()
    }, [props.matches.id])

    const changeGame = useCallback((setter: (oldState: GameState) => GameState) => {
        console.log('change', conn);

        setGame(oldState => {
            const newState = setter(oldState)
            conn?.send(newState)
            return newState
        })
    }, [setGame, conn])

    const tokenChange = useCallback((token: Token) => {
        changeGame(g => ({
            ...g,
            tokens: g.tokens.map(t => {
                if (t.id === token.id) {
                    return token
                }
                return t
            }),
        }))
    }, [changeGame])

    const [size, setSize] = useState({ x: 0, y: 0 })
    const backgroundLoad = useCallback((e: Event) => {
        const img = e.target as HTMLImageElement
        setSize({ x: img.width, y: img.height })
    }, [setSize])

    return <div
        class={styles.game}
        style={{
            '--grid-size': game.grid.size + 'px',
            '--grid-offset-x': game.grid.offset.x + 'px',
            '--grid-offset-y': game.grid.offset.y + 'px',
        }}
    >
        <PinchZoom class={styles.map}>
            <div>
                <img src={game.background} onLoad={backgroundLoad} />
                {game.grid.visible &&
                    <div
                        class={classNames({
                            [styles.grid]: true,
                        })}
                        style={{
                            width: size.x + 'px',
                            height: size.y + 'px',
                        }}
                    />}
                <div class={styles.tokens}>
                    {game.tokens.map(t => <TokenC key={t.id} token={t} onChange={tokenChange} />)}
                </div>
            </div>
        </PinchZoom>
        {/* <div class={styles.hud}>
            test
        </div> */}
    </div>
}
