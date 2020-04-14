export function nextEvent(target: EventTarget, type: string): Promise<Event> {
    return new Promise(resolve => {
        const onEvent = (e: Event): void => {
            target.removeEventListener(type, onEvent)
            resolve(e)
        }
        target.addEventListener(type, onEvent)
    })
}