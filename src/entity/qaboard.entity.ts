import { AssignQAProduct } from "./assign_qaproduct.entity"
import { ReplyEntity } from "./reply.entity"

export interface QABoardEntity {
    readonly id: number
    readonly title: string
    readonly contentText: string
    readonly answerState: String
    readonly writerEmail: string
    readonly writerName: string
    readonly reply: ReplyEntity[]
    readonly assignproduct?: AssignQAProduct
    readonly createdAt: Date
}