title: js Date对象的详细使用
author: 熊 超
tags:
  - js
  - date
categories:
  - javascript
date: 2018-07-19 11:44:00
---
<!--more-->

## 前言：
&ensp;&ensp;&ensp;&ensp;最近发现Date对象在项目中真的是无处不在，几乎做过的所有项目中都有Date的各种用法，然而每次要使用的时候都是各种百度，自己既没有掌握Date的详细用法，也使得每次做项目都浪费很多时间，所以特此研究一下记录下来。




## 一：Date()对象基本方法示例：

```js
//Date()：返回当日的日期和时间。
var date = new Date();//Thu Jul 19 2018 10:46:06 GMT+0800

// getDay()：从 Date 对象返回一周中的某一天 (0 ~ 6)。
date.getDay();		//4 今天是星期四

// getFullYear()：从 Date 对象以四位数字返回年份。
date.getFullYear();		//2018

// getMonth()：从 Date 对象返回月份 (0 ~ 11)。
date.getMonth();		//6

// getDate()：从 Date 对象返回一个月中的某一天 (1 ~ 31)。
date.getDate();		//19

// getHours()：返回 Date 对象的小时 (0 ~ 23)。
date.getHours();		//10

// getMinutes()：返回 Date 对象的分钟 (0 ~ 59)。
date.getMinutes();		//53

// getSeconds()：返回 Date 对象的秒数 (0 ~ 59)。
date.getSeconds();		//5

// getMilliseconds()：返回 Date 对象的毫秒(0 ~ 999)。
date.getMilliseconds();		//522

// getTime()：返回 1970 年 1 月 1 日至今的毫秒数。
date.getTime();		//1531968785522

// setFullYear()：设置 Date 对象中的年份（四位数字）。
date.setFullYear(1995); //1531968785522

// setMonth()：设置 Date 对象中月份 (0 ~ 11)。
date.setMonth(8); //Wed Sep 19 2018 11:51:48 GMT+0800 (中国标准时间)

// setDate()：设置 Date 对象中月的某一天 (1 ~ 31)。
date.setDate(25); //Wed Jul 25 2018 11:52:15 GMT+0800 (中国标准时间)

// setTime()：以毫秒设置 Date 对象。
date.setTime(77771564221); 
console.log(date) //Mon Jun 19 1972 11:12:44 GMT+0800 (中国标准时间)

// toTimeString()：把 Date 对象的时间部分转换为字符串。
console.log(date.toTimeString()); => 11:58:45 GMT+0800 (中国标准时间)

// toDateString()：把 Date 对象的日期部分转换为字符串。
console.log(date.toDateString()); => Thu Jul 19 2018

```


## 二：Date()对象组合高级用法：

```js
//将毫秒转换为yyyy-MM-dd HH:mm:ss日期格式
function dateFormat(seconds) {
    let date = new Date(seconds),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        s = date.getSeconds();
    return `${year}-${formatNum(month)}-${formatNum(day)} ${formatNum(hour)}:${formatNum(min)}:${formatNum(s)}`;
}

//转换为yyyy-MM-dd日期格式
function dateFormatShort(date) {
    let year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate();
    return `${year}-${formatNum(month)}-${formatNum(day)}`;
}

//将yyyy-MM-dd HH:mm:ss转化为毫秒数
function formatMilliseconds(str){
    // str = '2018-7-19 15:14:30';
    str = str.replace(/-/g,'/');//由于部分浏览器以及一些低版本浏览器不兼容new Date(yyyy-MM-dd HH:mm:ss)
    let date = new Date(str);
    return date.getTime();
}

//获取两个时间的秒数差
function SecondsDiff(startDate,endDate){
    startDate = "2018-7-18 10:56:23",endDate = "2018-7-19 12:00:00";
    let startTime = formatMilliseconds(startDate),//获得毫秒数
        endTime = formatMilliseconds(endDate),
        milliseconds = endTime - startTime;//毫秒数之差
    return parseInt(milliseconds/1000);
}

//根据剩余秒数获取剩余HH:mm:ss（应用在活动倒计时或物品过期还有多久'dd天HH小时'）
function secondsFormat(seconds){
    seconds = SecondsDiff();
    let day = Math.floor(seconds / 3600 / 24),
        hour = Math.floor((seconds % 86400) / 3600),
        min = Math.floor((seconds % 86400 % 3600) / 60 ),
        second = Math.floor(seconds % 86400 % 3600 % 60);
        hour += day * 24;
    return `${formatNum(hour)}:${formatNum(min)}:${formatNum(second)}`;//为什么只计算天数,因为一般活动只在相邻几天
}
    
//获得某月的天数　　 
function getMonthDays(year, month) {
    let nowDate = new Date(year,month,0),
        days = nowDate.getDate();
    return days;
}

//补0操作
function formatNum(e) {
    return e >= 10 ? e : `0${e}`;
}
	
```


## 三：对当前时间的判定：

```js
//判断时间是否是今天
function isToday(str){
    str = new Date(str.replace(/-/g,"/"));
    if (str.toDateString() === new Date().toDateString()) {//今天
        return true;
    } else if (new Date(str) > new Date()){
        return false;
    }
}

/**
* 判断某个时间是前天、昨天、今天、明天、后天
* @now:当前服务器时间
*/
function daysText(str,now){
    let date = str.substring(0,str.indexOf("-")+6);
    now = new Date(now.replace(/-/g,'/'));
    now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    str = new Date(str.replace(/-/g,'/'));
    str = new Date(str.getFullYear(), str.getMonth(), str.getDate());
    let diff = (str - now) / 1000 / 60 / 60 / 24;
    if (diff < -1) {
        return "前天";
    } else if (diff < -0) {
        return "昨天"
    } else if (diff == 0) {
        return "今天";
    } else if (diff < 2) {
        return "明日";
    } else if (diff < 3) {
        return "后天";
    } else {
        return date;
    }
}

//判断是否超过48小时
function overTime(seconds) {
    let diffSeconds = Math.floor((new Date().getTime() - seconds)/1000),
        days = Math.floor(diffSeconds / 86400),
        hour = Math.floor(diffSeconds % 86400 / 3600),
        min = Math.floor((diffSeconds % 86400 % 3600) / 60 )
        second = Math.floor(diffSeconds % 86400 % 3600 % 60);

    if(days>2){//超过两天超时
        return 0;
    }else if(days==2){ //刚好两天判断时分秒
        if(hour==0){ 
            if(min==0){
                if(second==0){
                    return 1;
                }else{ //有多余秒数，超时
                    return 0;
                }
            }else{ //有多余分钟，超时
                return 0;
            }
        }else{ //还有多余小时，超时
            return 0;
        }
    }else { //小于两天则没有超时
        return 1;
    }
}

/**
 * 判断某个时间相对于现在过了多久
 * seconds:毫秒数
 */
function pastTimes(seconds){
    //得到时间
    let dateTime;

    //传入时间
    let starDate = new Date(seconds),
        starYear = starDate.getFullYear(), //年
        starMonth = starDate.getMonth() + 1, //月
        starDay = starDate.getDate(),     //日
        starHour = starDate.getHours(),   //时
        starMin = starDate.getMinutes(),  //分
        starSen = starDate.getSeconds(); //秒

    //当前时间
    let nowDate = new Date(),
        nowYear = nowDate.getFullYear(), //年
        nowMonth = nowDate.getMonth() + 1, //月
        nowDay = nowDate.getDate(),     //日
        nowHour = nowDate.getHours(),   //时
        nowMin = nowDate.getMinutes(),  //分
        nowSen = nowDate.getSeconds();  //秒
    //判断是否在同一年
    if (starYear == nowYear) {
        //判断是否是同一个月
        if (starMonth == nowMonth) {
             //判断在今天昨天或者前天
            let diffDay = nowDay - starDay;
            if (diffDay == 0) {//今天
                //判断小时数
                let diffHours = nowHour - starHour;
                let diffMinutes = nowMin - starMin;
                if (diffHours == 0) {
                    if (diffMinutes >= 0 && diffMinutes < 2) {
                        dateTime = "刚刚";
                    } else if (diffMinutes >= 2) {
                        dateTime = diffMinutes + "分钟前";
                    }
                }else if (diffHours == 1) {
                    if (diffMinutes < 0) {
                        let minute = (60 - starMin) + (nowMin - 0);
                        dateTime = minute + "分钟前";
                    } else if (diffMinutes > 0) {
                        dateTime = "1个小时前";
                    }
                }else if (diffHours == 2) {
                     if (diffMinutes < 0) {
                        dateTime = "1个小时前";
                    } else if (diffMinutes > 0) {
                        dateTime = "2个小时前";
                    }
                }else{
                    dateTime = formatNum(starHour) + ':' + formatNum(starMin);
                }

            }else if(diffDay == 1) {//昨天
                dateTime = '昨天' + formatNum(starHour) + ':' + formatNum(starMin);
            }else if (diffDay == 2) {//前天
                dateTime = '前天' + formatNum(starHour) + ':' + formatNum(starMin);
            }else{
                dateTime = formatNum(starMonth) + '-' + formatNum(starDay) + ' ' + formatNum(starHour) + ':' + formatNum(starMin);
            }
        }else{
            //不在同一个月且在同一年的不显示年份
            dateTime = formatNum(starMonth) + '-' + formatNum(starDay) + ' ' + formatNum(starHour) + ':' + formatNum(starMin);
        }
    }else{
        //不在同一年的显示年月日时分
        dateTime = starYear + '-' + formatNum(starMonth) + '-' + formatNum(starDay) + ' ' + formatNum(starHour) + ':' + formatNum(starMin);
    }

    return dateTime
    
}

```