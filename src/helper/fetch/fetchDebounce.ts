

import { AxiosRequestConfig } from "axios";
import { get, isEqual } from "lodash";

//fetch debounce功能 防止过剩调用
export const ABANDON_MARK = Symbol();
const cachePool = new Map();
const fetchDebounceTime = 300;

const comparePaths = ['data', 'headers.Content-Type', 'method', 'params'];

const getCacheContent = (config: AxiosRequestConfig) => comparePaths.reduce((s: any, v: any) => {
    s[v] = get(config, v);
    return s;
}, {});

export const isOverCallRequest = (config: AxiosRequestConfig): boolean => {
    const url: any = config.url || ''
    if (!url) return true;
    if (cachePool.has(url)) {
        const currentContent = getCacheContent(config);
        const cacheContent = cachePool.get(url);
        const equalValue = isEqual(currentContent, cacheContent);
        if (equalValue) {
            return true;
        }
    }
    const cacheContent = getCacheContent(config);
    cachePool.set(url, cacheContent)
    setTimeout(() => {
        cachePool.delete(url);
    }, fetchDebounceTime)
    return false;
}