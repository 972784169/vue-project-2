<template>
  <div class="login-form">
    <div class="g-form">
      <div class="g-form-line">
        <span class="g-form-label">用户名：</span>
        <div class="g-form-input">
          <input type="text" v-model="username"
         placeholder="请输入收件人姓名">
        </div>
        <span class="g-form-error">{{ userErrors.errorText }}</span>
      </div>
      <div class="g-form-line">
        <span class="g-form-label">国家：</span>
        <div class="g-form-input">
          <select name="" v-model="countrySelected" @change="changeCountry($event)">
            <option value="">--请选择--</option>
            <option value="中国">中国</option>
          </select>
          <select name="" v-model="provinceSelected" @change="changeProvince($event)">
            <option value="">--请选择--</option>
            <option :value="item.provincial" v-for="(item,index) in provinceList">{{item.provincial}}</option>
          </select>
          <select name="" v-model="citySelected" @change="changeCity($event)">
            <option value="">--请选择--</option>
            <option :value="item.city" v-for="item in cityList">{{item.city}}</option>
          </select>
        </div>
        <span class="g-form-error">{{chinaProvinceCityErrors.errorText}}</span>
      </div>
      <div class="g-form-line">
        <span class="g-form-label">详细信息：</span>
        <div class="g-form-input">
          <input type="text" v-model="streetname"
                 placeholder="请输入详细信息">
        </div>
        <span class="g-form-error">{{streetnameErrors.errorText}}</span>
      </div>
      <div class="g-form-line">
        <span class="g-form-label">手机号码：</span>
        <div class="g-form-input">
          <input type="text" v-model="cellphone"
                 placeholder="请输入手机号码信息">
        </div>
        <span class="g-form-error">{{cellphoneErrors.errorText}}</span>
      </div>
      <div class="g-form-line">
        <span class="g-form-label">固定电话：</span>
        <div class="g-form-input">
          <input type="text" v-model="fixedphone"
                 placeholder="请输入固定电话信息">
        </div>
        <span class="g-form-error"></span>
      </div>
      <div class="g-form-line">
        <span class="g-form-label" v-model="email">邮箱：</span>
        <div class="g-form-input">
          <input type="text"
                 placeholder="请输入邮箱信息" v-model="email">
        </div>
        <span class="g-form-error"></span>
      </div>
      <div class="g-form-line">
        <div class="g-form-btn">
          <a class="button" @click="define">确定</a>
        </div>
      </div>
      <p>{{errorText}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name:'OrderConfrim',
  data () {
    return {
      errorText:"",
      provinceList:[],
      cityList:[],
      provinceSelected:'',
      username:"",
      countrySelected:"",
      citySelected:"",
      streetname:"",
      cellphone:"",
      fixedphone:"",
      email:""


    }
  },
  computed: {
      //用户名是否为空
    userErrors () {
      let errorText, status
      if (!/\S/.test(this.username)) {
        status = false
        errorText = '用户名为空'
      }
      else {
        status = true
        errorText = ''
      }
      if (!this.userNameFlag) {
        errorText = ''
        this.userNameFlag = true
      }
      return {
        status,
        errorText
      }
    },
    //详细地址是否为空
    streetnameErrors(){
      let errorText, status
      if (!/\S/.test(this.streetname)) {
        status = false
        errorText = '用户的详细地址不能为空'
      }
      else {
        status = true
        errorText = ''
      }
      if (!this.streetNameFlag) {
        errorText = ''
        this.streetNameFlag = true
      }
      return {
        status,
        errorText
      }
    },
    chinaProvinceCityErrors(){
      let errorText, status
      if (!/\S/.test(this.provinceSelected)||!/\S/.test(this.countrySelected)||!/\S/.test(this.citySelected)) {
        status = false
        errorText = '用户的城市信息不能为空'
      }
      else {
        status = true
        errorText = ''
      }
      if (!this.chinaProvinceCityFlag) {
        errorText = ''
        this.chinaProvinceCityFlag = true
      }
      return {
        status,
        errorText
      }
    },
    cellphoneErrors(){
      let errorText, status
      if (!/\S/.test(this.cellphone)) {
        status = false
        errorText = '用户的手机号码不能为空'
      }
      else {
        status = true
        errorText = ''
      }
      if (!this.cellphoneFlag) {
        errorText = ''
        this.cellphoneFlag = true
      }
      return {
        status,
        errorText
      }
    },
    /*fixedphoneErrors(){
      let errorText, status
      if (!/\S/.test(this.fixedphone)) {
        status = false
        errorText = '用户的固定电话号码不能为空'
      }
      else {
        status = true
        errorText = ''
      }
      if (!this.fixedphoneFlag) {
        errorText = ''
        this.fixedphoneFlag = true
      }
      return {
        status,
        errorText
      }
    },
    emailErrors(){
      let errorText, status
      if (!/\S/.test(this.email)) {
        status = false
        errorText = '用户的邮箱不能为空'
      }
      else {
        status = true
        errorText = ''
      }
      if (!this.emailFlag) {
        errorText = ''
        this.emailFlag = true
      }
      return {
        status,
        errorText
      }
    }*/
  },
  mounted(){
    this.getProvinceCity();
  },
  methods: {
    getProvinceCity(){
        this.$axios.get("/getProvince")
          .then((res)=>{
            console.log(res);
            if(res.data.status==1006)
            {
              this.provinceList=res.data.msg;
              this.$axios.get("/getCity")
                .then((res)=>{
                  console.log(res);
                  if(res.data.status==1007)
                  {
                    this.cityList=res.data.msg;
                  }
                  else
                  {
                    alert("查询城市失败");
                  }

                })
                .catch((err)=>{
                  console.log(err);
                });
            }
            else
            {
                alert("查询省份信息失败");
            }

          })
          .catch((err)=>{
            console.log(err);
          })
    },
    //用户选择省份信息显示对应的城市信息
    changeProvince(e){
        //获取用户选择的对应的索引
       let selectedIndex=e.target.selectedIndex;
      console.log(e);
        this.provinceSelected=e.target.value;
        if(e.target.value.trim()=="")
        {
            alert("用户没有选择省份查询不到对应的城市信息");
            this.cityList="";
            return;
        }
        console.log(this.provinceSelected);
        this.$axios.post("/changeCity",this.$qs.stringify({index:selectedIndex}))
          .then((res)=>{
            console.log(res.data.status);
            if(res.data.status==1008)
            {
              this.cityList=res.data.msg;
            }
            else
            {
                alert("没有查询到对应的城市信息，请重试");
            }
          })
          .catch((err)=>{
            console.log(err);
          });
    },
    //获取用户选择的国家信息
    changeCountry(e){
       // console.log(e.target.value);
        this.provinceSelected = e.target.value;
    },
    //获取用户选择的城市信息
    changeCity(e){
      //console.log(e.target.value);
      this.citySelected=e.target.value;
    },
    //用户新增收件地址信息和获取用户选择的省份
    define(){
      let provinceSelected=this.provinceSelected;
      let username=this.username;
      let countrySelected=this.countrySelected;
      let citySelected=this.citySelected;
      let streetname=this.streetname;
      let cellphone=this.cellphone;
      let fixedphone=this.fixedphone;
      let email=this.email;
      console.log(provinceSelected,username,countrySelected,citySelected,streetname,cellphone,fixedphone,email);
      let data={
          uname:username,
          country:countrySelected,
          province:provinceSelected,
          city:citySelected,
          streetname:streetname,
          cellphone:cellphone,
          fixedphone:fixedphone,
          email:email
      };
      if (!this.userErrors.status || !this.streetnameErrors.status|| !this.cellphoneErrors.status) {
        this.errorText = '部分选项未通过'
        return;
      }
      else {
          this.errorText="";
        this.$axios.post("/addUserReseive",this.$qs.stringify(data))
          .then((res)=>{
            console.log(res);
            //console.log(this.$parent);
            if(res.data.status==1009)
            {
              this.$emit("closeDialog");
              //用户新增收件地址成功后调用父组件里的getAddressList()方法，父组件刷新用户的收件地址数据
              this.$parent.$parent.getAddressList();
            }
            else
            {
                alert(res.data.msg);
            }


          })
          .catch((err)=>{
            console.log(err);
          });
      }

    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  body {
    background: #f0f2f5;
    font-family: "Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Hiragino Sans GB W3","Microsoft YaHei UI","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
    font-size: 14px;
    color: #444;
  }
  .app-head {
    background: #363636;
    color: #b2b2b2;
    height: 90px;
    line-height: 90px;
    width: 100%;
  }
  .app-head-inner {
    width: 1200px;
    margin: 0 auto;
  }
  .head-logo {
    float: left;
  }
  .app-head-inner img {
    width: 50px;
    margin-top: 20px;
  }
  .head-nav {
    float: right;
  }
  .head-nav ul {
    overflow: hidden;
  }
  .head-nav li {
    cursor: pointer;
    float: left;
  }
  .nav-pile {
    padding: 0 10px;
  }
  .app-foot {
    text-align: center;
    height: 80px;
    width: 100%;
    line-height: 80px;
    background: #e3e4e8;
    clear: both;
    margin-top: 30px;
  }
  .container {
    width: 1200px;
    margin: 0 auto;
  }
  .hr {
    height: 1px;
    width: 100%;
    background: #ddd;
  }
  .button {
    background: #4fc08d;
    color: #fff;
    display: inline-block;
    padding: 10px 20px;
    cursor: pointer;
  }
  .button:hover {
    background: #4fc08d;
  }
  .g-form {

  }
  .g-form-line {
    padding: 15px 0;
  }
  .g-form-label {
    width: 100px;
    font-size: 16px;
    display: inline-block;
  }
  .g-form-input {
    display: inline-block;
  }
  .g-form-input input {
    height: 30px;
    width: 200px;
    line-height: 30px;
    vertical-align: middle;
    padding: 0 10px;
    border: 1px solid #ccc;
  }
  .g-form-btn {
    padding-left: 100px;
  }
  .g-form-error {
    color: red;
    padding-left: 15px;
  }
</style>
