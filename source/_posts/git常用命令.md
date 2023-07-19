title: git常用命令
author: 熊 超
tags:
  - git
categories:
  - 工具
date: 2018-07-08 14:12:00
---
<!--more-->
### git的工作原理图解：
+ 将指定文件添加到暂存区(stage)
![](http://xiongcao.github.io/images/blogs/201808030937_27.png)


+ 将暂存区的所有内容提交到当前分支
![](http://xiongcao.github.io/images/blogs/201808030941_860.png)



+ 分支的创建与合并
![](http://xiongcao.github.io/images/blogs/201808031105_462.png)
![](http://xiongcao.github.io/images/blogs/201808031106_416.png)


### git的使用步骤：

##### 基本使用
``` js
git add . //如果有删除的文件则：git add -A

git commit -m"first commit"

//这一步可能会进入一个奇怪的窗口，需执行 ESC :wq
git pull --rebase origin master

//如果有冲突则解决冲突，然后执行第一步，最后执行以下命令
git rebase --continue

git push origin master

//push时有可能会提示没有change-id
//复制提示中的"gitdir=$(git rev-parse --git-dir); scp -p -P 29418 
//xiongchao@192.168.1.192:hooks/commit-msg ${gitdir}/hooks/"
git commit -amend
```

##### 如果你正在完成某一个功能不能提交代码，然后又需要用到远程仓库中同事刚提交的代码，则只需要执行以下命令
``` js
git stash

git pull

git stash pop //可能有冲突，改冲突，可直接运行项目
```

#####  cherry-pick用法（A分支的内容添加到B分支,此操作是在B分支上）
``` js
git reflog

//复制要cherry-pick的commit id（有说明的那一行）
git cherry-pick commitid

git push origin master
```

### git的常用命令解释：

##### $ git status
查看工作区状态；

##### $ git add readme.txt 
将指定文件添加到暂存区(stage);反复多次使用，添加多个文件；

##### $ git add . 
将所有文件添加到Git仓库暂存区；

##### $ git commit -m "wrote a readme file" 
将暂存区的所有内容提交到当前分支；

##### $ git checkout -- readme.txt" 
把** readme.txt **文件在工作区的修改全部撤销，这里有两种情况：<br/><!--
--><font size=2>一种是**readme.txt**自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态；</font><br/><!--
--><font size=2>一种是**readme.txt**已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态。</font>
总之，就是让这个文件回到最近一次git commit或git add时的状态。

##### $ rm test.txt" 
从版本库暂存区中删除该文件；

##### $ git push origin master 
把当前分支**master**的内容推送到远程库；

##### $ git pull --rebase origin master 
拉取远程库**master**分支的内容到本地仓库；

##### $ git reset HEAD~ 
将前版本回退到上一个版本；上上一个版本就是HEAD~~，上100个版本写成HEAD~100；

##### $ git reset --hard 1094a 
将前版本回退到指定版本；

##### $ git stash 
将你当前未提交（包括暂存的和非暂存的）到本地（和服务器）的代码推入到Git的栈中，这时候你的工作区间和上一次提交的内容是完全一样的,需要说明一点，stash是本地的，不会通过git push命令上传到git server上；

##### $ git stash pop
将缓存堆栈中的第一个stash删除，并将对应修改应用到当前的工作目录下；

##### $ git stash list
查看现有stash；

##### $ git stash drop
移除stash；或者使用git stash clear命令，删除所有缓存的stash；

##### $ git branch dev
创建dev分支；

##### $ git checkout dev
切换到dev分支；

##### $ git branch
查看当前分支；

##### $ git merge dev
把dev分支的工作成果合并到master分支上；

##### $ git branch -d dev
删除dev分支；

##### $ git clone
将远程仓库克隆到本地；

##### $ git log
查看提交日志；

##### $ git reflog
记录你的每一次命令；

