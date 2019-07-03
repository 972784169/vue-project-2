/**
 * Created by Administrator on 2019/6/14.
 */
const http = require("http");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");        //处理post请求
const cookieParser = require("cookie-parser");    //session
const expressSession = require("express-session");//session
const cors = require("cors");
const pool = require("./pool");


const app = express();
const server = http.createServer(app);
server.listen(3307);
//4:配置第三方模块
//4.1:配置跨域模块
//origin 允许来自哪个域名下跨域访问
app.use(cors({
    origin:["http://127.0.0.1"],
    credentials:true
}));
//4.2:post  req.body.uname
app.use(bodyParser.urlencoded({extended:false}));
//4.3:cookie/session
app.use(cookieParser());
app.use(expressSession({
    resave:false,           //每次请求是否重新设置session
    saveUninitialized:true,//每次请求是否设置cookie
    secret:"teducn",       //https加密码传输，密钥
}));
//登陆拦截
app.use((req,res,next)=>{
  console.log(req.cookies);
  if(req.cookies.userid)
  {
    next();
  }
  else
  {
    console.log(req.path);
    if(req.path=="/login"|| req.path=="/loginOut"|| req.path=="/goods" || req.path=="/sortPrice"||req.path=="/sort" ||req.path=="/registerdo"||req.path=="/register")
    {
        next();
    }
    else
    {
      res.json({status:"-1001",msg:"当前未登录"});
    }
  }
})
//用户登陆
app.post("/login",(req,res)=>{
  let uname = req.body.uname;
  let upwd = req.body.upwd;
  console.log(uname,upwd);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql = `select uid,uname,upwd from userlist where uname=? and upwd=?`;
    conn.query(sql,[uname,upwd],(err,result)=>{
      if(err) throw err;
      console.log(result);
      if(result.length>0)
      {
        let date = new Date().getTime();
        fs.appendFile("../user/userlog.log",`登录名为${uname},密码为${upwd},登陆时间为${date}\r\n`,(err)=>{
          console.log("写登陆日志成功");
        })
        res.cookie("userid",result[0].uid);
        res.json({code:1,data:result});

      }
      else
      {
        res.json({code:-1,mag:"用户名或者密码错误"});
      }
      conn.release();
    });
  })
});
//用户退出
app.post("/loginOut",(req,res)=>{
  res.clearCookie("userid");
  res.json({status:2,msg:"退出成功"});
})
//判断用户是否注册如果存在
app.post("/registerdo",(req,res)=>{
  let uname=req.body.registerUserName;
  console.log(uname);
  pool.getConnection((err,conn)=>{
    let sql = `select uid from userlist where uname=?`;
    conn.query(sql,[uname],(err,result)=>{
      console.log(result[0]);
      if(result[0]!=undefined)
      {
        res.json({uid:result[0]});
      }
      else
      {
        res.json({uid:"undefined"});
      }

      conn.release();
    });
  })
})

//用户注册
app.post("/register",(req,res)=>{
  let uname = req.body.uname;
  let upwd = req.body.upwd;
  console.log(uname,upwd);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql = `insert into userlist(uname,upwd) values (?,?)`;
    conn.query(sql,[uname,upwd],(err,result)=>{
      if(err) throw err;
      if(result.affectedRows>0)
      {
        res.json({code:2,msg:uname});
      }
      else
      {
        res.json({code:-2,msg:"用户注册失败"});
      }
      conn.release();
    });
  })
});
//查询
app.get("/goods",(req,res)=>{
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    var sql = `select productId,productName,salePrice,checked,productNum,productImage from goods`;
    conn.query(sql,(err,result)=>{
      if(err) throw err;
      console.log(result);
      res.json(result);
      conn.release();
    })
  })
})

//价格过滤
app.post("/sortPrice",(req,res)=>{
  let priceMin = req.body.priceMin;
  let priceMax = req.body.priceMax;
  console.log(priceMin,priceMax);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql = `select productId,productName,salePrice,checked,productNum,productImage from goods`;
    sql+=` where salePrice between ? and ?`;

    conn.query(sql,[priceMin,priceMax],(err,result)=>{
      if(err) throw err;
      console.log(sql);
      res.json(result);
      conn.release();
    });
  })
})

//排序
app.get("/sort",(req,res)=>{
  console.log(55555555555);
  let sortType=req.query.sortType;
  let sql = "";
  console.log(sortType);
  if(sortType=="false")
  {
     sql = `select productId,productName,salePrice,checked,productNum,productImage from goods order by salePrice`;
  }
  else
  {
    sql = `select productId,productName,salePrice,checked,productNum,productImage from goods order by productName`
  }
  console.log(sql);
  pool.getConnection((err,conn)=>{
    if(err) throw err;

    conn.query(sql,(err,result)=>{
      if(err) throw err;
      console.log(result);
      res.json(result);
      conn.release();
    })
  })
})
//加入购物车
app.post("/addCart",(req,res)=>{
  let uname=req.body.uname;
  let productName=req.body.productName;
  let productPrice=req.body.productPrice;
  let productImage=req.body.productImage
  console.log(uname,productName,productPrice,productImage);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`insert into cartlist(uname,productName,salePrice,productImage,productNum) values(?,?,?,?,10)`;
    conn.query(sql,[uname,productName,productPrice,productImage],(err,result)=>{
      if(err) throw err;
      if(result.affectedRows>0)
      {
        res.json({status:6,msg:"添加购物车成功"});
      }
      else
      {
        res.json({status:-6,msg:"添加购物车失败"});
      }
      conn.release();
    });
  })
})

//查询用户购物车

app.post("/queryUserCart",(req,res)=>{
  let uname = req.body.uname;
  console.log(uname);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`select iid,uname,productName,salePrice,productImage,productNum,checked from cartlist where uname=?`;
    conn.query(sql,[uname],(err,result)=>{
      console.log(result);
      res.json(result);
      conn.release();
    });
  })
});
//判断用户是否全选中购物车的产品
app.post("/checkedAll",(req,res)=>{
  let uname = req.body.uname;
  let allChecked =req.body.checkAll;
  console.log(uname,allChecked);
  if(allChecked=="true")
  {
    allChecked="1";
  }
  else
  {
    allChecked="0";
  }
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`update cartlist set checked=? where uname=?`;
    conn.query(sql,[allChecked,uname],(err,result)=>{
      if(err) throw err;
      if(result.affectedRows>0)
      {
        console.log("状态修改成功");
      }
      else
      {
        console.log("状态修改失败");

      }
      conn.release();
    });
  })
});
//判断用户是否选中单件物品
app.post("/checked",(req,res)=>{
  let iid=req.body.iid;
  let uname=req.body.uname;
  let checked=req.body.checked;
  if(checked=="true")
  {
    checked="1";
  }
  else
  {
    checked="0";
  }
  console.log(iid,uname,checked);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`update cartlist set checked=? where uname=? and iid=?`;
    conn.query(sql,[checked,uname,iid],(err,result)=>{
      if(err) throw err;
      if(result.affectedRows>0)
      {
        console.log("单件商品状态修改成功");
      }
      else
      {
        console.log("单件商品状态修改失败");
      }
      conn.release();
    })
  })
});
//用户删除商品操作
app.post("/del",(req,res)=>{
  let iid=req.body.iid;
  let uname=req.body.uname;
  console.log(iid,uname);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`delete from cartlist where uname=? and iid=?`;
    conn.query(sql,[uname,iid],(err,result)=>{
      if(err) throw err;
      if(result.affectedRows>0)
      {
        res.json({status:1002,msg:"用户删除购物车商品成功"});
      }
      else
      {
        res.json({status:-1002,msg:"用户删除购物车商品失败"});
      }
      conn.release();
    });
  })
});
//判断用户是否购物车里有商品，如没有则前台给出提示不跳转到购物车页面反之跳转到购物车页面
app.post("/queryCart",(req,res)=>{
  console.log(10101010);
  let uname=req.body.uname;
  console.log(uname);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`select iid,productName,uname,salePrice,productImage,checked,productNum from cartlist where uname=?`;
    conn.query(sql,[uname],(err,result)=>{
      if(err) throw err;
      console.log(result);
      if(result.length>0)
      {
        res.json({status:1003,msg:"查询用户购物车数据成功"});
      }
      else
      {
        res.json({status:-1003,msg:"用户没有添加商品到购物车，请前往购买页面"});
      }
      conn.release();
    });
  })
});
//获取用户地址
app.post("/getAddressList",(req,res)=>{
  let uname=req.body.uname;
  console.log(uname);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`select aid,uid,username,streetname,province,city,country,address,cellphone,fixedphone,postcode,is_default`;
    sql+=` from addresslist where username=?`;
    conn.query(sql,[uname],(err,result)=>{
      if(err) throw err;
      if(result.length>0)
      {
        res.json({status:1004,msg:result});
      }
      else
      {
        res.json({status:-1004,msg:result});
      }
      conn.release();
    });
  })

})

//用户删除地址
app.post("/delAddress",(req,res)=>{
  let aid=req.body.aid;
  let uname=req.body.uname;
  console.log(aid,uname);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`delete from addresslist where username=? and aid=?`;
    conn.query(sql,[uname,aid],(err,result)=>{
      if(err) throw err;
      if(result.affectedRows>0)
      {
        res.json({status:1005,msg:"用户删除地址成功"});
      }
      else
      {
        res.json({status:-1005,msg:"用户删除地址失败"});
      }
      conn.release();
    });
  })
})
//获取省份信息
app.get("/getProvince",(req,res)=>{
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`select  provincial,pid from provincial`;
    conn.query(sql,(err,result)=>{
      if(err) throw  err;
      if(result.length>0)
      {
        res.json({status:1006,msg:result});
      }
      else
      {
        res.json({status:-1006,msg:result});
      }
      conn.release();
    });
  })
});
//获取城市信息
app.get("/getCity",(req,res)=>{
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`select cid,city,pid from city`;
    conn.query(sql,(err,result)=>{
      if(err) throw  err;
      if(result.length>0)
      {
        res.json({status:1007,msg:result});
      }
      else
      {
        res.json({status:-1007,msg:result});
      }
      conn.release();
    });
  })
});
//用户选择省份信息查询对应的城市信息
app.post("/changeCity",(req,res)=>{
  let pid=req.body.index;
  console.log(pid);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`select cid,city,pid from city where pid=?`;
    conn.query(sql,[pid],(err,result)=>{
      if(err) throw err;
      console.log(result);
      if(result.length>0)
      {
        res.json({status:1008,msg:result});
      }
      else
      {
        res.json({status:-1008,msg:result});
      }
      conn.release();
    });
  })
});
//添加用户收件地址信息
app.post("/addUserReseive",(req,res)=>{
  let uname=req.body.uname;
  let country=req.body.country;
  let province=req.body.province;
  let city=req.body.city;
  let streetname=req.body.streetname;
  let cellphone=req.body.cellphone;
  let fixedphone=req.body.fixedphone;
  let email=req.body.email;
  console.log(uname,country,province,city,streetname,cellphone,fixedphone,email);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`insert into addresslist(username,province,city,country,streetname,address,cellphone,fixedphone,is_default)`;
    sql+=` values(?,?,?,?,?,?,?,?,"0")`;
    conn.query(sql,[uname,province,city,country,streetname,email,cellphone,fixedphone],(err,result)=>{
      if(err) throw err;
      if(result.affectedRows>0)
      {
        res.json({status:1009,msg:"用户新增收件地址成功"});
      }
      else
      {
        res.json({status:1009,msg:"用户新增收件地址失败"});
      }
      conn.release();
    });
  })
});
//设置用户收件默认地址
app.post("/defaultAddress",(req,res)=>{
  let aid=req.body.aid;
  let uname=req.body.uname;
  console.log(aid,uname);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`update addresslist set is_default="1" where username=? and aid=?`;
    conn.query(sql,[uname,aid],(err,result)=>{
      if(err) throw err;
      if(result.affectedRows>0)
      {
        res.json({status:1010,msg:"设置默认地址成功"});
      }
      else
      {
        res.json({status:-1010,msg:"设置默认地址失败"});
      }
      conn.release();
    });
  })
});
//当用户设为默认地址时，其他的地址要吧is_default设为flase---0
app.post("/otherAddress",(req,res)=>{
  let aid=req.body.aid;
  let uname=req.body.uname;
  console.log(aid,uname);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`update addresslist set is_default="0" where username =? and aid<>?`;
    conn.query(sql,[uname,aid],(err,result)=>{
      if(err) throw err;
      if(result.affectedRows>0)
      {
        res.json({status:1011,msg:"设置默认地址成功"});
      }
      else
      {
        res.json({status:-1011,msg:"设置默认地址失败"});
      }
      conn.release();
    });
  })
});
//查询用户订单
app.post("/queryOrderCart",(req,res)=>{
  let uname = req.body.uname;
  console.log(uname);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`select iid,uname,productName,salePrice,productImage,productNum,checked from cartlist where uname=? and checked='1'`;
    conn.query(sql,[uname],(err,result)=>{
      if(result.length>0)
      {
        res.json({status:1012,msg:result});
      }
      else
      {
        res.json({status:-1012,msg:"未查询到用户的订单列表，请重试"});
      }
      conn.release();
    });
  })
});
//创建用户订单
app.post("/createOrder",(req,res)=>{
  let orderNo=req.body.orderNo;
  let uname=req.body.username;
  let totalPrice=req.body.totalPrice;
  console.log(orderNo,uname,totalPrice);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`insert into order_detail(orderno,username,totalprice) values(?,?,?)`;
    conn.query(sql,[orderNo,uname,totalPrice],(err,result)=>{
      if(result.affectedRows>0)
      {
        res.json({status:1013,msg:"用户订单创建成功"});
      }
      else
      {
        res.json({status:-1013,msg:"用户订单创建失败"});
      }
      conn.release();
    });
  })
});
//查询用户订单信息
app.post("/queryOrder",(req,res)=>{
  let uname=req.body.username;
  console.log(uname);
  pool.getConnection((err,conn)=>{
    if(err) throw err;
    let sql=`select orderno,totalprice from order_detail where username=? order by orderno desc`
    conn.query(sql,[uname],(err,result)=>{
      if(err) throw err;
      console.log(result);
      if(result.length>0)
      {
        res.json({status:1014,msg:result});
      }
      else
      {
        res.json({status:-1014,msg:result});
      }
      conn.release();
    });
  })
});
