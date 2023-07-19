title: JavaScript封装XMLHttpRequest请求
author: 熊 超
tags:
  - ajax
categories:
  - Ajax
date: 2018-08-16 13:48:00
---
<!-- more -->

### 什么是 XMLHttpRequest 对象
XMLHttpRequest 对象用于在后台与服务器交换数据。
XMLHttpRequest 对象是开发者的梦想，因为您能够：
* 在不重新加载页面的情况下更新网页
* 在页面已加载后从服务器请求数据
* 在页面已加载后从服务器接收数据
* 在后台向服务器发送数据

所有现代的浏览器都支持 XMLHttpRequest 对象，XMLHttpRequest在 Ajax 编程中被大量使用。

### 原生javascript（ES5）封装XMLHttpRequest对象


1.创建ajax.js

``` js
function Ajax(){}

Ajax.prototype.ajax = function(obj){
    //创建xmlhttprequest对象
    var xhr;
    try{
        xhr = new XMLHttpRequest();
    }catch(e){
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.timeout = 5000;
    xhr.ontimeout = function (event) {
        console.log("请求超时");
    }

    xhr.responseType = obj.dataType;

    xhr.open(obj.type,obj.url,obj.async||true);
    
    if(obj.headers&&obj.headers["Content-Type"]){
        xhr.setRequestHeader("Content-Type",obj.headers["Content-Type"]);
    }else{
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    }

    xhr.onreadystatechange = function() {
        //xhr.readyState 4:完成，XMLHttpRequest对象读取服务器响应结束
        if(xhr.readyState == 4){ 
            //xhr.status HTTP状态码 2XX表示有效响应 304意味着是从缓存读取
            if(xhr.status >= 200 && (xhr.status < 300 || xhr.status == 304)){  
                obj.success(xhr.response)
            }else{
                obj.error(xhr.status)
            }
        }
    }
    if(obj.data){
        var params = [];
        for (const key in obj.data) {
            if (obj.data.hasOwnProperty(key)) {
                params.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj.data[key]))            
            }
        }
        var postData = params.join('&');
        xhr.send(postData);
    }else{
        xhr.send();
    }
}
```

2.引用ajax.js

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./ajax.js"></script>
</head>
<body>
</body>
</html>
<script>
  var $$ = new Ajax();
  var requestApi = "http://localhost:8080/springmvc_hibernate_maven/";
  window.onload = function(){
    $$.ajax({
        type:'get',
        url:requestApi + "test/userInfo",
        dataType:'json',
        success:function(data){
            console.log(data,"get");
        },
        error:function(err){
            console.log(err);
        }
    })

    $$.ajax({
        type:'post',
        url:requestApi + "test/userInfo",
        data:{
            name:"xiongchao",
            password:'xiongchao',
            status:1
        },
        dataType:'json',
        success:function(data){
            console.log(data,"post");
        },
        error:function(err){
            console.log(err);
        }
    })

    $$.ajax({
        type:'put',
        url:requestApi + "test/userInfo/4/1",
        dataType:'json',
        success:function(data){
            console.log(data,'put');
        },
        error:function(err){
            console.log(err);
        }
    })

    $$.ajax({
        type:'delete',
        url:requestApi + "test/userInfo/4",
        dataType:'json',
        success:function(data){
            console.log(data,'delete');
        },
        error:function(err){
            console.log(err);
        }
    })
}

</script>
```

3.顺带看下后端写法（哈哈,虽然不需要前端开发人员操心）
![](http://xiongcao.github.io/images/blogs/201808161403_227.png)

4.最后看下四种请求的结果 
![](http://xiongcao.github.io/images/blogs/201808161408_351.png)

### ES6 封装XMLHttpRequest对象

同样ajax.js 文件
``` js
const ajax = function(obj){
  return new Promise((resolve,reject)=>{
      //创建xmlhttprequest对象
      var xhr;
      try{
          xhr = new XMLHttpRequest();
      }catch(e){
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }

      xhr.timeout = 5000;
      xhr.ontimeout = function (event) {
          console.log("请求超时");
      }

      xhr.responseType = obj.dataType;

      xhr.open(obj.type,obj.url,obj.async||true);
      
      if(obj.headers&&obj.headers["Content-Type"]){
          xhr.setRequestHeader("Content-Type",obj.headers["Content-Type"]);
      }else{
          xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
      }

      xhr.onreadystatechange = function() {
          //xhr.readyState 4:完成，XMLHttpRequest对象读取服务器响应结束
          if(xhr.readyState == 4){ 
              //xhr.status HTTP状态码 2XX表示有效响应 304意味着是从缓存读取
              if(xhr.status >= 200 && (xhr.status < 300 || xhr.status == 304)){  
                  resolve(xhr.response);
              }else{
                  reject(xhr.response);
              }
          }
      }
      if(obj.data){
          var params = [];
          for (const key in obj.data) {
              if (obj.data.hasOwnProperty(key)) {
                  params.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj.data[key]))            
              }
          }
          var postData = params.join('&');
          xhr.send(postData);
      }else{
          xhr.send();
      }
  })
}
export default ajax;
```

引用ajax.js
``` js
<script type="module">
  import ajax from './ajax.js'
  var requestApi = "http://localhost:8080/springmvc_hibernate_maven/";
  window.onload = function(){
      ajax({
          type:'get',
          url:requestApi + "test/userInfo",
          dataType:'json'
      }).then((data)=>{
          console.log(data,"get");
      }).catch((err)=>{
          console.log(err);
      })

      ajax({
          type:'post',
          data:{
              name:"xiongchao",
              password:'xiongchao',
              status:1
          },
          url:requestApi + "test/userInfo",
          dataType:'json'
      }).then((data)=>{
          console.log(data,"post");
      }).catch((err)=>{
          console.log(err);
      })

      ajax({
          type:'put',
          url:requestApi + "test/userInfo/4/1",
          dataType:'json'
      }).then((data)=>{
          console.log(data,"put");
      }).catch((err)=>{
          console.log(err);
      })

      ajax({
          type:'delete',
          url:requestApi + "test/userInfo/4",
          dataType:'json'
      }).then((data)=>{
          console.log(data,"delete");
      }).catch((err)=>{
          console.log(err);
      })
  }
</script>
```
