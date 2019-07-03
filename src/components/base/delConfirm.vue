<template>
  <div class="login-form">
    <p>您确定要删除该条记录吗？</p>
    <div class="g-form">
      <div class="g-form-line">
        <div class="g-form-btn">
          <a class="button" @click="confirmCancel">确定</a>
        </div>
      </div>
      <div class="g-form-line">
        <div class="g-form-btn">
          <a class="button" @click="closeDialog">取消</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    aid:"",
    uname:""
  },
  data () {
    return {
    }
  },
  computed: {

  },
  mounted(){
  },
  methods: {
    closeDialog(){
        this.$emit("cancel");
    },
    confirmCancel(){
      console.log(this.aid,this.uname);
      let aid=this.aid;
      let uname=this.uname;
      this.$axios.post("/delAddress",this.$qs.stringify({aid,uname}))
        .then((res)=>{
          console.log(res);
          if(res.data.status==1005)
          {
            this.$emit("cancel");
            this.$parent.$parent.getAddressList();//刷新
          }
          else
          {
            alert(res.data.msg);
          }
        })
        .catch((err)=>{
          console.log(err);
        })
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
  .g-form-line {
    padding: 15px 0;
    float:left;
  }

  .g-form-btn {
    padding-left: 100px;
  }
</style>
