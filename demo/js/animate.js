function animate (element = {}, target, callback) {
  // 清除之前的计时器，只保留当前一个定时器
  clearInterval(element.timer)

  element.timer = setInterval(function () {

    let left = element.offsetLeft
    // 设置步长，即每次移动的距离 （目标值 - 当前位置）/ 10
    let step = (target - left) / 10
    step = step > 0 ? Math.ceil(step) : Math.floor(step)
    
    if (left == target) {
      clearInterval(element.timer)
      callback && callback()
    }
    element.style.left = left + step + 'px'
  }, 15)
}