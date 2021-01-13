export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;
export interface AuthorityScheme {
    id: string | number;
    parentId?: string | number;
    component: string;
    path: string;
    name: string;
    action?: any[];
    meta?: {
        isMenu?: boolean;
        icon?: string;
        label?: string;
        isWhiteList?: boolean;
        isBlackList?: boolean;
    };
}

export interface AuthorityTreeScheme extends AuthorityScheme {
    children?: AuthorityScheme[];
}

export interface FetchConfigType {
    urls: {
        [p in string]: string;
    };
    timeout: number;
}


export type FunctionType = (...args: any) => any;


export enum EventBusName {
    FRESHUSERINFO = "FRESHUSERINFO"
}

declare module "vue/types/vue" {
    interface Vue {
        $eventBus: {
            $on: (type: EventBusName, ...args: any) => any;
            $emit: (type: EventBusName, ...args: any) => any;
        };
    }
}
