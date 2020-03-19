<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="searchData"
        class="input-with-select"
        style="width: 30%;"
      >
        <el-button @click="searchGet" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button @click.stop="userShow" type="success" plain>添加用户</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%; margin-top:15px"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="username" label="用户" width="200"></el-table-column>
      <el-table-column property="email" label="邮箱" width="220"></el-table-column>
      <el-table-column property="mobile" label="电话"></el-table-column>
      <el-table-column property label="状态">
        <template slot-scope="scope">
          <el-switch
            @change="mgStateChange(scope)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column property label="操作">
        <template slot-scope="scope">
          <el-button @click.stop="editUser(scope.row)" type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button @click.stop="rolesUser(scope.row)" type="success" icon="el-icon-check" plain size="mini"></el-button>
          <el-button @click="deleteUser(scope.row.id)" type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="pageChange"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top:15px; text-align:center;"
    ></el-pagination>

    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :visible.sync="addUserShow">
      <el-form :model="userAddData" :rules="rules">
        <el-form-item label="用户名" label-width="200px" prop="username">
          <el-input v-model="userAddData.username" autocomplete="off" style="width:350px"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="200px" prop="password">
          <el-input v-model="userAddData.password" autocomplete="off" style="width:350px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="200px">
          <el-input v-model="userAddData.email" autocomplete="off" style="width:350px"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="200px">
          <el-input v-model="userAddData.mobile" autocomplete="off" style="width:350px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserShow = false">取 消</el-button>
        <el-button type="primary" @click="addUserPost">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户信息弹窗 -->
    <el-dialog title="修改用户信息" :visible.sync="editUserShow">
      <el-form :model="userEditData" :rules="rules">
        <el-form-item label="用户名" label-width="200px" prop="username">
          <el-input v-model="userEditData.username" :disabled="true" autocomplete="off" style="width:350px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="200px">
          <el-input v-model="userEditData.email" autocomplete="off" style="width:350px"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="200px">
          <el-input v-model="userEditData.mobile" autocomplete="off" style="width:350px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserShow = false">取 消</el-button>
        <el-button type="primary" @click="editUserPut">修 改</el-button>
      </div>
    </el-dialog>

    <!-- 更改用户角色 -->
    <el-dialog title="更改用户角色" :visible.sync="rolesShow">
      <el-form :model="rolesData" :rules="rules">
        <el-form-item label="用户名" label-width="200px" prop="username">
          <el-input v-model="rolesData.username" :disabled="true" autocomplete="off" style="width:224px"></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="200px">
            <el-select v-model="rolesID" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.roleName"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesShow = false">取 消</el-button>
        <el-button type="primary" @click="rolePut">修 改</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      addUserShow: false, // 添加用户弹窗
      editUserShow: false, // 修改用户信息弹窗
      rolesShow: false, // 更改用户角色弹窗
      // 添加用户的表单数据
      userAddData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 修改用户的表单数据
      userEditData: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      // 更改用户角色的表单数据
      rolesData: {
        id: "",
        username: "",
      },
      searchData: "", // 搜索框中的值
      tableData: [], // 表格数据
      // 验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在3到8个字符", trigger: "blur" }
        ]
      },
      rolesID: '',  //       
      options: [],  // 角色列表数据

      total: 0, // 页数总条数
      sizepage: 20,  // 默认控制显示的条数
      page: 1, // 当前的默认页码
    }
  },

  mounted() {
    /** 利用钩子函数，在页面渲染之前，获取用户数据 */
    this.getUsersList();
  },
  methods: {

    pageChange(page) {
      /** 改变页码时触发的函数
       * @param page 页码
       */
      this.page = page
      this.getUsersList();
    },

    sizeChange(size) {
      /** 显示条数被修改后触发
       * @param size 显示的条数
       */
      this.sizepage = size;
      this.getUsersList();
    },

    getUsersList(query = "") {
      /** 获取用户数据的公用函数
       * @param query 查询条件
       * @return 用户数据列表
       */
      if (query == "") {
        var url = `users?pagenum=${this.page}&pagesize=${this.sizepage}`;
      } else {
        var url = `users?pagenum=${this.page}&pagesize=${this.sizepage}&query=` + query;
      }
      this.$myHttp.get(url).then(back_data => {
        let { data, meta } = back_data.data;
        if (meta.status == 200) {
          this.tableData = data.users;
          this.total = data.total;
        } else {
          this.$message({
            // message: "数据请求失败，请重试或联系管理员",
            message: meta.msg,
            type: "error"
          });
        }
      });
    },

    searchGet() {
      /** 模糊搜索用户数据的函数 */
      this.getUsersList(this.searchData);
    },

    userShow() {
      /** 显示添加用户弹窗 */
      this.addUserShow = true;
    },

    editUser(userData) {
      /** 显示修改用户信息弹窗
       * @param userData 更改后的用户数据
       */
      this.userEditData = userData;
      this.editUserShow = true;
    },

    rolesUser(roles) {
      /** 显示更改用户角色的弹窗，并获取所有角色展示到下拉列表中
       * @param roles 角色数据
       */
      // 请求角色列表数据
      this.$myHttp({
        url: 'roles',
        method: 'get'
      }).then( back_data => {
        this.options = back_data.data.data;

        for(var i in this.options) {
          if(this.options[i]['roleName'] == roles.role_name) {
            // console.log(this.options[i]['id'])
            this.rolesID = this.options[i]['id'];
          }
        }

      })

      this.rolesData = roles;
      this.rolesShow = true;
    },

    addUserPost() {
      /** 提交新增的用户信息 */
      this.$myHttp.post("users", this.userAddData).then(back_data => {
        let { data, meta } = back_data.data;
        if (meta.status == 201) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.userAddData = {
            username: "",
            password: "",
            email: "",
            mobile: ""
          };
          this.addUserShow = false;
          this.getUsersList();
        } else {
          this.$message({
            message: "添加失败",
            type: "error"
          });
        }
      });
    },

    editUserPut() {
      /** 更新修改后的用户信息数据 */
      let id = this.userEditData.id;
      let email = this.userEditData.email;
      let mobile = this.userEditData.mobile;

      this.$myHttp({
        url: `users/${id}`,
        method: 'put',
        data: {email, mobile}
      }).then( back_data => {
        let {data, meta} = back_data.data;
        if (meta.status == 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: meta.msg,
            type: 'error'
          })
        }
        this.editUserShow = false
      })
    },

    rolePut() {
      /** 提交更改角色的信息 */
      this.$myHttp({
        url: `users/${this.rolesData.id}/role`,
        method: 'put',
        data: {rid: this.rolesID}
      }).then(back_data => {
        let {data, meta} = back_data.data
        if(meta.status == 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          }) 
        } else {
          this.$message({
            message: meta.msg,
            type: 'error'
          })
        }
        this.rolesShow = false;
        this.getUsersList();
      })
    },

    mgStateChange(scope) {
      /** 用户状态开关切换
       * @param scope 用户信息数据
       */
      this.$myHttp({
        url: `users/${scope.row.id}/state/${scope.row.mg_state}`,
        method: "put",
        headers: { Authorization: window.localStorage.getItem("token") }
      }).then(back_data => {
        let { data, meta } = back_data.data;
        if (meta.status == 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
        } else {
          this.tableData[scope.$index].mg_state = !scope.row.mg_state;
          this.$message({
            message: "状态切换失败，请重试",
            type: "error"
          });
        }
      });
    },

    deleteUser(id) {
      /** 删除用户
       * @param id 用户ID
       */
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$myHttp({
            url: `users/${id}`,
            method: 'delete',
            headers: { Authorization: window.localStorage.getItem("token") }
          }).then(back_data => {
            let { data, meta } = back_data.data;
            if (meta.status == 200) {
              this.$message({
                type: "success",
                message: meta.msg
              });
            } else {
              this.$message({
                type: "error",
                message: "删除失败，请重试或者联系管理员。"
              });
            }
            this.getUsersList()
          })
        })
        // .catch(() => {
        //   this.$message({
        //     type: "info",
        //     message: "已取消删除"
        //   });
        // });
    }
  }
};
</script>

<style>
.el-main {
  line-height: 30px;
  text-align: left;
}
</style>