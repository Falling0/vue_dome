<template>
  <div class="login-wrap">
    <el-form
      status-icon
      ref="ruleForm"
      :rules="rules"
      :model="form"
      label-width="100px"
      class="demo-ruleForm login-from"
    >
      <h3>用户登录</h3>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="loginClick">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      // 验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在3到8个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    loginClick() {
      /** 检查用户输入的数据
       *  保存cookie
       *  登录跳转
       */
      this.$refs.ruleForm.validate(res => {
        // console.log(res)
        // 如果有错误信息，停止代码执行
        if (!res) {
          this.$message.error("输入有误！");
          return;
        }
      });

      this.$myHttp.post("login", this.form).then(back_data => {
        // 判断登录状态
        if (back_data.data.meta.status == 200) {
          this.$message({
            message: "登录成功",
            type: "success"
          });
          // 将登录信息保存到localStorage（H5新增本地缓存）
          window.localStorage.setItem("token", back_data.data.data.token);
          window.localStorage.setItem("user", this.form.username)
          // 跳转到主页
          this.$router.push({ name: "Home" });
        } else if (back_data.data.meta.status != 200) {
          this.$message.error(back_data.data.meta.msg);
        }
      });
    }
  }
};
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-from {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-from .login-btn {
  width: 100%;
}
</style>