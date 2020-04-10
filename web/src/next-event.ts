export function nextEvent(target: EventTarget, type: string): Promise<Event> {
    return new Promise((resolve, reject) => {
        const onEvent = (e: Event) => {
            target.removeEventListener(type, onEvent)
            resolve(e)
        }
        target.addEventListener(type, onEvent)
    })
}