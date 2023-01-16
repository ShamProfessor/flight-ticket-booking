const { FlightInformationService, FlightPriceService } = require('./service')
const { getDateType, findLowestPrice, getFlightCustomerType } = require('./util')

/**
 * 入口 App
 * @param {string} customerType 顾客类型
 * @param {string} departingDate 出发日期
 * @param {string} returningDate 返回日期
 * @return {*}
 */
const flightTicketBookingApp = (customerType, departingDate, returningDate) => {
  const departingDateType = getDateType(departingDate)
  const returningDateType = getDateType(returningDate)
  const departingFlightInfoList = FlightInformationService.findByDepartingPlace()
  const returningFlightInfoList = FlightInformationService.findByReturningPlace()
  const departingFlightCustomerType = getFlightCustomerType(departingDate, customerType)
  const returningFlightCustomerType = getFlightCustomerType(returningDate, customerType)
  const departingFlightPriceList = FlightPriceService.findFlightPriceList(
    departingFlightInfoList,
    departingFlightCustomerType,
    departingDateType
  )
  const returningFlightPriceList = FlightPriceService.findFlightPriceList(
    returningFlightInfoList,
    returningFlightCustomerType,
    returningDateType
  )
  const departingFlight = findLowestPrice(departingFlightPriceList).flightNumber
  const returningFlight = findLowestPrice(returningFlightPriceList).flightNumber
  return {
    departingFlight,
    returningFlight
  }
}

module.exports = {
  flightTicketBookingApp
}
