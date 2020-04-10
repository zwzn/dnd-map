
declare module "*.module.scss" {
    const styles: { [className: string]: string }
    export default styles;
}

interface Point {
    x: number;
    y: number;
}
