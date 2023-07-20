title: NextJs 的预渲染
author: 熊 超
tags:
  - Next.js
categories:
  - React
date: 2022-08-05 13:15:00
---
<!--more-->

### 一、预渲染的三种模式

普通的单页应用只有一个 HTML，初次请求返回的 HTML 中没有任何页面内容，需要通过网络请求 JS bundle 并渲染，整个渲染过程都在客户端完成，所以叫**客户端渲染（CSR）**

**缺点：**

1. 白屏时间过长：在 JS bundle 返回之前，页面一直是空白的。假如 bundle 体积过大或者网络条件不好的情况下，体验会更不好
2. SEO 不友好：搜索引擎访问页面时，只会看 HTML 中的内容，默认是不会执行 JS，所以抓取不到页面的具体内容



#### 1. 服务端渲染 SSR(Server Side Rendering)

在服务端直接实时同构渲染当前用户访问的页面，返回的 HTML 包含页面具体内容，提高用户的体验。

Next.js 提供 `getServerSideProps` 异步函数，以在 SSR 场景下获取额外的数据并返回给组件进行渲染。`getServerSideProps` 可以拿到每次请求的上下文（`Context`)，举个例子：

```js
export default function FirstPost(props) {
  // 在 props 中拿到数据
  const { title } = props;
  return (
    <Layout>
      <h1>{title}</h1>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  console.log('context', context.req);
  // 模拟获取数据
  const title = await getTitle(context.req);
  // 把数据放在 props 对象中返回出去
  return {
    props: {
      title
    }
  }
}
```

SSR 方案虽然解决了 CSR 带来的两个问题，但是同时又引入另一个问题：需要一个服务器承载页面的实时请求、渲染和响应，这无疑会**增大服务端开发和运维的成本**。

另外对于一些较为静态场景，比如博客、官网等，它们的内容相对来说比较确定，变化不频繁，每次通过服务端**渲染出来的内容都是一样的**，无疑浪费了很多没必要的服务器资源。这时，有没有一种方案可以让这些页面变得静态呢？这时，静态站点生成（SSG，也叫构建时预渲染）诞生了。



#### 2. 静态生成 SSG(Static Site Generation)

是指在应用编译**构建时预先渲染页面，并生成静态的 HTML**。把生成的 HTML 静态资源部署到服务器后，浏览器不仅首次能请求到带页面内容的 HTML ，而且不需要服务器实时渲染和响应，大大节约了服务器运维成本和资源。

Next.js 默认为每个页面开启 SSG。对于页面内容需要依赖静态数据的场景，允许在每个页面中 `export` 一个 `getStaticProps` 异步函数，在这个函数中可以把该页面组件所需要的数据收集并返回。当 `getStaticProps` 函数执行完成后，页面组件就能在 `props` 中拿到这些数据并执行静态渲染。



举个在[静态路由](https://link.juejin.cn/?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Frouting%2Fintroduction)中使用 SSG 的例子：

```js
// pages/posts/first-post.js
function Post(props) {
	const { postData } = props;
  
  return <div>{postData.title}</div>
}

export async function getStaticProps() {
  // 模拟获取静态数据
	const postData = await getPostData();
  return {
  	props: { postData }
  }
}
```



[动态路由](https://link.juejin.cn/?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Frouting%2Fdynamic-routes)的场景:

```js
// pages/posts/[id].js
function Post(props) {
	const { postData } = props;
  return <div>{postData.title}</div>
}

export async function getStaticPaths() {
  // 返回该动态路由可能会渲染的页面数据，比如 params.id
  const paths = [
    { params: { id: 'ssg-ssr' }},
    { params: { id: 'pre-rendering' }}
  ]
  return {
    paths,
    // 命中尚未生成静态页面的路由直接返回 404 页面
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  // 使用 params.id 获取对应的静态数据
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}
```

当我们执行 `nextjs build` 后，可以看到打包结果包含 `pre-rendering.html` 和 `ssg-ssr.html` 两个 HTML 页面，也就是说在执行 SSG 时，会对 `getStaticPaths` 函数返回的 `paths` 数组进行循环，逐一预渲染页面组件并生成 HTML。

```markdown
├── server
|  ├── chunks
|  ├── pages
|  |  ├── api
|  |  ├── index.html
|  |  ├── index.js
|  |  ├── index.json
|  |  └── posts
|  |     ├── [id].js
|  |     ├── first-post.html
|  |     ├── first-post.js
|  |     ├── pre-rendering.html       # 预渲染生成 pre-rendering 页面
|  |     ├── pre-rendering.json
|  |     ├── ssg-ssr.html             # 预渲染生成 ssg-ssr 页面
|  |     └── ssg-ssr.json
```

SSG 虽然很好解决了白屏时间过长和 SEO 不友好的问题，但是它仅仅适合于页面内容较为静态的场景，比如**官网、博客**等。

面对**页面数据更新频繁**或**页面数量很多**的情况，它似乎显得有点束手无策，毕竟在静态构建时不能拿到最新的数据和无法枚举海量页面。这时，就需要增量静态再生成(Incremental Static Regeneration)方案了。



#### 3. 增量静态再生 ISR(Incremental Static Regeneration)

允许**在应用运行时再重新生成每个页面 HTML，而不需要重新构建整个应用**。

。这样即使有海量页面，也能使用上 SSG 的特性。一般来说，使用 ISR 需要 `getStaticPaths` 和 `getStaticProps` 同时配合使用。举个例子：

```js
// pages/posts/[id].js
function Post(props) {
	const { postData } = props;
  return <div>{postData.title}</div>
}

export async function getStaticPaths() {
  const paths = await fetch('https://.../posts');
  return {
    paths,
    // 页面请求的降级策略，这里是指不降级，等待页面生成后再返回，类似于 SSR
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  // 使用 params.id 获取对应的静态数据
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    },
    // 开启 ISR，最多每10s重新生成一次页面
    revalidate: 10,
  }
}
```

在应用编译构建阶段，会生成已经确定的静态页面，和上面 SSG 执行流程一致。

在 `getStaticProps` 函数返回的对象中增加 `revalidate` 属性，表示开启 ISR。

在上面的例子中，指定 `revalidate = 10`，表示最多10秒内重新生成一次静态 HTML。当浏览器请求已在构建时渲染生成的页面时，首先返回的是缓存的 HTML，10s 后页面开始重新渲染，页面成功生成后，更新缓存，浏览器再次请求页面时就能拿到最新渲染的页面内容了。



对于浏览器请求构建时未生成的页面时，会马上生成静态 HTML。在这个过程中，`getStaticPaths` 返回的 `fallback` 字段有以下的选项：

- `fallback: 'blocking'`：不降级，并且要求用户请求一直等到新页面静态生成结束，静态页面生成结束后会缓存
- `fallback: true`：降级，先返回降级页面，当静态页面生成结束后，会返回一个 JSON 供降级页面 CSR 使用，经过二次渲染后，完整页面出来了

在上面的例子中，使用的是不降级方案(`fallback: 'blocking'`)，实际上和 SSR 方案有相似之处，都是阻塞渲染，只不过多了缓存而已。

也不是所有场景都适合使用 ISR。对于实时性要求较高的场景，比如新闻资讯类的网站，可能 SSR 才是最好的选择。



#### 总结

- [**静态生成**](https://www.nextjs.cn/docs/basic-features/pages#static-generation-recommended)**是在构建时**生成 HTML 的预呈现方法。*然后在每个请求上重新*使用预呈现的 HTML。
- [**服务器端呈现**](https://www.nextjs.cn/docs/basic-features/pages#server-side-rendering)**是在每个请求**上生成 HTML 的预呈现方法。

