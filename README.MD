### 服务器 
``` bash
$ hexo server -p 5000
```

#### 静态模式
在静态模式下，服务器只处理 public 文件夹内的文件，而不会处理文件变动，在执行时，您应该先自行执行 hexo generate，此模式通常用于生产环境（production mode）下。

``` bash
$ hexo server -s
```

### 生成器
使用 Hexo 生成静态文件快速而且简单。
``` bash
hexo generate
```

Hexo 能够监视文件变动并立即重新生成静态文件，在生成时会比对文件的 SHA1 checksum，只有变动的文件才会写入。
``` bash
$ hexo generate --watch
```
#### 完成后部署
``` bash
$ hexo generate --deploy
$ hexo deploy --generate
```

#### 简写
``` bash 
$ hexo g -d
$ hexo d -g
```

### Admin
``` bash 
$ hexo s
```
访问http://localhost:4000/admin