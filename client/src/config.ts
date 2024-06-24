import { ENVS, EnvConfig } from "./types"

const debug = {
    baseUrl: "http://localhost:3000"
}

function environment(): EnvConfig {
    const currentEnv = import.meta.env.VITE_ENV

    switch (currentEnv) {
        case ENVS.DEBUG: return debug
    }

    return {
        baseUrl: ""
    }
}

export default {
    environment
}