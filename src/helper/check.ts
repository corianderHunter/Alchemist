import { FunctionType } from "@/types";

type CheckFnType = (state: string, ...args: any[]) => any
type FirstParameters<T extends CheckFnType> = T extends (f: string, ...args: infer P) => any ? P : never;

export const formCheckWrapper = <T extends CheckFnType>(checkFunction: T, ...args: FirstParameters<T>) => (rule: any, value: string, callback: FunctionType) => {
    const checkResult = checkFunction(value, ...args);
    if (checkResult) {
        callback(checkResult)
        return
    }
    callback()
}

//校验正整数
export const positiveInteger = (value: string, max: number = Infinity): null | string => {
    const reg = /^[1-9]\d*$/;
    if (reg.test(value) && Number(value) < Infinity) {
        return null
    }
    return `请输入${max === Infinity ? '' : '小于' + max + '的'} 正整数`
}

// 数值范围
export const integerRange = (value: string, min: number, max: number,) => {
    if (value === '') return null
    if (Number(value) < min || Number(value) > max) {
        return `请输入${min}-${max}之间的数值`
    }
    return null
}

// 数值范围 带 特殊值
export const integerRangeWithSpecialValue = (value: string, min: number, max: number, values: any[]) => {
    if (value === '' || values.includes(value)) return null
    if (Number(value) < min || Number(value) > max) {
        return `请输入${min}-${max}之间的数值`
    }
    return null
}