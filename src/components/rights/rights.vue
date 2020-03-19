<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格 -->
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="150"></el-table-column>
      <el-table-column property="authName" label="权限名称" width="220"></el-table-column>
      <el-table-column property="path" label="路径" width="220"></el-table-column>
      <el-table-column property="level" label="层级">
          <template slot-scope="scope">
            <span v-if="scope.row.level==0">一级</span>
            <span v-if="scope.row.level==1">二级</span>
            <span v-if="scope.row.level==2">三级</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
  
    getRightsList() {
      /** 获取权限列表数据
       * @return json 权限列表数据
       */
      this.$myHttp({
          url:"rights/list",
          methods: 'get',
          }).then(back => {
        let { data, meta } = back.data;
        if(meta.status == 200) {
            this.tableData = data;
        } else {
            this.$message({
                message: meta.msg,
                type: 'error'
            })
        }
      });
    }
  },
  mounted() {
    /** 在页面渲染完成前完成数据的获取 */
    this.getRightsList();
  }
};
</script>

<style>
.el-table{
    margin-top: 15px;
}
.el-table__header{
    line-height: 20px;
}
</style>
