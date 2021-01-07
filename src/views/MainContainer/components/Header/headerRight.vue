
<template>
    <div class="header-right">
        <i class="iconfont iconweibiaoti1"
            ><span class="name">{{ $store.state.userInfo.loginName }}</span></i
        >
        <el-button type="text" @click="logout">退出</el-button>
    </div>
</template>
<script lang="ts">
import { clearToken } from "@/helper/token";
import Vue from "vue";
export default Vue.extend({
    methods: {
        async logout() {
            this.$confirm("确认注销登录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                // this.$api.accountGroups.DefaultApi.api.
                clearToken();
                this.$store.commit("setAuthority", []);
                this.$store.commit("setFirstReady", false);
                this.$store.commit("setUserInfo", {});
                this.$router.push({ name: "Login" });
            });
        },
    },
});
</script>
<style lang="scss" scoped>
.header-right {
    float: right;
    .iconfont {
        font-size: 16px;
        color: #fff;
        margin-right: 8px;
    }
    .el-button {
        color: #fff;
    }
}
.name {
    margin-left: 5px;
}
</style>
