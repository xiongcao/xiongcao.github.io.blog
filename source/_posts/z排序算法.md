title: 排序算法 
author: 熊 超
tags:
  - 算法
categories:
  - 数据结构
date: 2020-04-01 14:45:00
---
<!-- more --> 

### 排序算法

排序算法有很多：冒泡排序/选择排序/插入排序/归并排序/计数排序( counting sort)/基数排序(radix sort)/希尔排序/堆排序/桶排序；

- 简单排序：冒泡排序 - 选择排序 - 插入排序；
- 高级排序：希尔排序 - 快速排序 - 归并排序 - 堆排序。
- 非比较排序：计数排序 - 基数排序 - 桶排序；



### 一、冒泡排序

![bubblesort.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0250d86fac644ea82f323a990e1aed5~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)



从序列的一端开始往另一端冒泡，依次==比较相邻==的两个数的大小

- 如果 左边的数大，则两数交换位置；
- 向右移动一个位置 比较下面两个数；
- 当走到 最右端时，最大的数 一定被放在了最右边；
- 按照这个思路，从最左端重新开始，这次走到倒数第二个位置的数；
- 即可依次类推，就可以将数据排序完成。



```js
Array.prototype.swap = function (m, n) {
  let temp = this[m];
  this[m] = this[n];
  this[n] = temp;
}

function bubbleSort(array) {
  const len = array.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        array.swap(j, j + 1);
      }
    }
  }
}
```



代码解析:

- 获取数组的长度；
- 外层循环应该让j依次减少，因此我们这里使用了反向的遍历；
- 内层循环我们使用i < j。因为上面的j在不断减小，这样就可以控制内层循环的次数；
- 比较两个数据项的大小，如果前面的大，那么就进行交换；



比较次数：

- 假如一共有7个数字；
- 第一次循环6次比较，第二次5次比较，第三次4次比较…到最后一趟进行了1次比较；
- 对于7个数据项比较次数：6+5+4+3+2+1；
- 对于N个数据项：(N-1)+(N-2)+(N-3)+…+1 = N*(N-1)/2。



冒泡排序的O表示法：

- N*(N-1)/2 = N²/2 - N/2，根据规则2，只保留最高阶项变成N²/2；
- N²/2，根据规则3，去除最高项的常量，变成N²；
- 因此冒泡排序的比较次数的大O表示法为==O(N²)==；



冒泡排序交换次数：

- 真实的次数: N*(N-1)/4；【两次比较，需要一次交换】
- 冒泡排序的交换次数是多少呢?
- 如果有两次比较才需要交换一次(不可能每次比较都交换一次)，那么交换次数为 N²/4
- 由于常量不算在大O表示法中，因此，我们可以认为交换次数的大O表示也是==O(N²)==



### 二、选择排序

![selectionsort.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a287f44039844f694bbf67069ee3d66~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)



思路：

- 1.取第一个数，和其他数依次比较，获得最小的数，将最小的数与第一个数交换位置，

  这样第一个数就是最小的数；

- 2.依次取2、3、4...个数，重复第一步；



```js
function selectionSort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[minIndex] > array[j]) {
        minIndex = j;
      }
    }
    array.swap(minIndex, i);
  }
}
```

代码解析：

- 1.取一个临时变量min，表示最小值的索引；
- 2.取第一个数，去和其他数比较，当arr[min] > arr[other]时，min = other;
- 3.一轮比较下来之后，min就是最小值的索引，然后与第一个数 交换位置，这样第一个数就是最小的数；
- 4.取第二个数，循环以上操作，得到剩余元素中最小的值，与第二个数交换位置；
- 5.重复以上步骤，即可排序；



比较次数：

- 假如一共有7个数字；
- 第一次循环6次比较，第二次5次比较，第三次4次比较…到最后一趟进行了1次比较；
- 对于7个数据项比较次数：6+5+4+3+2+1；
- 对于N个数据项：(N-1)+(N-2)+(N-3)+…+1 = N*(N-1)/2。



选择排序的O表示法：

- 与冒泡排序一样，O(N²)；



选择排序交换次数：

- 每次比较最多（也可能不交换）只需要交换一次，一共需要 N-1 次;
- 用大O表示法，就是O(N);
- 所以选择排序通常认为在执行==效率上是 高于 冒泡排序==的。





### 三、插入排序

![insertionsort.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfa7615ee39246ea9dc9c9be37aa2b7c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)



插入排序：

- 插入排序是==简单排序中效率最好==的一种
- 插入排序也是学习其他==高级排序的基础==，比如希尔排序/快速排序，所以也非常重要.



局部有序：

- 插入排序思想的核心是局部有序。什么是局部有序呢？
- 比如在一个队列中的人，我们选择其中一个作为标记的队员；
- 这个 被标记的队员左边 的所有队员已经是局部有序的；
- 这意味着，有一部分人是按顺序排列好的，有一部分还没有顺序。



思路：

- 从第一个元素开始，该元素可以认为已经被排序；
- 取出下一个元素，在已经排序的元素序列中从后向前扫描；
- 如果该元素(已排序)大于新元素，将该元素移到下一位置；
- 重复上一个步骤，直到找到已排序的元素小于或者等于新元素的位置；
- 将新元素插入到该位置后，重复上面的步骤。



```js
function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let j = i;
    let current = array[i];
    while (current < array[j - 1] && j > 0) {
      array[j] = array[j - 1]
      j--;
    }
    array[j] = current;
  }
}
```



比较次数：

- 第一次，最多需要比较一次，第二次最多需要2次，以此类推，最后一次是 N-1 次；
- 因此插入排序的最多比较次数是：1+2+3+...+N-1 = N*(N-1)/2;
- 然而毎趟发现插入点之前，平均只有全体数据项的一半需要进行比较我们可以除以2得到N*(N-1)/4.
- 所以相对于选择排序，其比较次数是少了一半的。



插入排序的复制次数：

- 第一趟时，需要的最多复制次数是1，第二趟最多次数是2，依次类推，最后一趟是N-1次；
- 因此复制次数最多是1+2+3+…+N-1=N*N-1)/2；
- 平均次数N*(N-1)/4。



对于基本有序的情况:

- 对于已经有序或基本有序的数据来说，插入排序要好很多；
- 当数据有序的时候 while循环的条件总是为假，所以它变成了外层循环中的个简单语句，执行N-1次；
- 在这种情况下，算法运行至需要O(N)的时间，效率相对来说会更高；
- 另外别忘了，我们的比较次数是选择排序的一半，所以这个算法的 效率 是 高于 选择排序 的。



### 四、希尔排序

希尔排序：

- 希尔排序是插入排序的一种高效的改进版,并且效率比插入排序要更快.
- 插入排序也是学习其他高级排序的基础，比如希尔排序/快速排序，所以也非常重要.



思路：

比如下面的数字，81,94,11,96,12,35,17,95,28,58,41,75,15：

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230406140724784.png" alt="image-20230406140724784" style="zoom:50%;" />

- 我们先让间隔为5，进行排序：

  - (35,81)，(94,17)，(11,95)，(96,28)，(12,58)，(35,41)，(17,75)，(95,15)

  - 排序后的新序列一定可以让数字离自己的正确位置更近一步。

- 我们再让间隔位3，进行排序：

  - (35,28,75,58,95)，(17,12,15,81)，(11,41,96,94)

  - 排序后的新序列，一定可以让数字离自己的正确位置又近了一步最后。

- 我们让间隔为1，也就是正确的插入排序。
  - 这个时候数字都离自己的位置更近，那么需要复制的次数一定会减少很多。



```js
function shellSort(array) {
   // 1.获取数组长度
  const len = array.length;

  // 2.初始化增量
  let gap = Math.floor(len / 2);

  // 3.while循环，gap不断减小至1
  while (gap >= 1) {

    // 4.以gap作为间隙，进行分组，对分组进行插入排序
    for (let i = gap; i < len; i++) {

      let j = i;
      let current = array[i];

      while (current < array[j - gap] && j - gap > -1) {
        array[j] = array[j - gap]
        j-= gap;
      }

      // 5.将j位置元素赋值 current
      array[j] = current;
    }

    // 6.增量变化
    gap = Math.floor(gap / 2);
  }
}
```





希尔排序的效率：

- 希尔排序的效率很增量是有关系的；
- 但是，它的效率证明非常困难，甚至某些增量的效率到目前依然没有被证明岀来；
- 但是经过统计，希尔排序使用原始增量，最坏的情况下时间复杂度为O(N²)，通常==情况下都要好于O(N²)==。



总之我们使用希尔排序大多数情况下效率都高于简单排序：

- 这个可以通过统计排序算法的时间来证明；
- 甚至在合适的增量和某些数量N的情况下，还好好于快速排序。



### 五、快速排序

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230406150634855.png" alt="image-20230406150634855" style="zoom:50%;" />

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230406150701367.png" alt="image-20230406150701367" style="zoom:50%;" />



快速排序：

- 快速排序几乎可以说是目前所有排序算法中，==最快==的一种==排序算法==；
- 当然，没有任何一种算法是在任意情况下都是最优的；
- 比如希尔排序确实在某些情况下可能好于快速排序；
- 但是大多数情况下，快速排序还是比较好的选择。



==希尔==排序相当于==插入==排序的升级版，

==快速==排序是==冒泡==排序的升级版



==枢纽== (pivot) 的选择：

- 一种方案是直接选择第一个元素作为枢纽，但是效率不高
- 另一种比较优秀的方案是，取==头、中、尾的中位数==。例如：8、12、3、的中位数是8。

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230406150930582.png" alt="image-20230406150930582" style="zoom:50%;" />



==最坏==情况效率：

- 每次选择的==枢纽==都是==最左边==或者==最后边==的，那么效率等==同于冒泡排序==；
- 而我们的例子可能有最坏的情况吗？是不可能的.因为我们是选择三个值的中位值。



==平均效率==：

- 快速排序的平均效率是==O(N*logN)==
- 虽然其他某些算法的效率也可以达到O(N*logN)，但是快速排序是最好的



枢纽为中位数：

```js
function quickSort(array) {
  sort(0, array.length - 1);

  function sort(left, right) {

    if (left >= right) return;
    const pivot = median(array, left, right);
    let i = left;
    let j = right - 1;
    while (i < j) {
      while (array[++i] < pivot) { };
      while (array[--j] > pivot) { };
      if (i < j) {
        swap(array, i, j);
      }
    }
    swap(array, i, right - 1);
    sort(left, i - 1);
    sort(i + 1, right)
  }

  function swap(array, m, n) {
    const temp = array[m];
    array[m] = array[n]
    array[n] = temp;
  }

  function median(array, left, right) {
    let center = Math.floor((left + right) / 2);

    // 2.判断大小，并进行交换位置
    if (array[left] > array[center]) {
      swap(array, left, center);
    }

    if (array[center] > array[right]) {
      swap(array, center, right);
    }

    if (array[left] > array[center]) {
      swap(array, left, center);
    }

    // 3.将中位数与倒数第二个数交换
    swap(array, center, right - 1);

    // 4.返回枢纽数（即：交换后的中位数，倒数第二个数）
    return array[right - 1];
  }
}
```



枢纽为 最左边/最右边/中间数/任意数：

```js
function quickSort(array) {
  sort(0, array.length - 1);

  function sort(left, right) {
    if (left >= right) return;
    const pivotIndex = Math.floor((left + right) / 2);
    const pivot = array[pivotIndex];
    swap(array, right, pivotIndex);
    let i = left;
    let j = right - 1;
    while (i <= j) {
      while (array[i] < pivot) { i++ };
      while (array[j] > pivot) { j-- };
      if (i <= j) {
        swap(array, i, j);
      }
    }
    swap(array, i, right);
    sort(left, i - 1);
    sort(i + 1, right)
  }

  function swap(array, m, n) {
    const temp = array[m];
    array[m] = array[n]
    array[n] = temp;
  }
}
```



![image-20230410143729163](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230410143729163.png)



