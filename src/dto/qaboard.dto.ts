import { QABoardEntity } from "src/entity/qaboard.entity";
import { ReplyDto } from "./reply.dto";

export class QABoardDto {
    constructor(
        readonly title: string,
        readonly contentText: string,
        readonly visited: number,
        readonly writerEmail: string,
        readonly writerName: string,
        readonly reply: ReplyDto[],
        readonly createdAt: Date,
        readonly productId?: number,
    ){}

    static fromEntity(entity: QABoardEntity) : QABoardDto {
        return {
            title: entity.title,
            contentText: entity.contentText,
            visited: entity.visited,
            writerEmail: entity.writerEmail,
            writerName: entity.writerName,
            reply: entity.reply.map(r => ReplyDto.fromEntity(r)),
            productId: entity.productId,
            createdAt: entity.createdAt,
        } as QABoardDto
    }

}