import { HTTPMethod } from "../types"

// convert this to async/await
function request(method: HTTPMethod, url: string, options: RequestInit): Promise<any> {
    const requestOptions = {
        method,
        ...options
    }
    return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
            .then(rawRes => rawRes.json())
            .then(response => {
                if (response?.status) {
                    resolve(response?.data)
                } else {
                    reject(response?.error)
                }
            })
            .catch(reject)
    })
}

export function requestGet(url: string, options: RequestInit = {}): Promise<any> {
    return request(HTTPMethod.GET, url, options)
}

export function requestPost(url: string, options: RequestInit = {}): Promise<any> {
    return request(HTTPMethod.POST, url, options)
}

export function requestPut(url: string, options: RequestInit = {}): Promise<any> {
    return request(HTTPMethod.PUT, url, options)
}

export function requestDelete(url: string, options: RequestInit = {}): Promise<any> {
    return request(HTTPMethod.DELETE, url, options)
}