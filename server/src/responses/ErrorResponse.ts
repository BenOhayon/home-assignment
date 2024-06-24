import BaseResponse from "./BaseResponse"

export default class ErrorResponse extends BaseResponse {
    constructor(protected code: number, private error: string) {
        super(code)
        this.error = error
    }

    asJson() {
        return {
            ...super.asJson(),
            error: this.error
        }
    }
}