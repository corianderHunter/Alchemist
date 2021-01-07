
<template>
    <el-menu
        class="side-menu"
        :default-active="$route.path"
        background-color="#fff"
        text-color="#828CA2"
        router
    >
        <template v-for="item in menuList">
            <el-menu-item :key="item.menuId" :index="item.linkUrl">
                <i
                    :class="{
                        iconfont: true,
                        ['icon' + (item.icon || '')]: true,
                    }"
                ></i>
                <span slot="title">
                    {{ item.permName }}
                </span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script lang="ts">
import { MenuDTO } from "@/apis/menuGroup";
import { AuthorityType } from "@/const/authority";
import Vue from "vue";

export default Vue.extend({
    name: "sideMenu",
    computed: {
        menuList(): MenuDTO[] {
            return this.$store.state.authority.filter(
                (v: MenuDTO) => v.type === AuthorityType.PAGEWITHMENU
            );
        },
        defaultActive(): any {
            if (this.menuList.length) {
                const linkUrl = this.menuList[0].linkUrl;
                return linkUrl;
            } else {
                return "";
            }
        },
    },
    mounted() {},
    methods: {
        menuClick(v: MenuDTO) {
            this.$router.push({ path: v.linkUrl });
        },
    },
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable.scss";
.side-menu {
    height: 100%;
    border-right: none;
    box-shadow: $--secondary-box-shadow;

    /deep/ {
        .el-menu-item {
            font-size: 15px;
            color: #fff;
            padding-left: 25px !important;
            padding-right: 0 !important;
            text-align: left;
            line-height: 40px;
            height: 40px;
            &.is-active {
                background-color: $--color-primary !important;
                color: #fff !important;
            }
        }
        .iconfont {
            margin-right: 10px;
        }
    }
}
</style>
<style lang="scss">
@import "@/assets/style/variable.scss";
.side-menu {
    .el-menu-item.is-active {
        color: $--color-primary !important;
    }
}
</style>