const { WEEKDAYS_SET, WEEKENDS_SET, HOLIDAYS_SET } = require('./../constant')
const { DateType, ScheduledCompareStatus, CustomerType } = require('./../enum')

/**
 * 获取 DateType
 * @param {string} date
 * @return {*}
 */
const getDateType = date => {
  const day = date.slice(8)
  if (WEEKDAYS_SET.has(day)) {
    return DateType.WEEKDAYS
  } else if (WEEKENDS_SET.has(day)) {
    return DateType.WEEKENDS
  } else {
    return null
  }
}

/**
 * 比较两个时间谁与 PM12:00 更接近
 * 注意：12 小时制的 PM12:00 ，指的是 24 小时制的 12:00
 * @param {*} prev
 * @param {*} next
 * @return {*}
 */
const compareScheduled = (prev, next) => {
  if (prev === next) return ScheduledCompareStatus.EQUALS
  const currentTimeStamp = new Date().valueOf()
  const prevTimeStamp = new Date(currentTimeStamp).setHours(...prev.split(':'), '00', '00')
  const nextTimeStamp = new Date(currentTimeStamp).setHours(...next.split(':'), '00', '00')
  const noonTimeStamp = new Date(currentTimeStamp).setHours('12', '00', '00', '00')
  const prevNoonDiffAbs = Math.abs(prevTimeStamp - noonTimeStamp)
  const nextNoonDiffAbs = Math.abs(nextTimeStamp - noonTimeStamp)

  if (prevNoonDiffAbs < nextNoonDiffAbs) {
    return ScheduledCompareStatus.CLOSER
  } else if (prevNoonDiffAbs > nextNoonDiffAbs) {
    return ScheduledCompareStatus.FARTHER
  } else {
    return ScheduledCompareStatus.EQUALS
  }
}

/**
 * 获取最低价格
 * @param {*} flightPriceList
 */
const findLowestPrice = flightPriceList => {
  const result = flightPriceList.reduce((prev, next) => {
    if (prev.price < next.price) {
      return prev
    } else if (prev.price > next.price) {
      return next
    } else {
      let count = 0
      count += compareScheduled(prev.scheduled, next.scheduled)
      return count > 0 ? prev : next
    }
  })
  return result
}

/**
 * 判断当前日期是否是节假日
 * @param {*} date
 * @return {*}
 */
const isHoliday = date => {
  const day = date.slice(0, 8)
  return HOLIDAYS_SET.has(day)
}

/**
 * 获取当前的用户类型 ( 受节假日影响 REWARD 会降级为 REGULAR )
 * @param {*} date
 * @param {*} customerType
 * @return {*}
 */
const getFlightCustomerType = (date, customerType) => {
  return isHoliday(date) ? CustomerType.REGULAR : customerType
}

module.exports = {
  getDateType,
  compareScheduled,
  findLowestPrice,
  isHoliday,
  getFlightCustomerType
}
