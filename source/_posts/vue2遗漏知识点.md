title: Vue2遗漏知识点
author: 熊 超
tags:
  - Vue
categories:
  - Vue
date: 2022-03-17 16:35:00
---
<!-- more -->


## 1.不要在选项 property 或回调上使用箭头函数

比如 `created: () => console.log(this.a)` 或 `vm.$watch('a', newValue => this.myMethod())。`

因为箭头函数并没有 `this`，`this` 会作为变量一直向上级词法作用域查找，直至找到为止。

经常导致 `Uncaught TypeError: Cannot read property of undefined` 或 `Uncaught TypeError: this.myMethod is not a function` 之类的错误。

## 2.动态参数

可以在指令参数中使用 **JavaScript** 表达式，方法是用方括号括起来：

```html
<!-- 注意，参数表达式的写法存在一些约束。-->
<a v-bind:[attributeName]="url"> ... </a>
```

这里的 `attributeName` 会被作为一个 JavaScript 表达式进行动态求值，求得的值将会作为最终的参数来使用。例如，如果你的组件实例有一个 data property `attributeName`，其值为 `"href"`，那么这个绑定将等价于 `v-bind:href`。

同样地，你可以使用动态参数为一个动态的事件名绑定处理函数：

```javascript
<a v-on:[eventName]="doSomething"> ... </a>
```

在这个示例中，当 `eventName` 的值为 `"focus"` 时，`v-on:[eventName]` 将等价于 `v-on:focus。`

### 注意事项

#### 对动态参数值约定

动态参数预期会求出一个字符串，异常情况下值为 `null`。这个特殊的 `null` 值可以被显性地用于移除绑定。任何其它非字符串类型的值都将会触发一个警告。

#### 对动态参数表达式约定

动态参数表达式有一些语法约束，因为某些字符，如空格和引号，放在 **HTML attribute** 名里是无效的。例如：

```html
<!-- 这会触发一个编译警告 -->
<a v-bind:['foo' + bar]="value"> ... </a>
```

变通的办法是使用没有空格或引号的表达式，或用[计算属性](https://vue3js.cn/docs/zh/guide/computed.html)替代这种复杂表达式。

在 **DOM** 中使用模板时 (直接在一个 HTML 文件里撰写模板)，还需要避免使用大写字符来命名键名，因为浏览器会把 **attribute** 名全部强制转为小写：

```html
<!--
  在 DOM 中使用模板时这段代码会被转换为 `v-bind:[someattr]`。
  除非在实例中有一个名为“someattr”的 property，否则代码不会工作。
-->
<a v-bind:[someAttr]="value"> ... </a>
```

## 3.修饰符【详情见第9条】

修饰符 (**modifier**) 是以半角句号`.`指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。

例如，`.prevent` 修饰符告诉 `v-on` 指令对于触发的事件调用 `event.preventDefault()：`

```html
<form v-on:submit.prevent="onSubmit">...</form>
```

## 4.计算属性缓存 vs 方法

我们可以将同一函数定义为一个方法而不是一个计算属性。两种方式的最终结果确实是完全相同的。

然而，不同的是**计算属性是基于它们的反应依赖关系缓存的**。计算属性只在相关==响应式依赖发生改变时==它们才会重新求值。

这就意味着只要相关响应式依赖还没有发生改变，多次访问计算属性会立即返回之前的计算结果，而不必再次执行函数。

这也同样意味着下面的计算属性将不再更新，因为 **Date.now ()** ==**不是响应式依赖**==：

```javascript
computed: {
  now() {
    return Date.now()
  }
}
```

相比之下，每当触发重新渲染时，调用方法将总会再次执行函数。

我们为什么需要缓存？假设我们有一个性能开销比较大的计算属性 `list`，它需要遍历一个巨大的数组并做大量的计算。然后我们可能有其他的计算属性依赖于 `list`。如果没有缓存，我们将不可避免的多次执行 `list` 的 **getter**！如果你不希望有缓存，请用 `method` 来替代。

## 5.绑定 HTML Class

### 对象语法

当有如下模板：

```html
<div
  class="static"
  :class="classObject"
></div>
```

和如下 data：

```js
// 或者
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

### 数组语法

```html
<div :class="[isActive ? activeClass : '', errorClass]"></div>

<!-- 或者 -->
<div :class="[{ active: isActive }, errorClass]"></div>
```

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger',
    isActive: true
  }
}
```

## 6.绑定 HTML Style

### 数组语法

`:style` 的数组语法可以将多个样式对象应用到同一个元素上：

```html
<div :style="[baseStyles, overridingStyles]"></div>
```

### 多重值

可以为 **style** 绑定中的 **property** 提供一个包含多个值的数组，常用于提供多个带前缀的值，例如：

```html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

## 7.条件渲染

### v-show

带有 `v-show` 的元素始终会被渲染并保留在 DOM 中。`v-show` 只是简单地切换元素的 CSS property `display。`

注意，`v-show` 不支持 `<template>` 元素，也不支持 `v-else`。

### `v-if` VS `v-show`

- `v-if` 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的**事件监听器**和**子组件**适当地被**销毁**和**重建**。
- `v-if` 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
- `v-show` 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 **CSS** 进行切换。

一般来说，`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 `v-show` 较好；如果在运行时条件很少改变，则使用 `v-if` 较好。

## 8.列表渲染

### `v-for` 与 `v-if` 一同使用

**永远不要把 `v-if` 和 `v-for` 同时用在同一个元素上。**

当它们处于同一节点，`v-if` 的优先级比 `v-for` 更高，这意味着 `v-if` 将没有权限访问 `v-for` 里的变量：

一般我们在两种常见的情况下会倾向于这样做：

- 为了过滤一个列表中的项目 (比如 `v-for="user in users" v-if="user.isActive"`)。在这种情形下，请将 `users` 替换为一个计算属性 (比如 `activeUsers`)，让其返回过滤后的列表。
- 为了避免渲染本应该被隐藏的列表 (比如 `v-for="user in users" v-if="shouldShowUsers"`)。这种情形下，请将 `v-if` 移动至容器元素上 (比如 `ul`、`ol`、`template`)。

vue2：`v-if` 的优先级比 `v-for` 更低

vue3：`v-if` 的优先级比 `v-for` 更高

## 9.事件处理

### 访问原始的 DOM 事件

有时也需要在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 `$event` 把它传入方法：

```html
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```

```js
methods: {
  warn(message, event) {
    // now we have access to the native event
    if (event) {
      event.preventDefault()
    }
  }
}
```

### 多事件处理器

事件处理程序中可以有多个方法，这些方法由逗号运算符分隔：

```html
<!-- 这两个 one() 和 two() 将执行按钮点击事件 -->
<button @click="one($event), two($event)">
  Submit
</button>
```

```js
methods: {
  one(event) {
    // first handler logic...
  },
  two(event) {
    // second handler logic...
  }
}
```

### 事件修饰符

- `.stop`：停止冒泡；
- `.prevent`：阻止事件默认行为；
- `.capture`：添加事件监听器时使用事件**捕获**模式；
- `.self`：只当事件是从侦听器绑定的**元素本身**触发时才触发回调
- `.once`：只触发一次回调；
- `.passive`

```html
<!-- 阻止单击事件继续传播 -->
<a @click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a @click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form @submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div @click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div @click.self="doThat">...</div>
```

> **TIP**
> 
> 使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 `v-on:click.prevent.self` 会阻止所有的点击，而 `v-on:click.self.prevent` 只会阻止对元素自身的点击。

## 10.Props

### 传入一个对象的所有 property

如果你想要将一个对象的所有 **property** 都作为 **prop** 传入，你可以使用不带参数的 `v-bind` (取代 `v-bind`:`prop-name`)。例如，对于一个给定的对象 `post`

```js
post: {
  id: 1,
  title: 'My Journey with Vue'
}
```

下面的模板：

```html
<blog-post v-bind="post"></blog-post>
```

等价于：

```html
<blog-post v-bind:id="post.id" v-bind:title="post.title"></blog-post>
```

### 单向数据流

所有的 **prop** 都使得其父子 **prop** 之间形成了一个**单向下行绑定**：父级 **prop** 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外变更父级组件的状态，从而导致你的应用的数据流向难以理解。

另外，每次父级组件发生变更时，子组件中所有的 **prop** 都将会刷新为最新的值。这意味着你**不**应该在一个子组件内部改变 **prop**。如果你这样做了，**Vue** 会在浏览器的控制台中发出警告。

> **提示**
> 
> 注意在 **JavaScript** 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 **prop** 来说，在子组件中改变变更这个对象或数组本身**将会**影响到父组件的状态。

### Prop 验证

```js
app.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function() {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    },
    // 具有默认值的函数
    propG: {
      type: Function,
      // 与对象或数组默认值不同，这不是一个工厂函数 —— 这是一个用作默认值的函数
      default: function() {
        return 'Default function'
      }
    }
  }
})
```

当 **prop** 验证失败的时候，(开发环境构建版本的) **Vue** 将会产生一个控制台的警告。

> **提示**
> 
> 注意那些 **prop** 会在一个组件实例创建**之前**进行验证，所以实例的 **property** (如 `data`、`computed` 等) 在 `default` 或 `validator` 函数中是不可用的。

## 11.非 Prop 的 Attribute

一个非 **prop** 的 attribute 是指传向一个组件，但是该组件并没有相应 [props](https://vue3js.cn/docs/zh/guide/component-props) 或 [emits](https://vue3js.cn/docs/zh/guide/component-custom-events.html#defining-custom-events) 定义的 **attribute**。常见的示例包括 `class`、`style` 和 `id` 属性。

### Attribute 继承

当组件返回单个根节点时，非 **prop** **attribute** 将自动添加到根节点的 **attribute** 中。

#### class

```html
<!-- 具有非prop attribute的Date-picker组件-->
<date-picker class="date-picker"></date-picker>

<!-- 渲染 date-picker 组件 -->
<div class="date-picker" >
  <input type="datetime" />
</div>
```

#### 自定义属性

```html
<!-- 具有非prop attribute的Date-picker组件-->
<date-picker data-status="activated"></date-picker>

<!-- 渲染 date-picker 组件 -->
<div data-status="activated">
  <input type="datetime" />
</div>
```

#### 事件监听器

```html
<date-picker @change="submitChange"></date-picker>
```

```js
app.component('date-picker', {
  created() {
    console.log(this.$attrs) // { onChange: () => {}  }
  }
})
```

### 禁用 Attribute 继承

如果你**不**希望组件的根元素继承 **attribute**，你可以在组件的选项中设置 `inheritAttrs: false`。例如：

禁用 **attribute** 继承的常见情况是需要将 **attribute** 应用于根节点之外的其他元素。

通过将 `inheritAttrs` 选项设置为 `false`，你可以访问组件的 `$attrs` **property**，该 **property** 包括组件 `props` 和 `emits` **property** 中未包含的所有属性 (例如，`class`、`style`、`v-on` 监听器等)。

与单个根节点组件不同，具有**多个根节点**的组件不具有自动 **attribute** 回退行为。如果未显式绑定 `$attrs`，将发出运行时警告。

```html
<custom-layout id="custom-layout" @click="changeValue"></custom-layout>
```

```js
// 这将发出警告
app.component('custom-layout', {
  template: `
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  `
})

// 没有警告，$attrs被传递到<main>元素
app.component('custom-layout', {
  template: `
    <header>...</header>
    <main v-bind="$attrs">...</main>
    <footer>...</footer>
  `
})
```

### 组件上使用`v-model`

#### `v-model` 参数

**默认情况下**，组件上的 `v-model` 使用 `modelValue` 作为 **prop** 和 `update:modelValue` 作为事件。

```html
<custom-input v-model="searchText"></custom-input>

<!-- 等价于以下代码 -->
<custom-input
  :model-value="searchText"
  @update:model-value="searchText = $event"
></custom-input>
```

```js
app.component('custom-input', {
  props: ['modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `
})
```

我们可以通过向 `v-model` **传递参数**来修改这些名称：

```html
<my-component v-model:foo="bar"></my-component>
```

子组件将需要一个 `foo` prop 并发出 `update:foo` 要同步的事件：

```js
const app = Vue.createApp({})

app.component('my-component', {
  props: {
    foo: String
  },
  template: `
    <input 
      type="text"
      :value="foo"
      @input="$emit('update:foo', $event.target.value)">
  `
})
```

#### 多个 `v-model` 绑定

通过利用以特定 **prop** 和事件为目标的能力，正如我们之前在 [`v-model` 参数](https://vue3js.cn/docs/zh/guide/component-custom-events.html#v-model-参数)中所学的那样，我们现在可以在单个组件实例上创建多个 **v-model** 绑定。

每个 **v-model** 将同步到不同的 **prop**，而不需要在组件中添加额外的选项：

```html
<user-name
  v-model:first-name="firstName"
  v-model:last-name="lastName"
></user-name>
```

```js
const app = Vue.createApp({})

app.component('user-name', {
  props: {
    firstName: String,
    lastName: String
  },
  template: `
    <input 
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)">

    <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)">
  `
})
```

## 12.插槽

### 具名插槽

有时我们需要多个插槽。例如对于一个带有如下模板的 `<base-layout>` 组件：

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

一个不带 `name` 的 `<slot>` 出口会带有隐含的名字“**default**”。

在向具名插槽提供内容的时候，我们可以在一个 `<template>` 元素上使用 `v-slot` 指令，并以 `v-slot` 的参数的形式提供其名称：

```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

渲染的 HTML 将会是：

```html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

注意，**`v-slot` 只能添加在 `<template>` 上** ([只有一种例外情况](https://vue3js.cn/docs/zh/guide/component-slots.html#独占默认插槽的缩写语法))

### 作用域插槽

有时**让插槽内容能够访问子组件中才有的数据**是很有用的。当一个组件被用来渲染一个项目数组时，这是一个常见的情况，我们希望能够自定义每个项目的渲染方式。

```js
app.component('todo-list', {
  data() {
    return {
      items: ['Feed a cat', 'Buy milk']
    }
  },
  template: `
    <ul>
      <li v-for="( item, index ) in items">
        <slot :item="item"></slot>
      </li>
    </ul>
  `
})
```

绑定在 `<slot` > 元素上的 attribute 被称为**插槽 prop**。现在在**父级作用域中**，我们可以使用带值的 `v-slot` 来定义我们提供的插槽 prop 的名字：

```html
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>
</todo-list>
```

当被提供的内容**只有默认插槽**时，组件的标签才可以被当作插槽的模板来使用

```html
<todo-list v-slot="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

注意默认插槽的缩写语法**不能**和具名插槽混用，因为它会导致作用域不明确。

只要出现多个插槽，请始终为所有的插槽使用完整的基于 `<template>` 的语法：

```html
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</todo-list>
```

### 具名插槽的缩写

跟 `v-on` 和 `v-bind` 一样，`v-slot` 也有缩写，即把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。例如 `v-slot:header` 可以被重写为 `#header`：

```html
<base-layout>
  <template #header>
    ...
  </template>

  <template #default>
    ...
  </template>

  <template #footer>
    ...
  </template>
</base-layout>
```

然而，和其它指令一样，该缩写只在其有参数的时候才可用。这意味着以下语法是无效的：

```html
<!-- This will trigger a warning -->

<todo-list #="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

如果你希望使用缩写的话，你必须始终以明确插槽名取而代之：

```html
<todo-list #default="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

## 13.提供 / 注入

通常，当我们需要将数据从父组件传递到子组件时，我们使用 [**props**](https://vue3js.cn/docs/zh/guide/component-props.html)。想象一下这样的结构：你有一些深嵌套的组件，而你只需要来自深嵌套子组件中父组件的某些内容。在这种情况下，你仍然需要将 **prop** 传递到整个组件链中，这可能会很烦人。

对于这种情况，我们可以使用 `provide` 和 `inject` 对。父组件可以作为其所有子组件的依赖项提供程序，而不管组件层次结构有多深。这个特性有两个部分：父组件有一个 `provide` 选项来提供数据，子组件有一个 `inject` 选项来开始使用这个数据。

```js
const app = Vue.createApp({})

app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide: {
    user: 'John Doe' 
  },
  template: `
    <div>
      {{ todos.length }}
    </div>
  `
})

app.component('todo-list-statistics', {
  inject: ['user'],
  created() {
    console.log(`Injected property: ${this.user}`) // > 注入 property: John Doe
  }
})
```

果我们尝试在此处提供一些组件实例 property，则这将不起作用；我们需要将 `provide` 转换为返回对象的函数

```js
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide() {
    return {
      todoLength: this.todos.length
    }
  }
})
```

### 处理响应性

在上面的例子中，如果我们更改了 `todos` 的列表，这个更改将不会反映在注入的 `todoLength` **property** 中。这是因为默认情况下，`provide/inject` 绑定*不*是被动绑定。（**vue2.x**中也不提供响应式的**property**）

在**vue3**中，我们可以通过将 `ref` property 或 `reactive` 对象传递给 `provide` 来更改此行为。在我们的例子中，如果我们想对祖先组件中的更改做出反应，我们需要为我们提供的 `todoLength` 分配一个组合式 API `computed` **property**：

```js
app.component('todo-list', {
  provide() {
    return {
      todoLength: Vue.computed(() => this.todos.length)
    }
  }
})
```

## $forceUpdate【待完成】

## 14.混入

### 基础

混入 (**mixin**) 提供了一种非常灵活的方式，来分发 **Vue** 组件中的**可复用**功能。一个混入对象可以包含**任意组件选项**。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

### 选项合并

当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。

比如，数据对象在内部会进行递归合并，并在发生冲突时以**组件数据优先**。

```js
const myMixin = {
  data() {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  data() {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created() {
    console.log(this.$data) // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})
```

**同名钩子**函数将合并为一个**数组**，因此都将被调用。另外，混入对象的钩子将在组件自身钩子**之前**调用。

值为对象的选项，例如 `methods`、`components` 和 `directives`，将被**合并**为同**一个对象**。两个对象键名冲突时，取**组件**对象的键值对。

```js
const myMixin = {
  methods: {
    foo() {
      console.log('foo')
    },
    conflicting() {
      console.log('from mixin')
    }
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  methods: {
    bar() {
      console.log('bar')
    },
    conflicting() {
      console.log('from self')
    }
  }
})
// => 1."混入对象的钩子被调用"
// => 2."组件钩子被调用"

const vm = app.mount('#mixins-basic')

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```

### 全局混入

混入也可以进行**全局注册**。使用时格外小心！一旦使用全局混入，它将影响**每一个**之后创建的组件 (例如，每个子组件)。

```js
const app = Vue.createApp({
  myOption: 'hello!'
})

// 为自定义的选项 'myOption' 注入一个处理器。
app.mixin({
  created() {
    const myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

// 将myOption也添加到子组件
app.component('test-component', {
  myOption: 'hello from component!'
})

app.mount('#mixins-global')

// => "hello!"
// => "hello from component!"
```

大多数情况下，只应当应用于自定义选项，就像上面示例一样。推荐将其作为[插件](https://vue3js.cn/docs/zh/guide/plugins.html)发布，以避免重复应用混入。

### 自定义选项合并策略

自定义选项将使用默认策略，即简单地覆盖已有值。如果想让自定义选项以自定义逻辑合并，可以向 `app.config.optionMergeStrategies` 添加一个函数

合并策略接收在**父实例**和**子实例**上定义的该选项的值，分别作为**第一个**和**第二个**参数。让我们来检查一下使用 **mixin** 时，这些参数有哪些：

```js
// 子实例
const app = Vue.createApp({
  custom: 'hello!'
})

app.config.optionMergeStrategies.custom = (toVal, fromVal) => {
  console.log(fromVal, toVal)
  // => "goodbye!", undefined
  // => "hello", "goodbye!"
  // fromVal 子实例自定义选项的值
  // toVal 父实例自定义选项的值
  return fromVal || toVal
}

// 父实例
app.mixin({
  custom: 'goodbye!',
  created() {
    console.log(this.$options.custom) // => "hello!"
  }
})
```

## 15.Teleport

Vue 鼓励我们通过将 **UI** 和相关行为封装到组件中来构建 **UI**。我们可以将它们嵌套在另一个内部，以构建一个组成应用程序 **UI** 的树。

然而，有时组件模板的一部分逻辑上属于该组件，而从技术角度来看，最好将模板的这一部分移动到 **DOM** 中 **Vue app** 之外的其他位置。

一个常见的场景是创建一个包含全屏模式的组件。在大多数情况下，你希望模态的逻辑存在于组件中，但是模态的定位就很难通过 **CSS** 来解决，或者需要更改组件组合。

例如：有一个嵌套的组件，子组件是一个**模态框组件**，模态框组件组件会用到脱离文档流的定位，一般我们需要将该组件的**DOM**元素移动到**body**元素的最后面，如果是嵌套组件的话，该**DOM**元素将被嵌套在父组件元素里。

**Teleport** 提供了一种干净的方法，允许我们控制在 **DOM** 中哪个父节点下呈现 **HTML**，而不必求助于全局状态或将其拆分为两个组件。

```html
<body>
  <div style="position: relative;">
    <h3>Tooltips with Vue 3 Teleport</h3>
    <div>
      <modal-button></modal-button>
    </div>
  </div>
</body>
```

```vue
<template>
  <button @click="modalOpen = true">
    Open full screen modal! (With teleport!)
  </button>

  <teleport to="body">
    <div v-if="modalOpen" class="modal">
      <div>
        I'm a teleported modal! 
        (My parent is "body")
        <button @click="modalOpen = false">
          Close
        </button>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'modal-button'
  data() {
    return { 
      modalOpen: false
    }
  }
}
</script>
```

因此，一旦我们单击按钮打开模式，**Vue** 将正确地将模态内容渲染为 `body` 标签的子级。

### 与 Vue components 一起使用

如果 `<teleport>` 包含 Vue 组件，则它仍将是 `<teleport>` 父组件的逻辑子组件

这也意味着来自父组件的注入按预期工作，并且子组件将嵌套在 Vue Devtools 中的父组件之下，而不是放在实际内容移动到的位置。

### 在同一目标上使用多个 teleport

一个常见的用例场景是一个可重用的 `<Modal>` 组件，它可能同时有多个实例处于活动状态。对于这种情况，多个 `<teleport>` 组件可以将其内容挂载到同一个目标元素。顺序将是一个简单的追加——稍后挂载将位于目标元素中较早的挂载之后。

```html
<teleport to="#modals">
  <div>A</div>
</teleport>
<teleport to="#modals">
  <div>B</div>
</teleport>

<!-- result-->
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## 16.钩子函数

**Vue** 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模版、挂载 **Dom** -> 渲染、更新 -> 渲染、卸载等一系列过程，我们称这是 **Vue** 的生命周期。

| **生命周期**      | **描述**                                          |
| ------------- | ----------------------------------------------- |
| beforeCreate  | 组件实例被创建之初，组件的属性生效之前                             |
| created       | 组件实例已经完全创建，属性也绑定，但真实 **dom** 还没有生成，**$el** 还不可用 |
| beforeMount   | 在挂载开始之前被调用：相关的 **render** 函数首次被调用               |
| mounted       | **el** 被新创建的 **vm.$el** 替换，并挂载到实例上去之后调用该钩子      |
| beforeUpdate  | 组件数据更新之前调用，发生在虚拟 **DOM** 打补丁之前                  |
| activited     | **keep-alive** 专属，组件被激活时调用                      |
| deactivated   | **keep-alive** 专属，组件被销毁时调用                      |
| beforeDestory | 组件销毁前调用                                         |
| destoryed     | 组件销毁后调用                                         |

**生命周期示意图**

<img src="/Users/nataukcp/Documents/前端笔记/images/vue/lifeCycle.jpeg" alt="lifeCycle" style="zoom:200%;" />

## watch异步





## 过滤器

过滤器实质不改变原始数据，只是对数据进行加工处理后，返回过滤后的数据再进行调用处理，我们也可以理解成纯函数。

```js
{{ messgae | filterA("arg1", "arg2") | filterB("arg1", "arg2") }}
```

```js
vue.filter('filterA', function(value) {
	// 返回处理后的值
})

vue.filter('filterB', function(value) {
	// 返回处理后的值
})
```

**常见场景**：==单位转换、千分符、文本格式化、时间格式化==等操作。 这个写个方法不香么?
Vue3 果断废弃了过滤器......

```vue
<p> {{format(number)}}</p>
```

```js
const format = () => {
	return parseFloat(n).toFixed(2);
}
```

