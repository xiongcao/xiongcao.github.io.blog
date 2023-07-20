title: 集合
author: 熊 超
tags:
  - 数据结构
  - 算法
categories:
  - 数据结构
date: 2019-11-11 14:45:00
---
<!-- more --> 

### 一、概念

#### 集合结构

- 集合通常是由一组无序的，不能重复的元素构成。
- 集合中的元素不允许重复。
- 特殊的数组：
  1. 元素==没有顺序，不能重复==。
  2. 没有顺序意味着==不能通过下标访问==；
  3. ES6 中的 Set结构 就是一种集合结构



### 二、属性和方法



集合的方法：

1. add()：向集合中添加一个新的元素
2. remove()：从集合中移除一个元素
3. has()：检查元素是否存在于集合中，若存在，返回true，否则返回false
4. clear()：移除集合中的所有元素
5. size()：返回集合所包含的元素的数量
6. values()：返回一个包含集合中所有值的数组
7. union()：并集
8. intersection()：交集
9. defference()：差集
10. subset()：子集， A是否是B的子集



具体实现

```js
/***************  集合结构 ***********/
function Set() {

  // 属性（不用数组，用对象的原因：数组允许元素重复）
  this.items = {};

  // 向集合中添加一个新的元素
  Set.prototype.add = function (value) {
    if (this.has(value)) {
      return false;
    }
    this.items[value] = value;
    return true;
  }

  // 从集合中移除一个元素
  Set.prototype.remove = function (value) {

    if(!this.has(value)){
      return false;
    }

    delete this.items[value];
    return true;
  }

  // 检查元素是否存在于集合中，若存在，返回true，否则返回false
  Set.prototype.has = function (value) {
    return this.items.hasOwnProperty(value);
  }

  // 移除集合中的所有元素
  Set.prototype.clear = function () {
    this.items = {};
  }

  // 返回集合所包含的元素的数量
  Set.prototype.size = function () {
    return Object.keys(this.items).length;
  }

  // 返回一个包含集合中所有值的数组
  Set.prototype.values = function () {
    return Object.keys(this.items);
  }

  // 集合间的操作

  // 并集
  Set.prototype.union = function(otherSet) {
    // this:     集合A
    // otherSet: 集合B

    // 1.创建新集合
    const unionSet = new Set();

    // 2.将A集合的成员添加到 新集合 中
    const values = this.values();
    for (let i = 0; i < values.length; i++) {
      unionSet.add(values[i]);
    }

    // 3取出B集合中的元素，添加到新集合中
    const values2 = otherSet.values();
    for (let i = 0; i < values2.length; i++) {
      unionSet.add(values2[i]);
    }

    return unionSet;
  }

  // 交集
  Set.prototype.intersection = function(otherSet) {
    // this:     集合A
    // otherSet: 集合B

    // 1.创建新集合
    const intersectionSet = new Set();

    // 2取出 同时存在于 B集合中 和 A集合 的元素，添加到 新集合中
    const values = this.values();
    for (let i = 0; i < values.length; i++) {
      const item_a = values[i]

      if (otherSet.has(item_a)) {
        intersectionSet.add(item_a);
      }
    }

    return intersectionSet;
  }

  // 差集
  Set.prototype.defference = function(otherSet) {
    // this:     集合A
    // otherSet: 集合B

    // 1.创建新集合
    const defferenceSet = new Set();

    // 2.将不存在B集合 中的元素添加到 新集合中
    const values = this.values();
    for (let i = 0; i < values.length; i++) {
      const item_a = values[i]

      if (!otherSet.has(item_a)) {
        defferenceSet.add(item_a);
      }
    }

    return defferenceSet;
  }

  // 子集， A是否是B的子集
  Set.prototype.subset = function(otherSet) {
    // this:     集合A
    // otherSet: 集合B

    // 1.创建新集合
    const subSet = new Set();

    // 2.遍历A集合中的所有元素，如果发现集合A中的元素，在集合B中不存在，则返回flase
    const values = this.values();
    for (let i = 0; i < values.length; i++) {
      const item = values[i];

      if(!otherSet.has(item)) {
        return false;
      }
    }

    return true;
  }
}
```

测试用例：

```js
const set = new Set();

set.add('aa');
set.add('bb');
set.add('cc');
set.add('dd');

set.remove('dd');

set.values(); // ["aa", "bb", "cc"]

set.has('aa'); // true
set.has('dd'); // false

set.size(); // 3 ["aa", "bb", "cc"]

const otherSet = new Set();
otherSet.add('cc');
otherSet.add('dd');

console.log('集合A：', set.values());
console.log('集合B：', otherSet.values());

const unionSet = set.union(otherSet);
console.log('并集：', unionSet.values());

const intersectionSet = set.intersection(otherSet);
console.log('交集：', intersectionSet.values());

const defferenceSet = set.defference(otherSet);
console.log('差集：', defferenceSet.values());

console.log('*************** 子集 *****************')

const setC = new Set();
setC.add('aa');
setC.add('bb');
setC.add('cc');
setC.add('dd');
console.log('集合C：', setC.values());


const subSet1 = set.subset(otherSet);
console.log('A是B的子集：', subSet1);

const subSet2 = set.subset(setC);
console.log('A是C的子集：', subSet2);
```

