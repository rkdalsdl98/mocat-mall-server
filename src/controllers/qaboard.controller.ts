import { TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { QABoardDto } from "src/dto/qaboard.dto";
import { QABoardService } from "src/services/qaboard.service";

@Controller("user/qaboard")
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
    async getBoards() : Promise<void> {
        return
    }

    /**
     * 질문글 등록
     */
    @TypedRoute.Post()
    async createBoard() : Promise<void> {
        return
    }

    /**
     * 질문글 수정
     */
    @TypedRoute.Patch()
    async updateBoard() : Promise<void> {
        return
    }

    /**
     * 질문글 삭제
     */
    @TypedRoute.Delete()
    async deleteBoard() : Promise<void> {
        return
    }
}