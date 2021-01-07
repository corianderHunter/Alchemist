
<template>
    <el-container class="main-container">
        <Header />
        <el-container>
            <el-aside
                width="100px"
                v-loading="userInfoLoading"
                element-loading-background="rgba(0, 0, 0, 0.2)"
            >
                <SideMenu></SideMenu>
            </el-aside>
            <el-main
                ><router-view
                    v-loading="fetchingStatus || userInfoLoading"
                    element-loading-text="网络请求中..."
                    element-loading-background="rgba(0, 0, 0, 0.2)"
                    v-if="firstReady"
                ></router-view
            ></el-main>
        </el-container>
        <el-footer :height="'30px'">V{{ version }}</el-footer>
    </el-container>
</template>
<script lang="ts">
import Vue from "vue";
import SideMenu from "./components/sideMenu.vue";
import Header from "./components/Header/index.vue";
import packageInfo from "../../../package.json";
import { EventBusName } from "@/types";
import store from "@/store";
const { "agri-version": version } = packageInfo;
export default Vue.extend({
    data() {
        return {
            version,
            userInfoLoading: false,
        };
    },
    computed: {
        fetchingStatus() {
            return this.$store.state.mainFetching;
        },
        firstReady() {
            return this.$store.state.firstReady;
        },
    },
    components: { SideMenu, Header },
    mounted() {
        this.getUserInfo();
        this.$eventBus.$on(EventBusName.FRESHUSERINFO, () => {
            this.getUserInfo();
        });
    },
    methods: {
        async getUserInfo() {
            this.userInfoLoading = true;
            try {
                const {
                    data,
                } = await this.$api.accountGroups.DefaultApi.api.getAccountByTokenUsingPOST();

                const { menuList = [] } = data || {};
                this.$store.commit("setUserInfo", data);
                this.$store.commit(
                    "setAuthority",
                    menuList.sort((a: any, b: any) => a.orderNum - b.orderNum)
                );

                if (!this.firstReady) {
                    this.$store.commit("setFirstReady", true);
                }
                if (this.$route.name === "Index") {
                    const defaultMenu = store.state.authority[0] || {};
                    return this.$router.push({ path: defaultMenu.linkUrl });
                }
            } finally {
                this.userInfoLoading = false;
            }
        },
    },
});
</script>
<style lang="scss" scoped>
@import "@/assets/style/variable.scss";
.main-container {
    height: 100%;
    min-width: 1500px;
    .el-container {
        height: calc(100% - 110px);
    }
}
.el-footer {
    line-height: 30px;
    text-align: center;
    color: #383838;
    font-size: 12px;
    box-shadow: $--secondary-box-shadow;
    z-index: 99;
}

.el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
    height: calc(100% - 2px);
    margin-top: 2px;
}

.el-main {
    background-color: #fbf9f9;
    color: #333;
    text-align: center;

    & > div {
        background-color: #fff;
        padding: 20px;
        min-height: calc(100% - 40px);
        box-shadow: $--common-box-shadow;
        border-radius: 8px;
    }
}
</style>