import { FunctionComponent, h } from "preact"
import { useCallback, useState } from "preact/hooks"
import classNames from "classnames"
import styles from "./token.module.scss"

const root = document.documentElement
root.addEventListener("mousemove", e => {
    root.style.setProperty('--mouse-x', e.clientX + "px")
    root.style.setProperty('--mouse-y', e.clientY + "px")
})

export interface Token {
    id: string;
    position: Point;
    image: string;
    size: number;
}

interface TokenCProps {
    token: Token;
    onChange: (t: Token) => void;
}

export const TokenC: FunctionComponent<TokenCProps> = props => {
    const [selected, setSelected] = useState(false)
    const [moving, setMoving] = useState(false)

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
        setMoving(true)
    }, [setMoving])

    const endMove = useCallback((e: MouseEvent) => {
        e.stopPropagation()
        setMoving(false)
        // setSelected(false)

        const element = e.target as HTMLElement
        const s = getComputedStyle(element)
        const x = Number(s.getPropertyValue('--x').slice(0, -2))
        const y = Number(s.getPropertyValue('--y').slice(0, -2))
        const gridSize = Number(s.getPropertyValue('--grid-size').slice(0, -2))
        const scale = Number(s.getPropertyValue('--scale'))

        props.onChange({
            ...props.token,
            position: {
                x: Math.round((((e.x - x) / scale) / gridSize - props.token.size / 2)),
                y: Math.round((((e.y - y) / scale) / gridSize - props.token.size / 2)),
            },
        })
    }, [props, setSelected, setMoving])

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

        {moving &&
            <img class={styles.shadow} src={props.token.image} onClick={endMove} />}
    </div>
}