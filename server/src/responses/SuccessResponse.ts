import BaseResponse from "./BaseResponse"

export default class SuccessResponse extends BaseResponse {
    constructor(protected code: number, private data: any) {
        super(code)
        this.data = data
    }

    asJson() {
        return {
            ...super.asJson(),
            data: this.data
        }
    }
}