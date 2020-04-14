export class Connection<T> {

    constructor(
        private readonly ws: WebSocket
    ) { }

    public send(data: T): void {
        this.ws.send(JSON.stringify(data))
    }

    onMessage(cb: (data: T) => void): () => void {
        const message = (e: MessageEvent): void => cb(JSON.parse(e.data))

        this.ws.addEventListener('message', message)

        return () => this.ws.removeEventListener('message', message)
    }

    public close(): void {
        this.ws.close()
    }
}

export function connect<T>(dm: string, id: string): Promise<Connection<T>> {
    return new Promise(resolve => {
        const ws = new WebSocket(location.origin.replace('http', 'ws') + `/room/${dm}/${id}`)
        const open = (): void => {
            ws.removeEventListener('open', open)
            resolve(new Connection(ws))
        }
        ws.addEventListener('open', open)
    })
}