title: 理解 Git 工作流
author: 熊 超
tags:
  - Git
categories:
  - Git
date: 2022-09-22 13:15:00
---
<!--more-->


## Git 的工作区域和流程

![image-20230502160822523](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230502160822523.png)

**Workspace**：工作区，就是平时进行开发改动的地方，是当前看到最新的内容，在开发的过程也就是对工作区的操作

**Index**：暂存区，当执行 `git add` 的命令后，工作区的文件就会被移入暂存区，暂存区标记了当前工作区中那些内容是被 Git 管理的，当完成某个需求或者功能后需要提交代码，第一步就是通过 `git add` 先提交到暂存区。

**Repository**：本地仓库，位于自己的电脑上，通过 `git commit` 提交暂存区的内容，会进入本地仓库。

**Remote**：远程仓库，用来托管代码的服务器，远程仓库的内容能够被分布在多个地点的处于协作关系的本地仓库修改，本地仓库修改完代码后通过 `git push` 命令同步代码到远程仓库。



## Git 基本操作

### `git add`

添加文件到暂存区

```bash
# 添加某个文件到暂存区，后面可以跟多个文件，以空格区分
git add xxx
# 添加当前更改的所有文件到暂存区。
git add .
```

### `git commit`

```bash
# 提交暂存的更改，会新开编辑器进行编辑
git commit 
# 提交暂存的更改，并记录下备注
git commit -m "you message"
# 等同于 git add . && git commit -m
git commit -am
# 对最近一次的提交的信息进行修改,此操作会修改commit的hash值
git commit --amend
```

### `git pull`

```bash
# 从远程仓库拉取代码并合并到本地，可简写为 git pull 等同于 git fetch && git merge 
git pull <远程主机名> <远程分支名>:<本地分支名>
# 使用rebase的模式进行合并
git pull --rebase <远程主机名> <远程分支名>:<本地分支名>
```

### `git fetch`

与 `git pull` 不同的是 `git fetch` 操作仅仅==只会拉取远程的更改，不会自动进行 merge 操作==。对你当前的代码没有影响

```bash
# 获取远程仓库特定分支的更新
git fetch <远程主机名> <分支名>
# 获取远程仓库所有分支的更新
git fetch --all
```

### `git branch`

```bash
# 新建本地分支，但不切换
git branch <branch-name> 
# 查看本地分支
git branch
# 查看远程分支
git branch -r
# 查看本地和远程分支
git branch -a
# 删除本地分支
git branch -D <branch-nane>
# 重新命名分支
git branch -m <old-branch-name> <new-branch-name>
```





## 工作中使用 Git 解决问题的场景

### `git rebase` 让你的提交记录更加清晰可读

#### `git rebase` 的使用

`rebase` 翻译为变基，他的作用和 `merge` 很相似，==用于把一个分支的修改合并到当前分支上==。

如下图所示，下图介绍了经过 `rebase` 后提交历史的变化情况。

![image-20230502161455774](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230502161455774.png)

1. 假设我们现在有2条分支，一个为 master，一个为 feature/1，他们都基于初始的一个提交 add readme 进行检出分支；
2. 之后，master 分支增加了 3.js 和 4.js 的文件，分别进行了2次提交；
3. feature/1 也增加了 1.js 和 2.js 的文件，分别对应以下2条提交记录。

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230502161712954.png" alt="image-20230502161712954" style="zoom:50%;" align="left"/>

大部分情况下，`rebase` 的过程中会产生冲突的，此时，就需要手动解决冲突，然后使用依次 `git add ` 、`git rebase --continue ` 的方式来处理冲突，完成 `rebase` 的过程，如果不想要某次 `rebase` 的结果，那么需要使用 `git rebase --skip ` 来跳过这次 rebase 操作。



#### `git merge` 和 `git rebase` 的区别

不同于 `git rebase` 的是，==`git merge` 会产生一条额外的合并记录==，类似 `Merge branch 'xxx' into 'xxx'` 的一条提交信息。

![image-20230502162315413](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230502162315413.png)

另外，在解决冲突的时候，==用 `merge` 只需要解决一次冲突即可==，简单粗暴，而==用 `rebase` 的时候 ，需要依次解决每次的冲突==，才可以提·交。

### 总结：

- 
- git merge 会让2个分支的提交按照提交时间进行排序，并且会把最新的2个commit合并成一个commit。最后的分支树呈现==非线性==的结构
- git reabse 将dev的当前提交复制到master的最新提交之后，会形成一个==线性的分支树==

```bash
git merge --squash  #在merge分支的时候把分支上的所有commit合并为一个commit后,再merge到目标分支。
```



### 使用 `git cherry-pick` 获取指定的 commit

`git cherry-pick` 可以理解为”挑拣”提交，和 merge 合并一个分支的所有提交不同的是，它会获取某一个分支的单笔提交，并作为一个新的提交引入到你当前分支上。

当我们需要在本地合入其他分支的提交时，如果我们不想对整个分支进行合并，而是只想将某一次提交合入到本地当前分支上，那么就要使用 `git cherry-pick` 了。





### 使用 git revert 回滚某次的提交

想象这么一个场景，你的项目最近有2个版本要上线，这两个版本还伴随着之前遗留的 bug 的修复，一开始的时候，你将 bug 修复在了第一个版本的 release 分支上，突然在发版前一天，测试那边反馈，需要把第一个版本修复 bug 的内容改在第二个版本上，这个时候，第一个版本的集成分支的提交应该包括了第一个版本的功能内容，遗留 bug 修复的提交和其他同事提交的内容，想要通过 reset 的方式粗暴摘除之前的关于 bug 修复的 commit 肯定是不行的，同时，这种做法比较危险，此时，我们既不想破坏之前的提交记录，又想撤回我们遗留 bug 的 commit 记录应该怎么做呢？git revert 就派上了用场。

> `git revert` 撤销某次操作，此操作不会修改原本的提交记录，而是会新增一条提交记录来抵消某次操作。

语法： 

```bash
git revert <commit-id>  		#针对普通 commit
git revert <commit-id> -m  	#针对 merge 的 commit
```

![image-20230502163330171](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230502163330171.png)

```bash
git revert 1121932
```

![image-20230502163352737](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230502163352737.png)

会新建一条 commit 信息，来撤回之前的修改。



#### `git revert` VS `git reset`

回滚我们的提交有二种方式，一种是上文提到的`git revert`命令外，还可以使用 `git reset` 命令，那么它们两者有什么区别呢？

- `git revert` 会新建一条 commit 信息，来撤回之前的修改。
- `git reset` 会直接将提交记录退回到指定的 commit 上。

==对于个人的 feature 分支而言，可以使用 `git reset` 来回退历史记录==，之后使用 `git push --force` 进行推送到远程，但是如果是在多人==协作的集成分支上，不推荐直接使用 `git reset` 命令，而是使用更加安全的 `git revert` 命令进行撤回提交==。这样，提交的历史记录不会被抹去，可以安全的进行撤回。



### 使用 git stash 来暂存文件

会有这么一个场景，现在你正在用你的 feature 分支上开发新功能。这时，生产环境上出现了一个 bug 需要紧急修复，但是你这部分代码还没开发完，不想提交，怎么办？这个时候可以用 `git stash` 命令先把工作区已经修改的文件暂存起来，然后切换到 hotfix 分支上进行 bug 的修复，修复完成后，切换回 feature 分支，从堆栈中恢复刚刚保存的内容。

基本命令如下：

```bash
git stash # 把本地的改动暂存起来
git stash save "message" # 执行存储时，添加备注，方便查找。
git stash pop # 应用最近一次暂存的修改，并删除暂存的记录
git stash apply  # 应用某个存储,但不会把存储从存储列表中删除，默认使用第一个存储,即 stash@{0}，如果要使用其他个，git stash apply stash@{$num} 。
git stash list # 查看 stash 有哪些存储
git stash clear # 删除所有缓存的 stash
```





## 对GitFlow的理解?

GitFlow重点解决的是由于源代码在开发过程中的各种冲突导致开发活动混乱的问题。重点是对各个分支的理解。

- `master`：主分支。
- `develop`：主开发分支，平行于`master`分支。
- `feature`：功能分支，必须从`develop`分支建立，开发完成后合并到`develop`分支。
- `release`：发布分支，发布的时候用，一般测试时候发现的 bug 在该分支进行修复。从`develop`分支建立，完成后合并回`develop`与`master`分支。
- `hotfix`：紧急修复线上bug使用，必须从`master`分支建立，完成后合并回`develop`与`master`分支。



[阅读原文](https://juejin.cn/post/7196630860811075642)

