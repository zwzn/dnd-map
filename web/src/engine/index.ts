
interface Point {
    x: number
    y: number
}

class State {

    public get width(): number {
        return this.canvas.width
    }
    public get height(): number {
        return this.canvas.height
    }

    private zoom = 1
    private _offset: Point = { x: 0, y: 0 }
    public get offset(): Point {
        if (!this.mouseDown) {
            return this._offset
        }
        console.log('test');

        return {
            x: this._offset.x - (this.mouseDown.x - this.mouse.x),
            y: this._offset.y - (this.mouseDown.y - this.mouse.y),
        };
    }
    public set offset(v: Point) {
        this._offset = v;
    }

    private mouse: Point = { x: 0, y: 0 }
    private mouseDown: Point | undefined

    constructor(
        public readonly ctx: CanvasRenderingContext2D,
        private readonly canvas: HTMLCanvasElement,
    ) {
        window.addEventListener('resize', this.setSize)

        canvas.addEventListener('wheel', e => {
            if (e.deltaY < 0) {
                this.zoom *= 1.2
            } else {
                this.zoom /= 1.2
            }
        })

        canvas.addEventListener('mousemove', e => {
            this.mouse.x = e.x
            this.mouse.y = e.y
        })
        canvas.addEventListener('mousedown', e => {
            this.mouseDown = {
                x: e.x,
                y: e.y,
            }
        })
        canvas.addEventListener('mouseup', e => {
            this.offset = this.offset
            this.mouseDown = undefined
        })

        this.setSize()
    }

    public close() {
        window.removeEventListener('resize', this.setSize)
    }

    public render() {
        this.drawImage(img, 0, 0)

        this.drawGrid()
    }

    private drawImage(img: HTMLImageElement, x: number, y: number) {
        this.ctx.drawImage(img, x + this.offset.x, y + this.offset.y, img.width * this.zoom, img.height * this.zoom)
    }

    private drawGrid() {

        const gridSize = 50 * this.zoom

        this.ctx.beginPath()
        for (let i = this.offset.x % 50; i < this.width; i += gridSize) {
            this.ctx.moveTo(i, 0)
            this.ctx.lineTo(i, this.height)
        }
        for (let i = this.offset.y % 50; i < this.height; i += gridSize) {
            this.ctx.moveTo(0, i)
            this.ctx.lineTo(this.width, i)
        }
        this.ctx.stroke()
    }

    private setSize = () => {
        const rect = this.canvas.getBoundingClientRect()
        this.canvas.width = rect.width
        this.canvas.height = rect.height
    }
}

export function start(canvas: HTMLCanvasElement): () => void {


    const ctx = canvas.getContext('2d')

    if (ctx === null) {
        throw new Error('canvas failed to create context')
    }
    const s = new State(ctx, canvas)
    const tickWrap = () => {

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        s.render()

        requestAnimationFrame(tickWrap)
    }
    tickWrap()
    return () => s.close()
}

const img = new Image()
img.src = 'https://i.imgur.com/NtjS3tF.jpg'
