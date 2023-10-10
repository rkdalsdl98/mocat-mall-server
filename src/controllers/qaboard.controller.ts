import { TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtDecorator } from "src/common/decorators/jwt.decorator";
import { ResponseFailedForm, TryCatch } from "src/common/form/response.form";
import { AuthJwtGuard } from "src/common/guards/auth.guard";
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
    async getBoards() : Promise<TryCatch<
    QABoardDto[]
    ,
    ResponseFailedForm>> {
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
    ) : Promise<TryCatch<
    | QABoardDto
    | null
    | undefined
    ,
    ResponseFailedForm>> {
        return await this.qaboardService.getQABoardBy({ boardId })
    }

    /**
     * 질문글 등록
     * 
     * @security bearer
     */
    @TypedRoute.Post()
    async createBoard(
        @TypedQuery() query: IQABoardQuery.IQABoardQueryCreateOptions
    ) : Promise<TryCatch<
    boolean
    ,
    ResponseFailedForm>> {
        return await this.qaboardService.createQABoard({ ...query })
    }

    /**
     * 질문글 수정
     * 
     * @security bearer
     */
    @TypedRoute.Patch()
    @UseGuards(AuthJwtGuard)
    async updateBoard(
        @JwtDecorator.GetTokenAndPayload() data : { payload: Object, token: string },
        @TypedQuery() query: IQABoardQuery.IQABoardQueryUpdateOtions
    ) : Promise<TryCatch<
    boolean
    ,
    ResponseFailedForm>> {
        if("type" in data.payload && "response" in data.payload) 
            return data.payload.response as ResponseFailedForm
        return await this.qaboardService.updateQABoardBy({
            title: query.title,
            contentText: query.contentText,
            productId: query.productId,
        }, { boardId: query.boardId }, data.payload)
    }

    /**
     * 질문글 삭제
     * 
     * @security bearer
     */
    @TypedRoute.Delete()
    @UseGuards(AuthJwtGuard)
    async deleteBoard(
        @JwtDecorator.GetTokenAndPayload() data : { payload: Object, token: string },
        @TypedQuery() query: IQABoardQuery
    ) : Promise<TryCatch<
    boolean
    ,
    ResponseFailedForm>> {
        if("type" in data.payload && "response" in data.payload) 
            return data.payload.response as ResponseFailedForm
        return await this.qaboardService.deleteQABoard({ boardId: query.boardId }, data.payload)
    }
}