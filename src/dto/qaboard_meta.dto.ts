import { QABoardMetaEntity } from "src/entity/qaboard_meta.entity";

export class QABoardMetaDto {
    constructor(
        readonly boardId: number,
        readonly title: string,
        readonly contentText: string,
        readonly visited: number,
        readonly createdAt: Date,
    ){}

    // 추후 엔티티에 변동사항이 생기면 다른 방식으로 리턴 해줘야 함
    // 현재는 엔티티와 Dto가 가지는 파라미터가 동일
    static fromEntity(entity: QABoardMetaEntity) : QABoardMetaDto {
        return entity as QABoardMetaDto
    }
}