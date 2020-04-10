import { h, FunctionalComponent } from 'preact'
import 'pinch-zoom-element'

interface Props {
    class?: string;
}

export const PinchZoom: FunctionalComponent<Props> = props => h('pinch-zoom', props, props.children)
