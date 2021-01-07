<template>
    <section class="login-body">
        <div class="login-form">
            <div class="login-title">预付卡管理平台</div>
            <el-form :model="userForm" :rules="rules" ref="userForm">
                <div class="login-logo"></div>
                <el-form-item prop="userName">
                    <el-input
                        type="text"
                        placeholder="请输入账号"
                        v-model="userForm.userName"
                        @focus="focusUser"
                        @blur="blurUser"
                    >
                        <template slot="prepend">
                            <i class="el-icon-user"></i>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="passWord">
                    <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="userForm.passWord"
                        auto-complete="off"
                        @focus="focusInput"
                        @blur="blurInput"
                        @keyup.enter.native="login('userForm')"
                    >
                        <template slot="prepend">
                            <i class="el-icon-bell"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="login-button" @click="login('userForm')">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </section>
</template>

<script lang="ts">
import { storageToken } from "@/helper/token";
import * as md5 from "md5";
import Vue from "vue";
export default Vue.extend({
    data() {
        return {
            version: "agri-version",
            focusInputPass: false,
            focusInputUser: false,
            checked: false,
            hasPass: "",
            userForm: {
                userName: "",
                passWord: "",
            },
            rules: {
                userName: [
                    {
                        required: true,
                        message: "请输入账号",
                        trigger: "blur",
                    },
                ],
                passWord: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    mounted() {},
    methods: {
        focusInput() {
            this.focusInputPass = true;
        },
        blurInput() {
            this.focusInputPass = false;
        },
        focusUser() {
            this.focusInputUser = true;
        },
        blurUser() {
            this.focusInputUser = false;
        },
        login(name: string) {
            (this.$refs[name] as any).validate(async (v: boolean) => {
                if (v) {
                    const result = await this.$api.accountGroups.DefaultApi.api.webLoginUsingPOST(
                        {
                            loginName: this.userForm.userName,
                            password: md5(this.userForm.passWord),
                        }
                    );
                    const { data, success } = result || {};
                    if (success) {
                        const { token } = data || {};
                        storageToken(token);
                        this.$router.push({ name: "Index" });
                    }
                }
            });
        },
    },
});
</script>

<style scoped lang="scss">
.login-body {
    height: 100%;
    background-image: url(./img/bg.png);
    position: relative;
    background-repeat: no-repeat;
    background-size: cover;
    .login-form {
        background-image: url(./img/formBg.png);
        width: 560px;
        height: 295px;
        background-size: contain;
        background-repeat: no-repeat;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 0;
        top: 0;
        background-position-y: 10px;
        .login-title {
            font-size: 24px;
            font-weight: bold;
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            text-align: center;
            color: #fff;
            top: -53px;
            letter-spacing: 4px;
        }
        .el-form {
            width: 448px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            box-sizing: border-box;
            border-radius: 6px;
            height: 230px;
            box-shadow: 0px 3px 20px rgba(55, 118, 255, 0.5);
            .login-logo {
                width: 30px;
                height: 30px;
                border-radius: 30px;
                margin: 0 auto 20px;
                background-image: url(../../assets/images/logo.png);
                background-size: cover;
                background-repeat: no-repeat;
            }
            .login-button {
                width: 230px;
                margin: 0 auto;
                background-color: #3776ff;
                color: #fff;
                border-radius: 40px;
                margin: 0 auto 10px;
                border: none;
                box-shadow: 0px 2px 9px rgba(55, 118, 255, 0.5);
            }
            /deep/ {
                .el-input-group__prepend {
                    background-color: transparent;
                    border: none;
                    padding: 0 8px;
                    font-size: 18px;

                    color: #3776ff;
                    i {
                        font-weight: bold;
                    }
                }
                .el-form-item__error {
                    margin-left: 35px;
                }
                .el-input-group--prepend .el-input__inner {
                    background-color: transparent !important;
                }
                .el-form-item {
                    width: 230px;
                    margin: 0 auto 20px;
                }
                .el-form-item__content {
                    line-height: 22px;
                }
                .el-input__inner {
                    height: 22px;
                    border-top: none;
                    border-left: none;
                    border-right: none;
                    border-bottom: 1px solid #e5e5e5;
                }
            }
        }
    }
}
</style>
<style>
@media screen and (max-width: 1440px) {
    html {
        font-size: 12px;
    }
}
</style>

