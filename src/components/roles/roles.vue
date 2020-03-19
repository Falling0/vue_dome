<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色按钮 -->
    <el-button id="add_button" @click.stop="addRoleShowButton" type="success" plain>添加角色</el-button>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <!-- 折叠数据 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="item in scope.row.children" :key="item.id">
            <el-col :span="6">
                <el-tag closable>{{item.authName}}</el-tag> >
            </el-col>
            <el-col :span="18">
                <el-row v-for="item2 in item.children" :key="item2.id">
                    <el-col :span="6">
                        <el-tag closable type="warning">{{item2.authName}}</el-tag> >
                    </el-col>
                    <el-col :span="18">
                        <el-tag @close="deleteTag(item2, key3, scope.row.id, item3.id)" closable type="danger" v-for="(item3, key3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                    </el-col>
                </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 行标题 -->
      <el-table-column type="index" width="100"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" prop="desc">
        <template slot-scope="scope">
          <el-button
            @click.stop="editRolesShowButton(scope.row)"
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
          ></el-button>
          <el-button
            @click.stop="rightsIsShow(scope.row)"
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
          ></el-button>
          <el-button
            @click="roleDelete(scope.row.id)"
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限弹窗 -->
    <el-dialog title="分配权限" :visible.sync="rightsShow">
      <el-tree
        ref="tree"
        default-expand-all
        :data="rightsData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys=checkedArr
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightsShow  = false">取 消</el-button>
        <el-button type="primary" @click="rightsEditPost()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色弹窗 -->
    <el-dialog title="添加角色" :visible.sync="addRoleShow">
      <el-form :model="addRolesData">
        <el-form-item label="角色名称" label-width="200px">
          <el-input v-model="addRolesData.roleName" autocomplete="off" style="width:350px"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="200px">
          <el-input v-model="addRolesData.roleDesc" autocomplete="off" style="width:350px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleShow = false">取 消</el-button>
        <el-button type="primary" @click="addRolesPost">确 定</el-button>
      </div>
    </el-dialog>    

    <!-- 修改角色弹窗 -->
    <el-dialog title="修改角色信息" :visible.sync="editRoleShow">
      <el-form :model="editRolesData">
        <el-form-item label="角色名称" label-width="200px">
          <el-input v-model="editRolesData.roleName" autocomplete="off" style="width:350px"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="200px">
          <el-input v-model="editRolesData.roleDesc" autocomplete="off" style="width:350px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleShow = false">取 消</el-button>
        <el-button type="primary" @click="editRolesPost">确 定</el-button>
      </div>
    </el-dialog>  

  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],      // 角色列表表格中的数据
      rightsShow: false,  // 分配权限面板的开关
      rightsData: [],     // 所有可选的权限数据
      defaultProps: {     // 所有权限列表中所需要显示的数据字段
        children: 'children',
        label: 'authName'
      },
      checkedArr: [],     // 选中的权限数组
      roleID: '',         // 角色ID
      addRoleShow: false, // 添加角色弹窗开关
      addRolesData: {roleName: '', roleDesc: ''},   // 添加角色的表单数据
      editRoleShow: false, // 修改角色弹窗开关
      editRolesData: {roleID: '', roleName: '', roleDesc: ''}   // 修改角色的表单数据
    }
  },
  methods: {

    getRoleLists() {
      /** 获取角色权限数据
       * @return 角色数据列表
       */
      this.$myHttp({
        url: "roles",
        method: "get"
      }).then(back => {
        let { data, meta } = back.data;
        if (meta.status == 200) {
          this.tableData = data;
        } else {
          this.$message({
            message: meta.msg,
            type: "error"
          })
        }
      })
    },

    deleteTag(item, key, roleId, rightsId) {
      /** 删除角色权限
       * @param item 需要删除的权限数组
       * @param key 需要删除数组下标
       * @param roleId 角色ID
       * @param rightsId 权限ID
       * @return null
       */
      this.$confirm("确定删除该权限？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then( () => {
        this.$myHttp({
          url: `roles/${roleId}/rights/${rightsId}`,
          method: 'delete'
        }).then( back => {
          let { data, meta } = back.data;
          if (meta.status == 200) {
            item.children.splice(key, 1);
            this.$message({
              message: meta.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: meta.msg,
              type: "error"
            });
          }
        })
      })
    },

    rightsIsShow(rolesData) {
      /** 控制权限分配面板的显示
       * @param rolesData 该角色的所有信息
       * @rerurn 所有的权限数据列表
       */
      this.roleID = rolesData.id
      // 获取所有的权限列表
      this.$myHttp({
        url: 'rights/tree',
        method: 'get'
      }).then(back => {
        let {data, meta} = back.data;
        if(meta.status == 200) {
          this.rightsData = data
        } else {
          this.$message({message:meta.msg, type:"error"})
        }
      })

      // 遍历数组获取已有的权限ID
      var new_arr = [];
      var arr = rolesData.children;
      arr.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            new_arr.push(item3.id)
          })
        })   
      });
      this.checkedArr = new_arr
      // 显示弹窗
      this.rightsShow = true;
    },

    addRoleShowButton() {
      /** 显示添加新角色的面板 */
      this.addRoleShow = true
    },

    editRolesShowButton(rolesData) {
      /** 显示修改角色信息的弹窗
       * @param rolesData 角色的详细数据
       */
      this.editRoleShow = true
      this.editRolesData.roleID = rolesData.id
      this.editRolesData.roleName = rolesData.roleName
      this.editRolesData.roleDesc = rolesData.roleDesc
    },

    rightsEditPost() {
      /** 修改角色权限 */
      var a = this.$refs.tree.getCheckedKeys();
      var b = this.$refs.tree.getHalfCheckedKeys();
      var rids = a.concat(b).join();
      this.$myHttp({
        url: `roles/${this.roleID}/rights`,
        method: 'post',
        data: {rids}
      }).then(back => {
        let {data, meta} = back.data;
        if(meta.status == 200) {
          this.$message({message:meta.msg, type:"success"})
          this.getRoleLists()
        } else {
          this.$message({message:meta.msg, type:"error"})
        }
      })
      this.rightsShow = false
    },

    addRolesPost() {
      /** 提交新的角色数据 */
      this.$myHttp({
        url: 'roles',
        method: 'post',
        data: this.addRolesData
      }).then(back=>{
        let {data, meta} = back.data;
        if(meta.status == 201) {
          this.$message({message:meta.msg, type:"success"})
          this.addRoleShow = false
          this.getRoleLists() 
        } else {
          this.$message({message:meta.msg, type:"error"})
        }
      })
    },

    roleDelete(roleID) {
      /** 删除角色
       * @param roleID 角色ID
       */
      this.$confirm("是否删除该角色", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"        
      }).then(()=>{
        this.$myHttp({
          url:`roles/${roleID}`,
          method:"delete"
        }).then(back=>{
          let {data, meta} = back.data
          if(meta.status == 200) {
            this.$message({message:meta.msg, type:"success"})
            this.getRoleLists()
          } else {
            this.$message({message:meta.msg, type:"error"})
          }
        })
      })
    },

    editRolesPost() {
      /** 提交修改角色的表单数据 */
      this.$myHttp({
        url: `roles/${this.editRolesData.roleID}`,
        method: 'put',
        data: this.editRolesData
      }).then(back=>{
        let {data, meta} = back.data
        if(meta.status == 200) {
          this.$message({message:meta.msg, type:"success"})
          this.editRoleShow = false
          this.getRoleLists()
        } else {
          this.$message({message:meta.msg, type:"error"})
        }
      })
    }

  },

  mounted() {
    /** 在页面渲染完成前完成数据的获取 */
    this.getRoleLists();
  }
};
</script>

<style>
#add_button {
  margin-top: 15px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

element.style {
}
.el-table th, .el-table tr {
    background-color: #FFF;
}
user agent stylesheet
tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
}
.el-table__body, .el-table__footer, .el-table__header {
    table-layout: fixed;
    border-collapse: separate;
}
user agent stylesheet
table {
    border-collapse: separate;
    border-spacing: 2px;
}
.el-table {
    position: relative;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    max-width: 100%;
    font-size: 14px;
    color: #606266;
}
.el-main{
    line-height: 0;
}
.el-tag{
    margin-top: 10px;
    margin-left: 5px;
}
</style>