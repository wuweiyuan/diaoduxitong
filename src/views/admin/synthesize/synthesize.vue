<template>
    <!-- synthesize 系统维护-->
    <div>
        <el-row class="head-btn">
            <el-button type="primary">下载日志文件</el-button>
            <el-button type="primary" @click="dialogCleanVisible =true">清理旧数据</el-button>
            <el-button type="primary" @click="dialogEditPasswordVisible =true">设定FTP密码</el-button>
            <el-switch on-text="调试" off-text="不调试" v-model="form.bug" on-value="y" off-value="n" @change="showLog"></el-switch>
        </el-row>
        <!-- dialogCleanVisible 清理旧数据 -->
        <el-dialog title="提示" :visible.sync="dialogCleanVisible" width="30%">
            <span>确认清理旧数据吗?</span>
            <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogCleanVisible = false">取 消</el-button>
                            <el-button type="primary" @click="sure()">确 定</el-button>
                          </span>
        </el-dialog>
        <!-- dialogCleanVisible 清理旧数据 -->
        <!-- dialogEditPasswordVisible 设定FTP密码 -->
        <el-dialog title="修改FTP密码" :visible.sync="dialogEditPasswordVisible" width="10%">
            <el-form style="margin:0 auto" :model="form" ref="form" label-width="100px">
                <el-form-item label="账号：" :label-width="formLabelWidth" prop="user">
                    <el-input style="width:220px" v-model="form.username" disabled auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码：" :label-width="formLabelWidth" prop="odlPassword">
                    <el-input style="width:220px" v-model="form.newpassword" auto-complete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="新密码：" :label-width="formLabelWidth" prop="newPassword">
                            <el-input style="width:220px" v-model="form.newPassword" auto-complete="off"></el-input>
                        </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogEditPasswordVisible = false">取 消</el-button>
                            <el-button type="primary" @click="sureEditPassword()">确 定</el-button>
                          </span>
        </el-dialog>
        <!-- dialogEditPasswordVisible 设定FTP密码 -->
    </div>
</template>
<script>
    import {
        page1,
        page2,
        addObj,
        getObj,
        delObj,
        putObj,
        putLog
    } from "api/admin/synthesize/index";
    import {
        mapGetters
    } from "vuex";
    export default {
        data() {
            return {
                dialogCleanVisible: false,
                dialogEditPasswordVisible: false,
                formLabelWidth: "80px",
                form: {
                    username: '',
                    newpassword: '',
                    bug:''
                },
            }
        },
        created() {
            this.getFtp();
        },
        computed: {
            ...mapGetters(["elements"])
        },
        methods: {
            sure() {},
            getFtp() {
                page1().then(response => {
                    this.form.username = response.data.ftp.username
                    this.form.newpassword = response.data.ftp.newpassword
                });
                page2().then(res=>{
                    this.form.bug = res.data.ftp.bug
                })
            },
            sureEditPassword() {
                console.log(this.form);
                putObj(this.form).then(res => {
                    console.log(res)
                    if (res.status === 200) {
                        this.$notify({
                            offset:700,
                            title: "成功",
                            message: "修改成功",
                            type: "success",
                            duration: 2000,
                            offset:700
                        });
                        this.dialogEditPasswordVisible = false;
                    } else {
                        //失败提示
                        this.$notify({
                            offset:700,
                            message: response.error,
                            type: "warning",
                            duration: 2000,
                            offset:700
                        });
                        this.dialogEditPasswordVisible = false;
                    }
                })
            },
            //是否记录日志
            showLog(){
                console.log(this.bug);
                putLog(this.form).then(res=>{
                    if (res.status === 200) {
                        this.$notify({
                            offset:700,
                            title: "成功",
                            message: "修改成功",
                            type: "success",
                            duration: 2000,
                            offset:700
                        });
                    } else {
                        //失败提示
                        this.$notify({
                            offset:700,
                            message: response.error,
                            type: "warning",
                            duration: 2000 ,
                            offset:700
                        });
                    }
                })
            }
        }
    }
</script>
<style lang="scss">
    .head-btn {
        margin-top: 1rem;
        text-align: center;
    }
</style>
