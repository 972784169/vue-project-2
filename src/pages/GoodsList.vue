<template>
    <div>
      <my-bread>
        <span>Goods</span>
      </my-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default" :class="{'cur':this.defaultChecked===true}" @click="sortTypeClick('true',$event)">Default</a>
            <a href="javascript:void(0)" class="price" :class="{'cur':this.moneyChecked===true}" @click="sortTypeClick('false',$event)">Price<svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur':priceChecked==='all'}" @click="clickAll">All</a></dd>
                <dd v-for="(item,index) in priceFilter" >
                  <a href="javascript:void(0)" @click="setPriceShow(index);sortPrice(item)" :class="{'cur':priceChecked===index}">{{item.startPrice}} - {{item.endPrice}}</a>
                </dd>

              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <template v-for="item in goodsList">
                    <li>
                      <div class="pic">
                        <a href="#"><img v-lazy="item.productImage" alt=""></a>
                      </div>
                      <div class="main">
                        <div class="name">{{item.productName}}</div>
                        <div class="price">{{item.salePrice}}</div>
                        <div class="btn-area">
                          <a href="javascript:;" class="btn btn--m" @click="addCart(item)">加入购物车</a>
                        </div>
                      </div>
                    </li>
                  </template>

                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <my-dialog :isShow="isShowDialog" @on-close="closeDialog('isShowDialog')">
        <p>用户添加购物车成功</p>
      </my-dialog>
    </div>
</template>
<script>
import Bread from '../components/Bread'
import Dialog from '../components/base/Dialog'
    export default{
         name:'GoodsList',
        components:{
            myBread:Bread,
            myDialog:Dialog
        },
        data(){
            return {
              isShowDialog:false,
              goodsList:[],
              priceFilter:[
                {
                    startPrice:"0.00",
                    endPrice:"500.00"
                },
                {
                  startPrice:"501.00",
                  endPrice:"1000.00"
                },
                {
                  startPrice:"1001.00",
                  endPrice:"2000.00"
                },
                {
                  startPrice:"2001.00",
                  endPrice:"3000.00"
                }
              ],
              priceChecked:'all',
              filterBy:false,
              overLayFlag:false,
              defaultChecked:true,
              moneyChecked:false,
              username:this.$store.getters.username
            }
        },
      mounted(){
              this.getGoodList();
      },
      methods:{
          getGoodList(){
            this.$axios.get("/goods")
              .then((res)=>{
                console.log(res.data);
                this.goodsList=res.data;
            })
              .catch((err)=>{console.log(err);})
          },
        showFilterPop(){
          this.filterBy = true;
          this.overLayFlag=true;
        },
        closePop(){
          this.filterBy = false;
          this.overLayFlag=false;
        },
        setPriceShow(index){
          this.priceChecked=index;
          this.closePop();
        },
        //价格过滤
        sortPrice(item){
            this.goodsList = [];//清空
            console.log(item.startPrice,item.endPrice);
            let data={
              priceMin:item.startPrice,
              priceMax:item.endPrice
            };
            this.$axios.post("/sortPrice",
              this.$qs.stringify(data)
            )
              .then((res)=>{
                console.log(res.data.length);
                if(res.data.length==0)
                {
                    alert("没有匹配到符合条件的数据");
                    return;
                }
                else
                {
                  this.goodsList = res.data;
                }

              })
              .catch((err)=>{
                console.log(err);
              })
        },
        //点击all数据全部显示
        clickAll(){
              this.priceChecked='all';
              this.getGoodList();

        },
        //排序
        sortTypeClick(boolean,e){
          console.log(e.srcElement.textContent);
          let textContent = e.srcElement.textContent;
          if(textContent=="Price")
          {
              this.moneyChecked = true;
              this.defaultChecked = false;
          }
          else
          {
            this.moneyChecked = false;
            this.defaultChecked = true;
          }
          this.goodsList = [];//清空
          this.$axios.get("/sort?sortType="+boolean)
            .then((res)=>{
              console.log(res.data);
              this.goodsList = res.data;
            })
            .catch((err)=>{console.log(err)})
        },
        //加入购物车
        addCart(item){
            let userCartData = {
              uname:this.username,
              productName:item.productName,
              productPrice:item.salePrice,
              productImage:item.productImage
            };
            this.$axios.post("/addCart",this.$qs.stringify(userCartData))
              .then((res)=>{
                console.log(res.data.status);
                if(res.data.status==-1001)
                {
                    alert("用户未登陆，请先登陆");
                    return;
                }
                else
                    this.isShowDialog=true;
              })
              .catch((err)=>{
                console.log(err);
              })
        },
        closeDialog(attr){
          this[attr] = false;
        }
      }
    }
</script>
