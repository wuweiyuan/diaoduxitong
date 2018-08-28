<template>
  <div class="app-container " style="  margin: 10px  center;">
    <div style="margin-left:00%;">
      <el-upload class="upload-demo" ref="upload" action="http://localhost/git/vue-file-upload/demo/upload.php" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false" :multiple="true">
        <el-button slot="trigger" size="small" type="primary" @click="uploadBtn">选取文件</el-button>
        <el-button slot="trigger" size="small" type="primary" @click="saveAS">另存为</el-button>
        <el-button  style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <!-- 
                            <el-button class="filter-item" type="primary"  >点击上传</el-button>
                            <el-button class="filter-item" type="primary"  >另存为</el-button> -->
    </div>

    
     <br>
    <div  style="   width: 40%;" >
      <el-input placeholder="" v-model="this.putconfigObjName.CompanyName"  :readonly="true"    >
        <template slot="prepend">您选择的公司是:</template>
      </el-input>
    </div>

    <div  style="   width: 40%;" >
      <el-input placeholder="" v-model="this.putconfigObjName.UserName"  :readonly="true" >
          <template slot="prepend">
            您选择的员工是:
          </template>
      </el-input>
    </div>

    <div  style="   width: 40%;" >  
      <el-input placeholder="" v-model="this.response"  :readonly="true" >
          <template slot="prepend">
            操作的返回结果:
          </template>
      </el-input>
    </div>



    <br>
    <el-input style="width: 33.5%;" class="filter-item" placeholder="输入公司名称" v-model="listQuery.query">
    </el-input>
    <el-button class="filter-item" type="primary" icon="search" @click="search">搜索</el-button>
    




           <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 40%">
              <el-table-column  align="center" label="请点击公司，设定能打开的员工">
<template scope="scope">
  <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)">
    {{ scope.row.CompanyName }}
  </el-button>
</template>
              </el-table-column>
          </el-table>

              
      
          <!-- 分页控件 -->
          <div v-show="!listLoading" class="pagination-containerleft">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
          </div>
           <!-- 分页控件 -->

           <!-- 弹出框 -->
          <el-dialog :title="dialogtitle"  align="center" :visible.sync="dialogFormVisible">
            <el-form :model="form"  ref="form" label-width="100px">
              <el-form-item  :label-width="formLabelWidth">       

                <el-checkbox v-for="item in permissionList" :key="item.id" v-model="item.IsChecked">{{item.UserName}} {{item.Remark}}</el-checkbox>
                  
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancel('form')">取 消</el-button>
              <el-button type="primary" @click="update('form')">确 定</el-button>
            </div>
          </el-dialog>
           <!-- 弹出框 -->
    



  </div>
</template>




<script>
  //  导入外部文件
  //  import MyJS from 'utils/MyJS';
  import {
    GetAjax
  } from "utils/MyJS";
  import {
    page,
    addObj,
    getObj,
    delObj,
    setOtherOpen,
    putconfig,
    PartnerCompanyInfo,
    putObj
  } from "api/admin/partner/index";
  import {
    details
  } from "api/admin/FileLog/details";
  import {
    fetchList
  } from '@/api/article'
  // import {
  //   page,
  //   addObj,
  //   getObj,
  //   delObj,
  //   putObj
  // } from "api/admin/upload/upload";
  //  导入外部文件
  export default {
    data() {
      const generateData = _ => {
        // const data = [];
        // page(this.listQuery).then(response => {
        //   console.log(response);
        //   for (let i = 1; i <= response.data.total; i++) {
        //     this.data.push({
        //       key: i,
        //       label: response.data.rows[i]
        //       // disabled: i % 4 === 0
        //     });
        //   }
        //   // this.list = response.data.rows;
        //   // this.total = response.data.total;
        //   // this.listLoading = false;
        // });
        // return data;
      };
      return {
        form: null,
        checkedList: null,
        dialogtitle: "设定能打开文件的员工",
        
        permissionList: null,
        CompanyId: null,
        CompanyName: null,
        list: null,
        total: 10,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          Stime: undefined,
          Etime: undefined,
          action: "add",
          query: null
        },
        PartnerCompanyInfo: {
          partnerId: null
        },
        dialogFormVisible: false,
        formPhone: "",
        dialogStatus: "",
        userManager_btn_edit: true,
        userManager_btn_del: true,
        userManager_btn_add: true,
        value6: "",
        value7: "",
        textMap: {
          update: "编辑",
          create: "创建"
        },
        detailQuery: {
          CompanyId: null
        },
        putObj: {
          State: null,
          Id: null
        },
        formLabelWidth: "80px",
        putconfigObj: {
          touser: null,
          CompanyId: null,
          action: null
        },
        putconfigObjName: {
          UserName: null,
          CompanyName: null
        },
        tableKey: 0,
        pId: null,
        fileList: [],
        // data: null,
        data: null,
        value3: [1],
        value1: [1, 4],
        response:null,
        renderFunc(h, option) {
          return option.key - option.label;
          //  return <span> {{ option.key }} - { option.label }</span>;
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        });
      },
      //    GetAjax(handle, param) {
      // var url = String.Format("{0}.ashx?{1}&random={2}", handle, param, Math.random());
      // var htmlobj = $.ajax({ url: url, cache: false, async: false });
      // var result = htmlobj.responseText;
      // return result;
      // },
      submitUpload() {
        if (window.external.ET_IsOurCustomBrowser != null) {
          this.PartnerCompanyInfo.partnerId = this.putconfigObj.CompanyId
          PartnerCompanyInfo(this.PartnerCompanyInfo).then(response => {
            var res = response.result;
            var words = res.split('|');
            if (words.length == 7 && words[0] == "OK") {
              if (window.external.ET_IsOurCustomBrowser()) {
                var filename = window.external.ET_ConvertFile(this.putconfigObj.touser, words[1], words[2], words[6], words[3], words[4], words[5]); //从页面获取数据传输给C++应用程序
                 this.response = filename
                if (filename.length > 6) {                  
                  this.$notify({
                    offset:700,
                    title: "成功",
                    message: "上传成功",
                    type: "success",
                    duration: 2000
                  });
                } else {
                  this.$notify({
                    offset:700,
                    title: "失败",
                    message: "上传失败",
                    type: "error",
                    duration: 2000
                  });
                }
              } else {
                this.$notify({
                  offset:700,
                  title: "失败",
                  message: "不是ET内嵌浏览器",
                  type: "error",
                  duration: 2000
                });
              }
            } else {
              this.$notify({
                offset:700,
                title: "失败",
                message: response.result,
                type: "error",
                duration: 2000
              });
            }
          });
        } else {
          this.$notify({
            offset:700,
            title: "提示",
            message: "浏览器不兼容",
            type: "error",
            duration: 2000
          });
        }
      },
      handleChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      saveAS() {
        if (window.external.ET_IsOurCustomBrowser != null) {
          this.PartnerCompanyInfo.partnerId = this.putconfigObj.CompanyId
          PartnerCompanyInfo(this.PartnerCompanyInfo).then(response => {
            var res = response.result;
            var words = res.split('|');
            var filename = window.external.ET_SaveFile("", words[1], words[2], words[6], words[3], words[4], words[5]); //从页面获取数据传输给C++应用程序
            // var filename = "xhuecsuy.txt | 1";
             this.response = filename
            if (filename.length > 6) {
              this.$notify({
                offset:700,
                title: "成功",
                message: "另存成功",
                type: "success",
                duration: 2000
              });
            }else{
              this.$notify({
                offset:700,
                    title: "失败",
                    message: "另存失败",
                    type: "error",
                    duration: 2000
                  });
            }
          });
        } else {
          this.$notify({
            offset:700,
            title: "提示",
            message: "浏览器不兼容",
            type: "error",
            duration: 2000
          });
          return;
        }
        console.log("saveAS");
      },
      uploadBtn() {
        console.log("uploadBtn");
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      },
      update(formName) {
        var putStr = ""
        var UserName = ""
        this.permissionList.forEach(function(value, index, array) {
          array[index] == value;
          if (value.IsChecked === true) {
            putStr = putStr + value.Id + "|"
            UserName = UserName + value.UserName + " , "
          }
        });
        if (putStr === "") {
          this.$notify({
            offset:700,
            title: "提示",
            message: "请至少选择一个",
            type: "info",
            duration: 2000
          });
          return;
        }
        this.putconfigObj.action = "open"
        this.putconfigObj.touser = putStr
        this.putconfigObj.CompanyId = this.CompanyId
        this.putconfigObjName.UserName = UserName
        this.putconfigObjName.CompanyName = this.CompanyName
        this.dialogFormVisible = false;
        // console.log(this.CompanyName)
        // putconfig(this.putconfigObj).then(response => {
        //   if (response.status === 200) {
        //     this.$notify({
        //       title: "成功",
        //       message: "更新成功",
        //       type: "success",
        //       duration: 2000
        //     });
        //     this.dialogFormVisible = false;
        //   } else {
        //     this.$notify({
        //       title: "失败",
        //       message: "更新失败",
        //       type: "error",
        //       duration: 2000
        //     });
        //     this.dialogFormVisible = false;
        //   }
        // });
      },
      search() {
        this.getList();
      },
      handleEdit(index, row) {
        this.CompanyId = row.CompanyId
        this.CompanyName = row.CompanyName
        this.dialogtitle = "设定" + row.CompanyName + "能打开文件的员工"
        this.detailQuery.CompanyId = row.CompanyId
        setOtherOpen(this.detailQuery).then(response => {
          if (response.status === 201) {
            this.$notify({
              offset:700,
              message: response.error,
              type: "warning",
              duration: 2000
            });
          } else {
            this.permissionList = response.data.rows;
            this.dialogFormVisible = true;
          }
        });
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handlePreview(file) {
        console.log(file);
      }
    }
  }
</script>
<style>
  strong {
    color: black;
  }
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
</style>
