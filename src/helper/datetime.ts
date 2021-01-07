import dayjs from 'dayjs'


const formatString = 'YYYY-MM-DD HH:mm:ss'

export const formatDateTime = (v: any, format = formatString) => dayjs(v).format(format)