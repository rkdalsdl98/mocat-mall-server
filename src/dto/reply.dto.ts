import { ReplyEntity } from "src/entity/reply.entity";

export class ReplyDto {
    constructor(
        readonly contentText: string,
        readonly writerEmail: string,
        readonly writerName: string,
    ){}

    static fromEntity(entity: ReplyEntity) : ReplyDto {
        return {
            contentText: entity.contentText,
            writerEmail: entity.writerEmail,
            writerName: entity.writerName,
        } as ReplyDto
    }
}