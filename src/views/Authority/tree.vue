
<template>
    <div class="authority-tree">
        <div class="container-header">
            <div class="container-header-left"></div>
            <div class="container-header-right">
                <template v-if="!isSorting">
                    <el-button type="primary" @click="goAdd"
                        >新建权限</el-button
                    >
                    <el-button type="primary" @click="isSorting = true"
                        >菜单排序</el-button
                    >
                </template>
                <template v-else>
                    <el-button type="primary" @click="isSorting = false"
                        >保存排序</el-button
                    >
                    <el-button @click="isSorting = false">取消排序</el-button>
                </template>
            </div>
        </div>
        <div class="authority-tree-header">
            <div style="padding-left: 56px; flex: 1">权限名称</div>
            <div style="width: 400px">权限描述</div>
            <div style="width: 200px">操作</div>
        </div>
        <el-tree
            class="card-tree"
            :data="sortedList"
            :props="defaultProps"
            default-expand-all
            node-key="menuId"
        >
            <div class="custom-tree-node" slot-scope="{ node, data }">
                <span class="custom-tree-node-name">{{ node.label }}</span>
                <span class="custom-tree-node-description">
                    {{ data.permDescription }}
                </span>
                <div class="custom-tree-node-actions">
                    <template
                        v-if="isSorting && isFirstLevelMenu(data.parentId)"
                    >
                        <i
                            class="el-icon-sort-up"
                            @click="upSort(node, data)"
                        ></i>
                        <i
                            class="el-icon-sort-down"
                            @click="downSort(node, data)"
                        ></i>
                    </template>
                    <template v-else-if="!isSorting">
                        <el-button type="text" @click="goDetail(data)"
                            >查看</el-button
                        >
                        <el-button type="text" @click="deleteNode(data)"
                            >删除</el-button
                        >
                    </template>
                </div>
            </div></el-tree
        >
    </div>
</template>

<script lang="ts">
import { MenuDTO } from "@/apis/menuGroup";
import arrayToTree from "@/helper/arrayToTree";
import { EventBusName } from "@/types";
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            list: [],
            isSorting: false,
            defaultProps: {
                label: "permName",
                children: "children",
            },
        };
    },
    mounted() {
        this.getList();
    },
    computed: {
        sortedList(): any {
            return [...this.list].sort(
                (a: any, b: any) => a.orderNum - b.orderNum
            );
        },
    },
    methods: {
        isFirstLevelMenu(parentId: string | number) {
            return Number(parentId) === 0;
        },
        //排序只针对一级菜单
        async upSort(node: any, data: any) {
            const index = (this.sortedList as any).indexOf(data);
            if (index > 0) {
                const exchangeOne: any = this.sortedList[index - 1];
                const body = [
                    { menuId: data.menuId, orderNum: exchangeOne.orderNum },
                    { menuId: exchangeOne.menuId, orderNum: data.orderNum },
                ];
                await this.$api.MenuGroup.DefaultApi.api.updateMenusUsingPOST(
                    body
                );
                this.$notify.success({
                    title: "成功！",
                    message: "菜单排序成功！",
                });
                this.getList();
                this.$eventBus.$emit(EventBusName.FRESHUSERINFO);
            }
        },
        async downSort(node: any, data: any) {
            const index = (this.sortedList as any).indexOf(data);
            if (index < this.sortedList.length - 1) {
                const exchangeOne: any = this.sortedList[index + 1];
                const body = [
                    { menuId: data.menuId, orderNum: exchangeOne.orderNum },
                    { menuId: exchangeOne.menuId, orderNum: data.orderNum },
                ];
                await this.$api.MenuGroup.DefaultApi.api.updateMenusUsingPOST(
                    body
                );
                this.$notify.success({
                    title: "成功！",
                    message: "菜单排序成功！",
                });
                this.getList();
                this.$eventBus.$emit(EventBusName.FRESHUSERINFO);
            }
        },
        goAdd() {
            this.$router.push({ name: "Authority-Add" });
        },
        async deleteNode(node: MenuDTO) {
            this.$confirm("确认删除该权限?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(async () => {
                await this.$api.MenuGroup.DefaultApi.api.deleteUsingDELETE([
                    node.menuId || -1,
                ]);
                this.getList();
                this.$emit(EventBusName.FRESHUSERINFO);
            });
        },
        goDetail(node: MenuDTO) {
            this.$router.push({
                name: "Authority-Detail",
                params: { id: String(node.menuId) },
            });
        },

        async getList() {
            const {
                data,
                success,
            } = await this.$api.MenuGroup.DefaultApi.api.listUsingPOST({});
            if (success) {
                const treeData = arrayToTree(data || []);
                this.list = treeData as any;
            }
        },
    },
});
</script>

<style lang="scss" scoped>
.authority-tree {
    .authority-tree-header {
        display: flex;
        text-align: left;
        line-height: 48px;
        border-bottom: 1px solid #ebeef5;
        color: #909399;
        font-weight: bold;
        font-size: 14px;
        & > div {
            float: 1;
        }
    }
    .custom-tree-node {
        display: flex;
        width: 100%;
        text-align: left;
        font-size: 14px;
        .custom-tree-node-name {
            flex: 1;
        }
        .custom-tree-node-description {
            width: 400px;
        }
        .custom-tree-node-actions {
            width: 200px;
            i {
                font-size: 20px;
                margin-right: 10px;
                cursor: pointer;
            }
        }
    }
}
</style>