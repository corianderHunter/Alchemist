<!--
 * @Author: weidonghua
-->

<script lang="tsx">
import { template } from "@/helper/parseConfig";
import { XOR } from "@/types";
import { isEmpty, isFunction } from "lodash";
import Vue from "vue";
import { RawLocation } from "vue-router";
import { PropType } from "vue/types/umd";

export enum ParamInputType {
    INPUT,
    SELECT,
    TIMESELECT,
    TIMEPICKER,
    DATETIME,
    CUSTOM,
}

export type ColumnsType = { label: string } & XOR<
    {
        "show-overflow-tooltip"?: boolean;
        prop: string;
        router?: (row: any) => any | RawLocation;
    },
    { render?: (row: any) => any }
>;

export type ParamType = {
    label: string;
    prop: string;
    value?: any;
    type: ParamInputType;
    render?: (value: ParamType) => any;
    // subProps?: { [p: string]: any }; //内置element组件的属性
    subProps?: any;
} & XOR<
    {},
    { options: any[]; selectProps: { label?: string; value?: string } }
>;

export default Vue.extend({
    name: "CommonTable",
    data() {
        return {
            pager: {
                pageNo: 1,
                pageSize: 10,
            },
            usedParams: {},
            multipleSelection: [],
        };
    },
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        params: {
            type: Array as PropType<ParamType[]>,
            default: () => [],
        },
        pageSizes: {
            type: Array as PropType<number[]>,
            default: [10, 20, 50],
        },
        total: {
            type: Number,
            default: 0,
        },
        columns: {
            type: Array as PropType<ColumnsType[]>,
            default: [],
        },
        withIndex: {
            type: Boolean,
            default: false,
        },
        withSelection: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        this.init();
        this.triggerFetch();
    },
    computed: {},
    methods: {
        init() {
            this.pager.pageSize = this.pageSizes[0] || 10;
        },
        handleSelectionChange(val: any) {
            this.multipleSelection = val;
        },
        setUsedParams() {
            this.usedParams = {};
            this.params.reduce((s, v) => {
                s[v.prop] = v.value;
                return s;
            }, this.usedParams as any);
        },
        search() {
            this.pager.pageNo = 1;
            this.setUsedParams();
            this.triggerFetch();
        },
        triggerFetch() {
            this.$nextTick(() => {
                this.$emit("service", this.usedParams, this.pager);
            });
        },
        handleSizeChange(val: number) {
            this.pager.pageSize = val;
            this.pager.pageNo = 1;
            this.triggerFetch();
        },
        handleCurrentChange(val: number) {
            this.pager.pageNo = val;
            this.triggerFetch();
        },
        getSearchComponent(item: ParamType, index: number): any {
            const { subProps = {}, render = () => {} } = item;
            const props = { props: subProps };
            switch (item.type) {
                case ParamInputType.CUSTOM:
                    return render(item);
                case ParamInputType.SELECT:
                    return (
                        <el-select
                            clearable
                            style="width: 200px"
                            value={item.value}
                            onInput={(value: any) =>
                                this.$set(item, "value", value)
                            }
                            {...props}
                            placeholder={`请选择${item.label}`}
                        >
                            {(item.options || []).map((_item, _idx) => (
                                <el-option
                                    key={_idx}
                                    label={
                                        _item[item?.selectProps?.label || ""]
                                    }
                                    value={
                                        _item[item?.selectProps?.value || ""]
                                    }
                                ></el-option>
                            ))}
                        </el-select>
                    );
                case ParamInputType.TIMESELECT:
                    return (
                        <el-time-select
                            clearable
                            style="width: 200px"
                            value={item.value}
                            onInput={(value: any) =>
                                this.$set(item, "value", value)
                            }
                            {...props}
                            placeholder={`请输入${item.label}`}
                        ></el-time-select>
                    );
                case ParamInputType.TIMEPICKER:
                    return (
                        <el-time-picker
                            clearable
                            style="width: 200px"
                            value={item.value}
                            onInput={(value: any) =>
                                this.$set(item, "value", value)
                            }
                            {...props}
                            placeholder={`请输入${item.label}`}
                        ></el-time-picker>
                    );
                case ParamInputType.DATETIME:
                    return (
                        <el-date-picker
                            clearable
                            style="width: 370px"
                            value={item.value}
                            onInput={(value: any) =>
                                this.$set(item, "value", value)
                            }
                            {...props}
                            placeholder={`请输入${item.label}`}
                        ></el-date-picker>
                    );
                case ParamInputType.INPUT:
                default:
                    return (
                        <el-input
                            clearable
                            style="width: 200px"
                            value={item.value}
                            onInput={(value: any) =>
                                this.$set(item, "value", value)
                            }
                            {...props}
                            placeholder={`请输入${item.label}`}
                        ></el-input>
                    );
            }
        },
    },

    render() {
        return (
            <div class="common-table">
                <div class="table-header">
                    <div class="table-header-left">
                        {this.params.map((item, idx) => {
                            const inputNode = this.getSearchComponent(
                                item,
                                idx
                            );
                            return (
                                <div class="search-item" key={idx}>
                                    <div class="search-item-label">
                                        {item.label}：
                                    </div>
                                    <div class="search-item-content">
                                        {inputNode}
                                    </div>
                                </div>
                            );
                        })}

                        <div style="margin-left: 20px">
                            <el-button
                                type="primary"
                                onClick={this.search.bind(this)}
                            >
                                查询
                            </el-button>
                        </div>
                    </div>
                    <div class="table-header-right">
                        {this.$scopedSlots
                            ? (this.$scopedSlots as any).headerRight(
                                  this.multipleSelection
                              )
                            : null}
                    </div>
                </div>
                <div class="table-content">
                    <el-table
                        data={this.list}
                        style="width: 100%"
                        onSelection-change={this.handleSelectionChange.bind(
                            this
                        )}
                    >
                        {this.withSelection ? (
                            <el-table-column
                                type="selection"
                                width="55"
                            ></el-table-column>
                        ) : null}
                        {this.withIndex ? (
                            <el-table-column
                                type="index"
                                width="50"
                            ></el-table-column>
                        ) : null}
                        {this.columns.map((column: ColumnsType) => {
                            const { prop, router, label, render } = column;
                            if (render) {
                                return (
                                    <el-table-column
                                        label={label}
                                        {...{
                                            scopedSlots: {
                                                default: function ({
                                                    row,
                                                }: any) {
                                                    return render(row);
                                                },
                                            },
                                        }}
                                    ></el-table-column>
                                );
                            } else if (router) {
                                return (
                                    <el-table-column
                                        label={label}
                                        {...{
                                            scopedSlots: {
                                                default: function ({
                                                    row,
                                                }: any) {
                                                    return (
                                                        <router-link
                                                            to={
                                                                isFunction(
                                                                    router
                                                                )
                                                                    ? router(
                                                                          row
                                                                      )
                                                                    : router
                                                            }
                                                        >
                                                            {row[prop || ""]}
                                                        </router-link>
                                                    );
                                                },
                                            },
                                        }}
                                    ></el-table-column>
                                );
                            } else {
                                return (
                                    <el-table-column
                                        show-overflow-tooltip={
                                            column["show-overflow-tooltip"] ||
                                            false
                                        }
                                        prop={prop}
                                        label={label}
                                    ></el-table-column>
                                );
                            }
                        })}
                    </el-table>
                    <el-pagination
                        style="margin-top: 20px"
                        background
                        onSize-change={this.handleSizeChange.bind(this)}
                        onCurrent-change={this.handleCurrentChange.bind(this)}
                        current-page={this.pager.pageNo}
                        page-sizes={this.pageSizes}
                        page-size={this.pager.pageSize}
                        layout="total, sizes, prev, pager, next, jumper"
                        total={this.total}
                    ></el-pagination>
                </div>
            </div>
        );
    },
});
</script>

<style lang="scss" scoped>
.common-table {
    .table-header {
        padding: 16px 0;
        overflow: hidden;
        display: flex;
        margin-bottom: 10px;

        .table-header-left {
            text-align: left;
            flex: 1;
            display: flex;
            line-height: 40px;
            flex-flow: wrap;
            div:nth-last-child(2) {
                margin-right: 0;
            }
            .search-item {
                margin-right: 20px;
                flex-direction: row;
                display: flex;
                margin-bottom: 16px;
                .search-item-label {
                }
                .search-item-content {
                    flex: 1;
                }
            }
        }

        .table-header-right {
            text-align: right;
            display: flex;
            margin-left: 40px;
            .el-button {
                height: 40px;
            }
        }
    }
    .table-content {
    }
}
</style>