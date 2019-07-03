<template>
  <div class="login-wrap">
    <div class="login-html">
      <input id="tab-1" type="radio" name="tab" class="sign-in" checked /><label for="tab-1" class="tab">登录</label>
      <input id="tab-2" type="radio" name="tab" class="sign-up" /><label for="tab-2" class="tab">注册</label>
      <div class="login-form">
        <div class="sign-in-htm">
          <div class="group">
            <label for="loginUserName" class="label">用户名</label>
            <input id="loginUserName" type="text" class="input"  v-model="loginUserName"/>
          </div>
          <div class="group">
            <label for="loginUserUpwd" class="label">密码</label>
            <input id="loginUserUpwd" type="password" class="input" data-type="password" v-model="loginUserUpwd"/>
          </div>
          <div class="group">
            <input id="check" type="checkbox" class="check" checked />
            <label for="check"><span class="icon"></span> 记住密码</label>
          </div>
          <div class="group">
            <input type="submit" class="button" value="登录" @click="login"/>
          </div>
          <div class="hr"></div>
          <div class="foot-lnk">
            <a href="#forgot">忘记密码?</a>
          </div>
        </div>
        <div class="sign-up-htm">
          <div class="group">
            <label for="user" class="label">用户名</label>
            <input id="user" type="text" class="input" v-model="registerUserName" />
          </div>
          <div class="group">
            <label for="registerUserUpwd" class="label">密码</label>
            <input id="registerUserUpwd" type="password" class="input" data-type="password" v-model="registerUserUpwd"/>
          </div>
          <div class="group">
            <label for="registerUserCpwd" class="label">确认密码</label>
            <input id="registerUserCpwd" type="password" class="input" data-type="password" v-model="registerUserCpwd"/>
          </div>
          <div class="group">
            <input type="submit" class="button" value="注册" @click="register"/>
          </div>
          <div class="hr"></div>
          <div class="foot-lnk">
            <a for="tab-1">已注册登录?</a>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'LoginRegister',
    data () {
      return {
          loginUserName:"",
          loginUserUpwd:"",
          registerUserName:"",
          registerUserUpwd:"",
          registerUserCpwd:""
      }
    },
    methods:{
        login(){
            let uname=this.loginUserName;
            let upwd=this.loginUserUpwd;
            console.log(uname,upwd);
            let userData = {
              uname:uname,
              upwd:upwd
            };
            this.$axios.post("/login",this.$qs.stringify(userData))
              .then((res)=>{
                //console.log(res.data.data[0].uname);
                if(res.data.code==1)
                {
                    this.$store.dispatch("loginUserName",res.data.data[0].uname);
                    console.log(uname);
                    this.$router.push({
                      path:"/GoodsList"
                        });
                }
                else
                {
                    alert("用户名或者账号错误，请输入正确的用户名或者密码！");
                    this.loginUserName = "";
                    this.loginUserUpwd = "";
                    return;
                }
              })
              .catch((err)=>{
                console.log(err);
              })
        },
      //用户注册
      register(){
            let registerUserName=this.registerUserName;
            let registerUserUpwd=this.registerUserUpwd;
            let registerUserCpwd=this.registerUserCpwd;
            console.log(registerUserName,registerUserUpwd,registerUserCpwd);
            if(registerUserName=="")
            {
                alert("用户名不能为空！");
                return;
            }
            let userData = {
                registerUserName:registerUserName
            };
            this.$axios.post("/registerdo",this.$qs.stringify(userData))
              .then((res)=>{
                console.log(res);
                if(res.data.uid=="undefined")
                {
                  if(registerUserUpwd.length==0)
                  {
                    alert("密码不能为空，请输入正确的密码！");
                    return;
                  }
                  else if(registerUserUpwd!=registerUserCpwd)
                  {
                    alert("两次输入的密码不一致，请重新输入");
                    //this.registerUserName="";
                    this.registerUserUpwd="";
                    this.registerUserCpwd="";
                    return;
                  }
                  else
                  {
                    let registerData={
                      uname:registerUserName,
                      upwd:registerUserUpwd

                    };
                    this.$axios.post("/register",this.$qs.stringify(registerData))
                      .then((res)=>{
                        console.log(res.data.msg);
                        if(res.data.code==2)
                        {
                          alert("注册成功，请前往登陆页面进行登陆");
                          this.registerUserName="";
                          this.registerUserUpwd="";
                          this.registerUserCpwd="";
                        }
                      })
                      .catch((err)=>{
                        console.log(err);
                      })
                  }
                }
                else
                {
                    alert("用户名已存在，请重新输入新的用户名");
                    this.registerUserName="";
                    this.registerUserUpwd="";
                    this.registerUserCpwd="";
                    return;
                }
              })
              .catch((err)=>{
                console.log(err);
              });

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
