import { FetchConfigType } from "@/types";


export const fetchConfig: FetchConfigType = {
    urls: {
        base: process.env.VUE_APP_BASE_API + '/some-route-name',
    },
    timeout: 10000,
};
