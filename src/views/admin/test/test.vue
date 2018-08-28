<template>
  <!-- dashboard -->
  <div style="width:500px;margin:20px auto;" el-container>
    <el-form :rules="rules" :model="form.data" ref="ruleForm">
      <el-form-item label="用户id" :label-width="formLabelWidth">
        <el-input v-model="form.data.login_id" auto-complete="off" disabled=""></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
        <el-input v-model="form.data.name" :disabled.sync="AllowUpde"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password" :label-width="formLabelWidth">
        <el-input v-model="form.data.password" :disabled.sync="AllowUpde"></el-input>
      </el-form-item>
      <el-form-item label="工序" :label-width="formLabelWidth">
        <el-input v-model="form.data.ProcessName" disabled></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone" :label-width="formLabelWidth">
        <el-input v-model="form.data.phone" :maxlength=11 :minlength=11 :disabled.sync="AllowUpde"></el-input>
      </el-form-item>
      <el-form-item label="流水线名称" :label-width="formLabelWidth">
        <el-input v-model="form.data.PLName" auto-complete="off" disabled=""></el-input>
      </el-form-item>
    </el-form>
    <div align="center" class="dialog-footer">
      <el-button type="success" @click="handleClick" v-if="AllowUpde">编辑</el-button>
      <el-button type="primary" @click="handleUpdate('ruleForm')" v-if="!AllowUpde">确 定</el-button>
    </div>
  </div>
</template>
<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj
  } from "api/admin/user/index1";
  import {
    mapGetters
  } from "vuex";
  // 这里要俺需要引入，我不是一个对象
  import {
    isvalidPhone
  } from "utils/validate";
  import {
    getToken,
    setToken,
    getRole,
    setRole,
    setUserId,
    getUserId,
    removeRole,
    removeUserID,
    removeToken
  } from 'utils/auth';
  //定义一个全局的变量，谁用谁知道
  export default {
    data() {
      return {
        form: {
          status: 200,
          tip: "成功",
          data: {
            // ProcessName: "裁剪规划",
            // login_id: 1123,
            // name: "",
            // password: "",
            // PLID: 8,
            // code: 37,
            // power: 2,
            // phone: "",
            // mail: " ",
            // weixin: "2313DF",
            // computer: "FSF",
            // mach_id: 0,
            // state: 0,
            // last_time: "/Date(1517531541813)/",
            // group: 0,
            // replace: 0
          }
        },
        formData: {
          data: {}
        },
        formLabelWidth: "100px",
        AllowUpde: true,
        role: "",
        rules: {
          name: [{
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            },
            // { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }],
          phone: [{
            required: false
          }]
        }
      };
    },
    created() {
      this.getMessage();
      console.log(getRole());
    },
    methods: {
      handleClick() {
        this.AllowUpde = !this.AllowUpde;
      },
      handleUpdate(formName) {
        console.log(this.form.data.phone)
  //       if(this.form.data.name == this.formData.data.name && this.form.data.password == this.formData.data.password && this.form.data.phone == this.formData.data.phone){
  //        return false;
  // }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!this.form.data.phone) {
              putObj(this.form.data).then(response => {
                if (response.status === 200) {
                  this.$notify({
                    offset:700,
                    title: "成功",
                    message: "更新成功",
                    type: "success",
                    duration: 2000
                  });
                  this.handleClick();
                } else if (response.status === 201) {
                  //失败提示
                  console.log(response.status)
                  this.$notify({
                    offset:700,
                    message: response.tip,
                    type: "warning",
                    duration: 2000
                  });
                }
              });
            } else if (this.form.data.phone) {
              if (!isvalidPhone(this.form.data.phone)) {
                this.$notify.error('手机号输入有误！');
                return false;
              } else {
                putObj(this.form.data).then(response => {
                  if (response.status === 200) {
                    this.$notify({
                      offset:700,
                      title: "成功",
                      message: "更新成功",
                      type: "success",
                      duration: 2000
                    });
                    this.handleClick();
                  } else if (response.status === 201) {
                    //失败提示
                    console.log(response.status)
                    this.$notify({
                      offset:700,
                      message: response.tip,
                      type: "warning",
                      duration: 2000
                    });
                  } else {
                    //失败提示
                    this.$notify({
                      offset:700,
                      message: response.error,
                      type: "warning",
                      duration: 2000
                    });
                  }
                  // console.log(res);
                });
              }
            }
          }
        })
      },
      getMessage() {
        page().then(res => {
          console.log(res.data);
          setUserId(res.data.login_id)
          // console.log(getUserId())
          if (res.data.phone == " ") {
            res.data.phone = res.data.phone.trim();
            // res.data.phone = "";
          }
          this.form.data = res.data;
          this.formData.data = res.data;
          console.log(this.getToken);
        });
      }
    }
  };
</script>