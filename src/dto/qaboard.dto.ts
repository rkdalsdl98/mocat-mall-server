import { QABoardEntity } from "src/entity/qaboard.entity";
import { ReplyDto } from "./reply.dto";
import { AssignQAProduct } from "src/entity/assign_qaproduct.entity";

export class QABoardDto {
    constructor(
        readonly qaId: number,
        readonly title: string,
        readonly contentText: string,
        readonly answerState: string,
        readonly writerEmail: string,
        readonly writerName: string,
        readonly reply: ReplyDto[],
        readonly createdAt: Date,
        readonly assignProduct?: AssignQAProduct,
    ){}

    static fromEntity(entity: QABoardEntity) : QABoardDto {
        return {
            qaId: entity.id,
            title: entity.title,
            contentText: entity.contentText,
            answerState: entity.answerState,
            writerEmail: entity.writerEmail,
            writerName: entity.writerName,
            reply: entity.reply.map(r => ReplyDto.fromEntity(r)),
            assignProduct: entity.assignproduct,
            createdAt: entity.createdAt,
        } as QABoardDto
    }
}