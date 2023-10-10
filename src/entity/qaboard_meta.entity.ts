import { AssignQAProduct } from "./assign_qaproduct.entity"

export interface QABoardMetaEntity {
    readonly boardId: number
    readonly title: string
    readonly contentText: string
    readonly answerState: string
    readonly assignProduct?: AssignQAProduct
    readonly createdAt: Date
}