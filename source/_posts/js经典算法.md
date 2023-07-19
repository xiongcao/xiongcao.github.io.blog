title: js经典排序算法
author: 熊 超
tags:
  - Array
  - sort
categories:
  - 算法
date: 2018-07-27 15:19:00
---
<!--more-->

### 1.冒泡排序（Bubble Sort）

冒泡排序动图演示：
![](http://xiongcao.github.io/images/blogs/1867034-e19840224b331fae.gif)

```
定义： 比较相邻的前后二个数据，如果前面数据大于后面的数据，就将二个 数据交换。
对数组的第0个数据到N-1个数据进行一次遍历后，最大的一个数据就“沉”到数组第N-1个位置。
N=N-1，如果N不为0就重复前面二步，否则排序完成。
```
```js
function bubbleSort(arr){
    var len = arr.length;
    for(var i = 0;i < len;i++){
        for(var j = 0;j < len - 1 - i;j++){
            if(arr[j]>arr[j+1]){
                var temp = arr[j];
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
}
```
### 2.选择排序（Selection Sort）

选择排序动图演示：
![](http://xiongcao.github.io/images/blogs/1867034-c6cc220cfb2b9ac8.gif)

```js
/**
* 比如在一个长度为N的无序数组中，在第一趟遍历N个数据，找出其中最小的数值与
* 第一个元素交换，第二趟遍历剩下的N-1个数据，找出其中最小的数值与第二个元
* 素交换……第N-1趟遍历剩下的2个数据，找出其中最小的数值与第N-1个元素交换，
* 至此选择排序完成。
*/
function selectSort(arr){
    var min,temp;
    for(var i=0;i<arr.length-1;i++){
        min=i;
        for(var j=i+1;j<arr.length;j++){
            if(arr[j]<arr[min]){
                min = j;
            }
        }
        temp=arr[i];
        arr[i]=arr[min];
        arr[min]=temp;

    }
    return arr;
}
```

### 3.插入排序（Insertion Sort）

插入排序动图演示：
![](http://xiongcao.github.io/images/blogs/1867034-d1537e355abdd298.gif)

```
从第一个元素开始，该元素可以认为已经被排序； 
取出下一个元素，在已经排序的元素序列中从后向前扫描； 
如果该元素（已排序）大于新元素，将该元素移到下一位置； 
重复步骤3，直到找到已排序的元素小于或者等于新元素的位置； 
将新元素插入到该位置后； 
重复步骤2~5。
```
```js
function insertionSort(arr) {
    var len = arr.length;
    var preIndex, current;
    for (var i = 1; i < len; i++) {
        preIndex = i - 1;
        current = arr[i];
        while(preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex+1] = arr[preIndex];
            preIndex--;
        }
        arr[preIndex+1] = current;
    }
    return arr;
}
```

### 4.快速排序（Quick Sort）
快速排序动图演示：
![](http://xiongcao.github.io/images/blogs/1867034-cd65e35d7dce5045.gif)

```
先从数列中取出一个数作为基准数。
分区过程，将比这个数大的数全放到它的右边，小于或等于它的数全放到它的左边。
再对左右区间重复第二步，直到各区间只有一个数。
```

```js
function quickSort(arr){
    if(arr.length<2){
        return arr
    }
    var left=[],right=[],mid=arr.splice(Math.floor(arr.length/2),1);
    for(var i=0;i<arr.length;i++){
            if(arr[i]<mid){
                left.push(arr[i]);
            }else {
                right.push(arr[i])
            }
    }
    return bubbleSort(left).concat(mid,bubbleSort(right))
  }
```