title: Qiniu-image-tool-实现图片一键上传七牛云
author: 熊 超
tags:
  - upload
categories:
  - 云储存
date: 2018-07-02 14:12:00
---
<!--more-->

&ensp;&ensp;&ensp;&ensp;写博客当然少不了云储存了，那为什么推荐使用七牛云呢，当然是因为七牛云储存提供10G的免费空间,以及每月10G的流量，存放个人博客外链图片最好不过了，七牛云储存还有各种图形处理功能、缩略图、视频存放速度也给力。
&ensp;&ensp;&ensp;&ensp;qiniu-image-tool是一个提升 markdown 贴图体验的实用小工具，支持windows 及 mac。其中 qiniu-image-tool-win 为windows版本，基于AutoHotkey和qshell实现，一键上传图片或截图至七牛云，获取图片的markdown引用至剪贴板，并自动粘贴到当前编辑器。


### 用法
1. 复制本地图片、视频、js等文件至剪贴板（ctrl+c）or 使用喜欢的截图工具截图 or 直接复制网络图片.
2. 切换到编辑器，ctrl+alt+v便可以看到图片链接自动粘贴到当前编辑器的光标处（同时链接也会保存在粘贴板里）

### 预览效果图：
* 本地图片文件上传
![](http://xiongcao.github.io/images/blogs/local.gif)

* 截图上传
![](http://xiongcao.github.io/images/blogs/screenshot.gif)

* 其它文件上传
![](http://xiongcao.github.io/images/blogs/file.gif)

### 安装
首先从 github 下载release版本（有两个版本：2.0 正式版和1.0 正式版，推荐使用2.0 正式版）并解压到任意目录

目录结构应如下：
![](http://xiongcao.github.io/images/blogs/201808021402_157.png)

其中dump-clipboard-png.ps1是保存截图的powershell脚本，qiniu-image-upload.ahk 即完成文件上传的AutoHotkey脚本。

### 配置脚本

打开settings.ini文件，右键选择编辑脚本使脚本在编辑器中打开，找到下面这段代码:

![](http://xiongcao.github.io/images/blogs/201808021405_405.png)

修改这里的五个配置项的值，其中前四个配置项都与七牛账号相关：

ACCESS_KEY & SECRET_KEY
这是qshell操作个人账号的账号凭证，登陆七牛账号后在个人面板->密钥管理中查看，或者直接访问查看。

BUCKET_NAME & BUCKET_DOMAIN
在对象存储->存储空间列表中选择或新建一个存储空间即bucket，点击该bucket在右边看到一个测试域名，该域名即bucketDomain是图片上传后的访问域名。这里要特别注意域名不要少了前面的 ***http头 *** 和最后的那个 斜杠。


### 运行脚本
配置完成以后以管理员身份运行qImage.exe，这时便可以使用ctrl+alt+v尝试上传图片了。

### 调试
如果以上操作完成后没有按照预期达到图片上传的效果，感兴趣的筒子可以先自己调试找一下原因，一般报错信息会打印在cmd命令行中，但是cmd窗口一闪而过可能看不清楚，这时候将可选参数DEBUG_MODE = false 改为DEBUG_MODE = true打开调试模式，再次尝试，这时候cmd窗口不会自动关闭，便可以看到具体的报错信息从而对症下药解决问题。
