import { TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { QABoardDto } from "src/dto/qaboard.dto";
import { IQABoardQuery } from "src/query/iqaboard.query";
import { QABoardService } from "src/services/qaboard.service";

@Controller("qaboard")
@ApiTags("질문글")
export class QABoardController {
    constructor(
        private readonly qaboardService: QABoardService
    ){}
    
    // 페이징 형식으로 불러오도록 만들어야 함
    /**
     * 질문글 리스트 불러오기
     * 
     * @returns 질문글 리스트
     */
    @TypedRoute.Get()
    async getBoards() : Promise<QABoardDto[] | undefined> {
        return await this.qaboardService.getQABoards()
    }

    /**
     * 질문글 불러오기
     * 
     * @returns 질문글
     */
    @TypedRoute.Get("/:boardId")
    async getBoardBy(
        @TypedParam("boardId") boardId : number
    ) : Promise<QABoardDto | null | undefined> {
        return await this.qaboardService.getQABoardBy({ boardId })
    }

    /**
     * 질문글 등록
     * 
     * @security bearer
     */
    @TypedRoute.Post()
    async createBoard(
        @TypedQuery() query: IQABoardQuery
    ) : Promise<void> {
        return 
    }

    /**
     * 질문글 수정
     * 
     * @security bearer
     */
    @TypedRoute.Patch()
    async updateBoard(
        @TypedQuery() query: IQABoardQuery.IQABoardQueryUpdateOtions
    ) : Promise<void> {
        return await this.qaboardService.updateQABoardBy({
            title: query.title,
            contentText: query.contentText,
            productId: query.productId,
        }, { boardId: query.boardId })
    }

    /**
     * 질문글 삭제
     * 
     * @security bearer
     */
    @TypedRoute.Delete()
    async deleteBoard(
        @TypedQuery() query: IQABoardQuery
    ) : Promise<void> {
        return await this.qaboardService.deleteQABoard({ boardId: query.boardId })
    }
}