
import Vue from '*.vue';
import store from '@/store';
import { NavigationGuardNext, Route } from 'vue-router';
import router, { routes } from './index';

const whitelistRoutes = [...routes.filter(v => v.name !== 'Index').map(v => v.path), '/notAuth', '/404']


router.beforeEach((to: Route,
    from: Route,
    next: NavigationGuardNext<Vue>) => {
    if (to.matched.length !== 0) {
        //白名单
        if (whitelistRoutes.includes(to.fullPath)) {
            return next()
        }
        //初始化信息加载完毕前  不进行权限校验
        if (!store.state.firstReady) {
            return next()
        }
        //路由默认跳转到第一个菜单页面
        if (to.name === 'Index' && store.state.authority.length) {
            const defaultMenu = store.state.authority[0] || {};
            return next({ path: defaultMenu.linkUrl });
        }
        //检查路由权限, 目前 /a 可以 让/a/* 通过校验
        const pageRoutes = store.state.authority.filter(v => !!v.linkUrl).map(v => v.linkUrl)
        for (const link of pageRoutes) {
            const regx = new RegExp(link || '$$$$$')
            if (regx.test(to.path)) {
                return next()
            }
        }
        return next({ name: 'Not-Auth' })
    } else {
        return next({ name: '404' })
    }
})

router.onError((error: any) => {
    console.log(error)
})