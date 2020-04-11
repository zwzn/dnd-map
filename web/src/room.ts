
export class Connection<T> {

    constructor(
        private readonly ws: WebSocket
    ) { }

    public send(data: T) {
        this.ws.send(JSON.stringify(data))
    }

    onMessage(cb: (data: T) => void): () => void {
        const message = (e: MessageEvent) => {
            cb(JSON.parse(e.data))
        }
        this.ws.addEventListener('message', message)

        return () => this.ws.removeEventListener('message', message)
    }

    public close() {
        this.ws.close()
    }
}

export function connect<T>(id: string): Promise<Connection<T>> {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(location.origin.replace('http', 'ws') + '/room/' + id)
        const open = () => {
            ws.removeEventListener('open', open)
            resolve(new Connection(ws))
        }
        ws.addEventListener('open', open)
    })
}