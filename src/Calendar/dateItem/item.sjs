function GetDateItemWrapperClass (dateItem = {}) {
  let style = ""
  let className = ""
  const { isToday, isRangeStart, isRangeEnd, isRangeArea, holiday, tag, lunar, disable, showBorderRadiusLeft, showBorderRadiusRight } = dateItem
  if (isRangeEnd || isRangeStart) {
    style = "background: #1777FF;";
    className += 'amd-calendar-dateItem-wrapper-rangeedge'
  } else if (isRangeArea) {
    style = "background: rgba(22,119,255,0.10);"
    className += 'amd-calendar-dateItem-wrapper-rangearea'
  } else if (disable) {
    style = "opacity: 0.4;"
    className += 'amd-calendar-dateItem-wrapper-disabled'
  }

  if (showBorderRadiusLeft && showBorderRadiusRight) {
    style += 'border-radius: 8rpx;'
  } else if (showBorderRadiusLeft) {
    style += 'border-radius: 8rpx 0 0 8rpx;'
  } else if (showBorderRadiusRight) {
    style += 'border-radius: 0 8rpx 8rpx 0;'
  }

  return {
    style,
    className,
  }
}

function GetDateItemAboveAreaTextAndClass (dateItem = {}) {
  const { isToday, isRangeEnd, isRangeStart, isSingleSelect, isRangeArea, holiday, tag, lunar } = dateItem

  let text = ""
  let color = '#999999'
  let className = ""

  if (!isSingleSelect && (isRangeStart || isRangeEnd)) {
    if (isRangeStart && isRangeEnd) {
      text = '开始/结束'
    } else if (isRangeStart) {
      text = '开始'
    } else if (isRangeEnd) {
      text = '结束'
    }
  } else if (tag && holiday && holiday.isHolidayStartDay) {
  // 节假日第一天
    text = holiday.name
    color = '#F93A4A'
  } else if (isToday) {
    text = '今日'
  } else if (tag && lunar) {
    text = lunar.IDayCn
  }

  if (isRangeEnd || isRangeStart) {
    color = '#FFFFFF'
    className += 'amd-calendar-dateItem-above-rangeedge'
  }

  return {
    text,
    style: `color: ${color}`,
    className
  }
}

function GetDateItemMiddleAreaTextAndClass (dateItem = {}) {
  const { isToday, isRangeStart, isRangeEnd, isRangeArea, holiday, tag, date } = dateItem

  let color = "#333333"
  let text = date
  let className = ""

  if (isRangeStart || isRangeEnd) {
    color = "#fff"
    className += 'amd-calendar-dateItem-middle-rangeedge'
  }

  return {
    style: `color: ${color}`,
    text,
    className
  }
}

function GetDateItemBottomAreaTextAndClass (dateItem = {}) {
  const { isToday, isRangeStart, isRangeEnd, isRangeArea, holiday, tag, lunar } = dateItem
  let text = ""
  let color = '#999999'
  let className = ''

  if (tag) {
    text = tag.text
    color = tag.color
  } else if (holiday && holiday.isHolidayStartDay) {
    // 节假日第一天
      text = holiday.name
      color = '#F93A4A'
  } else if (lunar) {
    text = lunar.IDayCn
  }

  if (isRangeStart || isRangeEnd) {
    color = '#FFFFFF'
    className += 'amd-calendar-dateItem-bottom-rangeedge'
  }

  return {
    text,
    style: `color: ${color}`,
    className
  }
}

export default {
  GetDateItemBottomAreaTextAndClass,
  GetDateItemAboveAreaTextAndClass,
  GetDateItemWrapperClass,
  GetDateItemMiddleAreaTextAndClass
}