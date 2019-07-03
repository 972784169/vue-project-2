<template>
    <div>
      <my-bread>
        <span>OrderList</span>
      </my-bread>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p v-for="item in orderListFilter">
              <span>订单号：{{item.orderno}}</span>
              <span>订单金额：{{item.totalprice | currency('￥')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <!--<a class="btn btn--m">购物车</a>-->
                <router-link class="btn btn--m" :to="{path:'/Cart'}">购物车</router-link>
              </div>
              <div class="btn-r-wrap">
                <!--<a class="btn btn--m">商品首页</a>-->
                <router-link class="btn btn--m" :to="{path:'/GoodsList'}">商品首页</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="shipping-addr-more">
          <a class="addr-more-btn up-down-btn" href="javascript:;" @click="addOrderListFilter()" :class="{'open':this.limit>1}">
            更多
            <i class="i-up-down">
              <i class="i-up-down-l"></i>
              <i class="i-up-down-r"></i>
            </i>
          </a>
        </div>
      </div>
    </div>
</template>
<script>
  import Bread from '../components/Bread'
  import {currency} from '../util/currency'
    export default{
        name:'OrderSuccess',
        components:{
          myBread:Bread
        },
        data(){
            return{
              limit:1,
              orderList:[]
            }
        },
        computed:{
            uname(){
                return this.$store.getters.username
            },
            orderListFilter(){
                return this.orderList.slice(0,this.limit);
            }
        },
        mounted(){
          this.getOrder();
        },
        filters:{
          currency:currency
        },
        methods:{
            getOrder(){
              this.$axios.post("/queryOrder",this.$qs.stringify({username:this.uname}))
                .then((res)=>{
                  console.log(res);
                  this.orderList=res.data.msg;
                })
                .catch((err)=>{
                  console.log(err);
                });
            },
              addOrderListFilter(){
                if(this.limit==1)
                {
                    this.limit=this.orderList.length;
                }
                else
                {
                    this.limit=1;
                }
              }
        }
    }
</script>
