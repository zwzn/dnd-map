import { FunctionalComponent, h } from "preact";

export const Layout: FunctionalComponent = props => {
    return <div>
        {props.children}
    </div>
}