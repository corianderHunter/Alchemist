
<template>
    <el-header class="header" height="80px">
        <HeaderLeft />
        <HeaderRight />
    </el-header>
</template>

<script lang="ts">
import Vue from "vue";
import HeaderLeft from "./headerLeft.vue";
import HeaderRight from "./headerRight.vue";
export default Vue.extend({
    components: { HeaderLeft, HeaderRight },
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable.scss";
.header {
    background-color: $--color-primary;
    line-height: 80px;
    background-image: url(../../../Login/img/bg.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    padding: 0 30px;
}
</style>