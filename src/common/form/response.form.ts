export type ResponseForm<T> = {
    readonly statuscode: number
    readonly data: T
}

export type ResponseFailedForm = {
    readonly statuscode: number
    readonly message: string
}

export const ERROR: Record<string, ResponseFailedForm> = {
    "NotFoundData": { statuscode: 204, message: "요청한 자료를 찾을 수 없습니다." },
    "BadRequest": { statuscode: 400, message: "잘못된 요청 입니다." },
    "Unauthorized": { statuscode: 401, message: "유효하지 않은 토큰 입니다." },
    "Forbidden": { statuscode: 403, message: "서버에 의해 요청이 차단 되었습니다." },
    "NotFound": { statuscode: 404, message: "요청 페이지를 찾을 수 없습니다." },
    "MethodNotAllowd": { statuscode: 405, message: "허용되지 않은 메소드 입니다." },
    "RequestTimeOut": { statuscode: 408, message: "서버에 요청시간이 만료 되었습니다." },
    "Conflict": { statuscode: 409, message: "중복된 요청 혹은 연속된 요청으로 해당 요청이 취소 되었습니다." },
    "TooManyRequests": { statuscode: 429, message: "과도한 요청으로 인해 요청이 취소 되었습니다." },
    "BadGateway": { statuscode: 502, message: "유효한 요청페이지가 아닙니다." },
    "ServerDatabaseError": { statuscode: 1000, message: "서버에 상태가 불안정해 정보를 가져올 수 없습니다." },
    "ServerCacheError": { statuscode: 1001, message: "서버에 상태가 불안정해 정보를 가져올 수 없습니다." },
}

export type ErrorType = keyof typeof ERROR
export type ErrorForm = (typeof ERROR)[ErrorType]
export type TryCatch<T, E extends ErrorForm> = ResponseForm<T> | E