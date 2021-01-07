import { AccountDTO, MenuDTO } from '@/apis/accountGroup'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface StoreType {
  mainFetching: boolean;
  authority: MenuDTO[];
  userInfo: AccountDTO;
  firstReady: boolean;//这个转态用来标记  用户登录后 获取自己的信息的接口已调用完成  权限信息个人信息已就位
}

export default new Vuex.Store<StoreType>({
  state: {
    mainFetching: false,
    authority: [],
    userInfo: {},
    firstReady: false
  },
  mutations: {
    setMainFetching(state, v) {
      state.mainFetching = v
    },
    setAuthority(state, v) {
      state.authority = v
    },
    setUserInfo(state, v) {
      state.userInfo = v
    },
    setFirstReady(state, v) {
      state.firstReady = v
    }
  },
  actions: {
  },
  modules: {
  }
})
