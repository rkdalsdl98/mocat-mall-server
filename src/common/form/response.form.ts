export type ResponseForm<T> = {
    readonly statuscode: number
    readonly data: T
}

export type ResponseFailedForm = {
    readonly statuscode: number
    readonly data: null
    readonly message: string
}

export const ERROR: Record<string, ResponseFailedForm> = {
    "NonAuthoritativeInformation": { statuscode: 203, data: null, message: "입력한 정보가 맞는지 한번 더 확인해주세요." },
    "NotFoundData": { statuscode: 204, data: null, message: "요청한 자료를 찾을 수 없습니다." },
    "BadRequest": { statuscode: 400, data: null, message: "잘못된 요청 입니다." },
    "UnAuthorized": { statuscode: 401, data: null, message: "유효하지 않은 토큰 입니다." },
    "Forbidden": { statuscode: 403, data: null, message: "서버에 의해 요청이 차단 되었습니다." },
    "NotFound": { statuscode: 404, data: null, message: "요청 페이지를 찾을 수 없습니다." },
    "MethodNotAllowd": { statuscode: 405, data: null, message: "허용되지 않은 메소드 입니다." },
    "RequestTimeOut": { statuscode: 408, data: null, message: "서버에 요청시간이 만료 되었습니다." },
    "Conflict": { statuscode: 409, data: null, message: "중복된 요청 혹은 연속된 요청으로 해당 요청이 취소 되었습니다." },
    "TooManyRequests": { statuscode: 429, data: null, message: "과도한 요청으로 인해 요청이 취소 되었습니다." },
    "BadGateway": { statuscode: 502, data: null, message: "유효한 요청페이지가 아닙니다." },
    "ExpiredToken": { statuscode: 2003, data: null, message: "토큰의 유효기간이 만료되었습니다." },
    "ServerDatabaseError": { statuscode: 5000, data: null, message: "서버에 상태가 불안정해 정보를 가져올 수 없습니다." },
    "ServerCacheError": { statuscode: 5001, data: null, message: "서버에 상태가 불안정해 정보를 가져올 수 없습니다." },
    "FailedSendMail": { statuscode: 5001, data: null, message: "서버에 상태가 불안정해 메일전송에 실패했습니다." },
}

export type ErrorType = keyof typeof ERROR
export type ErrorForm = (typeof ERROR)[ErrorType]
export type TryCatch<T, E extends ErrorForm> = ResponseForm<T> | E