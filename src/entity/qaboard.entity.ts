import { ReplyEntity } from "./reply.entity"

export interface QABoardEntity {
    readonly id: number
    readonly title: string
    readonly contentText: string
    readonly productId?: number
    readonly visited: number
    readonly writerEmail: string
    readonly writerName: string
    readonly reply: ReplyEntity[]
    readonly userId: number
    readonly createdAt: Date
    readonly updatedAt: Date
}