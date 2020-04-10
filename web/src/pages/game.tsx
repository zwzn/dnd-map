import { FunctionalComponent, h, FunctionComponent } from 'preact'
import { useState, useCallback } from 'preact/hooks'
import { Layout } from '../components/layout'
import { PinchZoom } from '../components/pinch-zoom'
import styles from './game.module.scss'
import { bind } from '@zwzn/spicy'
import classNames from 'classnames'

interface Point {
    x: number;
    y: number;
}

interface Token {
    id: string
    position: Point;
    image: string
    size: number
}

interface Game {
    background: string;
    grid: {
        size: number;
        offset: Point;
    };
    tokens: Token[]
}

export const Game: FunctionalComponent = props => {
    // console.log(props);

    const [game, setGame] = useState<Game>({
        background: 'https://i.redd.it/7igkmw001p121.jpg',
        grid: {
            size: 50,
            offset: { x: 0, y: 0 },
        },
        tokens: [
            {
                id: "1",
                position: { x: 7, y: 1 },
                image: "https://5e.tools/img/MM/Young%20Black%20Dragon.png?v=1.102.7",
                size: 4,
            },
            {
                id: "2",
                position: { x: 1, y: 1 },
                image: "https://5e.tools/img/MM/Young%20Black%20Dragon.png?v=1.102.7",
                size: 3,
            },
            {
                id: "3",
                position: { x: 10, y: 6 },
                image: "https://5e.tools/img/MM/Young%20Black%20Dragon.png?v=1.102.7",
                size: 2,
            },
            {
                id: "4",
                position: { x: 13, y: 6 },
                image: "https://5e.tools/img/MM/Young%20Black%20Dragon.png?v=1.102.7",
                size: 1,
            },
        ],
    })

    const tokenChange = useCallback((token: Token) => {
        console.log(token);

        setGame(g => ({
            ...g,
            tokens: g.tokens.map(t => {
                if (t.id === token.id) {
                    return token
                }
                return t
            })
        }))
    }, [setGame])

    return <div
        class={styles.game}
        style={{
            '--grid-size': game.grid.size + 'px',
            '--grid-offset-x': game.grid.offset.x + 'px',
            '--grid-offset-y': game.grid.offset.y + 'px',
        }}
    >
        <PinchZoom class={styles.map}>
            <img src={game.background} />
            <div
                class={classNames({
                    [styles.grid]: true,
                })}
            />
            <div class={styles.tokens}>
                {game.tokens.map(t => <TokenC token={t} onChange={tokenChange} />)}
            </div>
        </PinchZoom>
        {/* <div class={styles.hud}>
            test
        </div> */}
    </div>
}

interface TokenCProps {
    token: Token;
    onChange: (t: Token) => void;
    onStartMove: (t: Token) => void;
}

const TokenC: FunctionComponent<TokenCProps> = props => {
    const [selected, setSelected] = useState(false)

    const openMenu = useCallback((e: MouseEvent) => {
        e.stopPropagation()
        setSelected(true)
    }, [setSelected])
    const closeMenu = useCallback((e: MouseEvent) => {
        e.stopPropagation()
        setSelected(false)
    }, [setSelected])

    const startMove = useCallback((e: MouseEvent) => {
        e.stopPropagation()
    }, [props.token, setSelected])

    return <div
        class={classNames(styles.token, { [styles.open]: selected })}
        style={{
            '--token-x': props.token.position.x,
            '--token-y': props.token.position.y,
            '--token-size': props.token.size,
        }}
        onClick={openMenu}
    >
        <div class={styles.menu}>
            <button onClick={closeMenu}>×</button>
            <button onClick={startMove}>M</button>
            <button>T</button>
        </div>
        <img class={styles.image} src={props.token.image} />
    </div>
}