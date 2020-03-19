<template>
  <el-container class="height">
    <!-- 顶部 -->
    <el-header>
      <el-col :span="1">
        <div class="grid-content bg-purple">
          <img class="logo" src="/static/logo.png" alt width="50" height="50" />
        </div>
      </el-col>
      <el-col :span="19">
        <div class="grid-content bg-purple-light">
          <h2>后台管理系统</h2>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple logout">
          <span id="user">当前用户：{{user}}</span>
          <el-button @click.stop="logOut" type="warning" round>退出</el-button>
        </div>
      </el-col>
    </el-header>

    <!-- 内容主体 -->
    <el-container>
      <!-- 左边栏 -->
      <el-aside width="200px">
        <el-col :span="24">
          <el-menu router default-active="2" class="el-menu-vertical-demo">
            <el-submenu v-for="item1 in menusList" :key="item1.id" :index="item1.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item1.authName}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="item2 in item1.children" :key="item2.id" :index="item2.path">
                  <i class="el-icon-menu"></i>
                  {{item2.authName}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <!-- 右边栏 -->
      <el-main>
        <!-- 路由组件 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menusList: [],  // 权限菜单
      user: '',       // 当前登录的用户名
    }
  },
  mounted() {
    /** 在页面渲染完成前完成数据的获取
     * 其他页面全部依赖home加载
     * 如果没有登录，直接跳转到登录页
     * 利用钩子函数，页面渲染前判断登录状态
     */
    // var token = window.localStorage.getItem("token");
    // // 这里还需要连接后端的接口来检查本地的token值与数据库中的是否一致
    // if (!token) {
    //   this.$message({
    //     message: "请先登录",
    //     type: "warning"
    //   });
    //   this.$router.push({ name: "Login" });
    // }
    this.getUser()
    this.getMenusList()
  },
  methods: {

    getUser() {
      /** 获取用户信息 */
      var name = window.localStorage.getItem("user")
      this.user = name
      console.log(name)
    },

    getMenusList() {
      /** 获取用户的权限菜单 */
      this.$myHttp({
        url: 'menus',
        method: 'get'
      }).then(back=>{
        let {data, meta} = back.data
        this.menusList = data
      })
    },


    logOut() {
      /** 退出登录 */
      // 清除token
      window.localStorage.clear("token");
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style>
.height {
  height: 100%;
}
.logo {
  margin-top: 7px;
}
.logout {
  line-height: 55px;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 20px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  /* text-align: center; */
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.el-menu-item {
  padding-left: 58px !important;
}
#user {
  margin-right: 10px;
}
</style>