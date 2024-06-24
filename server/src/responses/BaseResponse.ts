export default class BaseResponse {
    protected status: boolean

    constructor(protected code: number) {
        this.code = code
        this.status = code < 400
    }

    asJson() {
        return {
            status: this.status,
            code: this.code
        }
    }
}