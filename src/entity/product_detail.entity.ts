export interface ProductDetailEntity {
    readonly id: number
    readonly productId: number
    readonly colors: string[]
    readonly sizes: string[]
    readonly images: string[]
    readonly description: string
}