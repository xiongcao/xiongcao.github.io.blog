title: Jest 单元测试-基础
author: 熊 超
tags:
  - Jest
categories:
  - 测试
date: 2022-08-19 13:15:00
---
<!--more-->

### 1、一个简单的测试例子

创建项目：

```bash
yarn init -y
```

安装jest库：

```bash
yarn add jest -D
```

jest不支持`es-module`，可添加如下包：

```bash
yarn add --dev babel-jest @babel/core @babel/preset-env
```

添加`.babelrc`

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ]
}
```

`package.json`添加命令：

```json
"scripts": {
  "test": "jest"
},
```

新建一个math.js

```js
const sum = (a, b) => a + b;
// module.exports = { sum }
export { sum }
```

新建一个`math.test.js`

```js
// const { sum } = require('./math.js');
import { sum } from './math.js';

describe('Math module', () => {

  test('should return sum result when two number plus', () => {
    const a = 1;
    const b = 2;
    const result = sum(a, b);

    expect(result).toBe(3);
  })
})
```

执行 `yarn test`，测试通过。



#### 常用方法：

- **.toBe(value)**	严格相等
- **.toEqual(vlaue)**	对象之间的值是否相等，而不是引用相等
- **.toBeFalsy()**	判断boolean值
- **.toHaveLength(number)**	数组长度
- **.toHaveBeenCalled()**	当前方法是否被调换用
- **.toHaveBeenCalledTimes(number)**	当前方法被调换用的次数
- **.toThrow(error?)**	是否有没有异常
- **.toMatchSnapshot(propertyMatchchers?, hint?)**	与上一次快照结果是否相等
- **.toMatchInlineSnapshot(propertyMatchers?, inlineSnapshot)**
- **expect.extend(matchers)**	扩展断言器



### 2、jest.mock

作用：
1.可以mock掉 某个依赖文件中的方法

2.

新建两个文件

`service.js`：

```js
export const getNames = () => []
```

`searchName.js`：

```js
// 表示接口数据，这里的为空数组 []
import { getNames } from "./service" /

// 根据关键字搜索name，结果最多显示3个
export const searchNames = (term) => {
  const matches = getNames().filter(names => names.includes(term));

  return matches.length > 3 ? matches.slice(0, 3) : matches;
}

export const functionNotTested = (term) => {
  return `Hello ${term}`
}
```



编写测试用例 `searchName.test.js`：

用例一：

```js
import { searchNames } from "./searchName";

test("should return search results", () => {
  const keyword = 'Frank';
  const result = searchNames(keyword);
  expect(result).toEqual([]);
})
```

用例二：**jest.mock**。只想测试`searchNames`的功能，并不想知道它所依赖的`service.js`里面的`getNames`是怎么实现的，这时候可以用的`jest.mock`来`mock`掉`service.js`里面的`getNames`

```js
jest.mock('./service.js', () => ({
  getNames: jest.fn(() => ['John', 'Paul', 'George', 'Ringo'])
}))

test("should return target result when found search'", () => {
  const keyword = 'John';
  const result = searchNames(keyword);
  expect(result).toEqual(['John']);
})
```



### 3、fn.mockImplementation

使用**fn.mockImplementation**通过实现的方式给方法初始值。

重写以上代码：

```js
import { searchNames } from "./searchName";
import { getNames } from "./service";


jest.mock('./service.js', () => ({
  getNames: jest.fn()
}))

test("should return search result", () => {
  const keyword = 'Frank';
  getNames.mockImplementation(() => []);
  const result = searchNames(keyword);
  expect(result).toEqual([]);
})


test("should return target result when found search", () => {
  const keyword = 'John';
  getNames.mockImplementation(() => ['John', 'Paul', 'George', 'Ringo']);
  const result = searchNames(keyword);
  expect(result).toEqual(['John']);
})
```



剩下几种情况的测试用例：

```js
test("should not return more than 3 matches", () => {
  const keyword = 'John';
  getNames.mockImplementation(() => [
    'John',
    'John Wick 1',
    'John Wick 2',
    'John Wick 3',
    'Paul',
    'George',
    'Ringo'
  ])
  const result = searchNames(keyword);
  expect(result).toHaveLength(3);
})

test('should handle null or undefined as input', () => {
  getNames.mockImplementation(() => []);
  expect(searchNames(undefined)).toEqual([])
  expect(searchNames(null)).toEqual([])
})

test('should return serach result is case sensitive', () => {
  getNames.mockImplementation(() => ['John', 'Paul', 'George', 'Ringo']);
  expect(searchNames('john')).toEqual([])
})

test('should return serach result is case sensitive', () => {
  expect(functionNotTested('John')).toEqual('Hello John');
})
```



### 4、toMatchInlineSnapshot()

toMatchSnapshot：生成测试快照文件；

toMatchInlineSnapshot：避免生成比较大的测试文件

使用toMatchInlineSnapshot快照测试，将预期值直接填入

```js
test('should say hi when search', () => {
  const result = functionNotTested('John');
  expect(result).toMatchInlineSnapshot();
})
```

运行 `yarn test` 之后就，会得到一下代码:

```js
test('should say hi when search', () => {
  const result = functionNotTested('John');
	expect(result).toMatchInlineSnapshot(`"Hello John"`);
}
```



### 5、介绍一个新命令，可以查看测试覆盖率：

```bash
yarn test --coverage
```

同时，会在项目目录下生成一个`coverage`文件夹，可以打开`lcov-report/index.html`查看测试覆盖率




使用**testing-library**做UI测试


查询组件渲染元素的方法：

| type       | No Match | 1 Match | 1+Match | Await? |
| ---------- | -------- | ------- | ------- | ------ |
| getBy      | throw    | return  | throw   | No     |
| findBy     | throw    | return  | throw   | Yes    |
| queryBy    | null     | return  | throw   | No     |
| getAllBy   | throw    | array   | array   | No     |
| findAllBy  | throw    | array   | array   | Yes    |
| queryAllBy | []       | array   | array   | No     |



```js
userEvent.click();
userEvent.dbClick();
userEvent.type();
userEvent.keyboard();
userEvent.upload();
userEvent.clear();
userEvent.selectOptions();
userEvent.deSelectOptions();
userEvent.tab();
userEvent.hover();
userEvent.unhover();
userEvent.paste();

```







