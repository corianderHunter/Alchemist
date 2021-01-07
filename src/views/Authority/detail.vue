
<template>
    <div class="authority-detail">
        <el-form
            :model="authorityForm"
            ref="authorityForm"
            label-width="120px"
            class="authority-detail-form"
        >
            <el-form-item label="名称" prop="permName">
                <el-input v-model="authorityForm.permName"></el-input>
            </el-form-item>
            <el-form-item label="资源标识" prop="perms">
                <el-input v-model="authorityForm.perms"></el-input>
            </el-form-item>
            <el-form-item label="权限描述" prop="permDescription">
                <el-input
                    type="textarea"
                    v-model="authorityForm.permDescription"
                ></el-input>
            </el-form-item>
            <el-form-item label="权限类别" prop="type">
                <el-select
                    v-model="authorityForm.type"
                    placeholder="请选择类型"
                >
                    <el-option label="目录" :value="0"></el-option>
                    <el-option label="菜单" :value="1"></el-option>
                    <el-option label="按钮" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                v-if="authorityForm.type === 1"
                label="图标"
                prop="icon"
            >
                <div class="icon-content">
                    <i
                        v-for="(item, idx) in glyphs"
                        :key="idx"
                        class="iconfont"
                        @click="selectIcon(item)"
                        :class="{
                            [css_prefix_text + item.font_class]: true,
                            selected: item.font_class === authorityForm.icon,
                        }"
                    ></i>
                </div>
            </el-form-item>
            <el-form-item
                v-if="authorityForm.type === 1"
                label="是否为机密菜单"
                prop="icon"
            >
                <el-switch v-model="authorityForm.securityType"></el-switch>
            </el-form-item>

            <el-form-item
                v-if="authorityForm.type !== 2"
                label="路由地址"
                prop="linkUrl"
            >
                <el-input v-model="authorityForm.linkUrl"></el-input>
            </el-form-item>
            <el-form-item label="父节点" prop="delivery">
                <el-tree
                    class="card-tree"
                    ref="tree"
                    highlight-current
                    :data="list"
                    :props="defaultProps"
                    node-key="menuId"
                    @node-click="nodeClick"
                >
                </el-tree>
                <el-button style="float: right" type="text" @click="clearTree"
                    >清空</el-button
                >
            </el-form-item>

            <el-form-item>
                <el-button
                    type="primary"
                    @click="submitForm('authorityForm')"
                    >{{ mode === ViewMode.ADD ? "保存" : "更新" }}</el-button
                >
                <el-button
                    v-if="mode === ViewMode.ADD"
                    @click="resetForm('authorityForm')"
                    >重置</el-button
                >
                <el-button type="primary" @click="$router.go(-1)"
                    >返回</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts">
import { MenuDTO } from "@/apis/menuGroup";
import arrayToTree from "@/helper/arrayToTree";
import { EventBusName } from "@/types";
import Vue from "vue";
import iconfontConfig from "../../assets/iconfont/iconfont.json";

const { css_prefix_text, glyphs } = iconfontConfig;

enum ViewMode {
    ADD,
    DETAIL,
    EDIT,
}

export default Vue.extend({
    data() {
        return {
            glyphs,
            css_prefix_text,
            authorityForm: {
                icon: "",
                parentId: "0",
                menuId: "",
                securityType: false,
            },
            mode: ViewMode.ADD,
            list: [],
            ViewMode,
            defaultProps: {
                label: "permName",
                children: "children",
            },
            id: "",
        };
    },
    mounted() {
        const id = this.$route.params.id;
        if (id) {
            this.mode = ViewMode.EDIT;
            this.id = String(id);
            this.getAuthority();
        } else {
            this.mode = ViewMode.ADD;
        }
        this.getList();
    },
    methods: {
        clearTree() {
            (this.$refs.tree as any).setCurrentKey(null);
            this.authorityForm.parentId = "0";
        },
        nodeClick(nodeData: MenuDTO) {
            this.authorityForm.parentId = String(nodeData.menuId) || " 0";
        },
        selectIcon(v: any) {
            this.authorityForm.icon = v.font_class;
        },
        async getAuthority() {
            const {
                data,
            } = await this.$api.MenuGroup.DefaultApi.api.infoUsingGET(
                this.id as any
            );
            this.authorityForm = {
                ...(data as any),
                securityType: !!(data as any).securityType,
            };
            (this.$refs.tree as any).setCurrentKey(this.authorityForm.parentId);
        },
        async getList() {
            const {
                data,
            } = await this.$api.MenuGroup.DefaultApi.api.listUsingPOST({});
            const treeData = arrayToTree(data || []);
            this.list = treeData as any;
        },
        async save() {
            await this.$api.MenuGroup.DefaultApi.api.saveUsingPOST1({
                ...(this.authorityForm as any),
                securityType: this.authorityForm.securityType ? 1 : 0,
            });
            this.$eventBus.$emit(EventBusName.FRESHUSERINFO);
            this.$router.push("/authority/tree");
        },
        async update() {
            await this.$api.MenuGroup.DefaultApi.api.updateUsingPOST(
                this.authorityForm as any
            );
            this.$eventBus.$emit(EventBusName.FRESHUSERINFO);
            this.$router.push("/authority/tree");
        },
        submitForm(formName: string) {
            (this.$refs[formName] as any).validate((valid: boolean) => {
                if (valid) {
                    if (this.mode === ViewMode.ADD) {
                        this.save();
                    } else {
                        this.update();
                    }
                }
            });
        },
        resetForm(formName: string) {
            (this.$refs[formName] as any).resetFields();
        },
    },
});
</script>
<style lang="scss" scoped>
@import "@/assets/style/variable.scss";
.authority-detail {
    .authority-detail-form {
        margin-top: 80px;
        width: 460px;
        margin: 0 auto;
        height: 100%;
        text-align: left;
        .icon-content {
            box-shadow: $--common-box-shadow;
            padding: 20px;
            text-align: left;
            word-break: break-word;
            .custom-tree-node {
            }
            .iconfont {
                padding: 2px;
                margin: 0 20px 20px 0;
                font-size: 20px;
                cursor: pointer;
                &.selected {
                    background: $--color-primary;
                    color: #fff;
                    border-radius: 3px;
                }
            }
        }
    }
}
</style>