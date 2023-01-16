const { FlightPrice } = require('./../entity')
const { CustomerType, DateType } = require('./../enum')
class FlightPriceService {
  /* 
    GD2501 ¥1100 ¥800 ¥900 ¥500
    GD2606 ¥1600 ¥1100 ¥600 ¥500
    GD8732 ¥2200 ¥1000 ¥1500 ¥400
    GD2502 ¥1700 ¥800 ¥900 ¥800
    GD2607 ¥1600 ¥1100 ¥600 ¥500
    GD8733 ¥1600 ¥1500 ¥1000 ¥400
   */
  static totalFlightPrice = [
    new FlightPrice('GD2501', CustomerType.REGULAR, DateType.WEEKDAYS, 1100),
    new FlightPrice('GD2501', CustomerType.REWARD, DateType.WEEKDAYS, 800),
    new FlightPrice('GD2501', CustomerType.REGULAR, DateType.WEEKENDS, 900),
    new FlightPrice('GD2501', CustomerType.REWARD, DateType.WEEKENDS, 500),

    new FlightPrice('GD2606', CustomerType.REGULAR, DateType.WEEKDAYS, 1600),
    new FlightPrice('GD2606', CustomerType.REWARD, DateType.WEEKDAYS, 1100),
    new FlightPrice('GD2606', CustomerType.REGULAR, DateType.WEEKENDS, 600),
    new FlightPrice('GD2606', CustomerType.REWARD, DateType.WEEKENDS, 500),

    new FlightPrice('GD8732', CustomerType.REGULAR, DateType.WEEKDAYS, 2200),
    new FlightPrice('GD8732', CustomerType.REWARD, DateType.WEEKDAYS, 1000),
    new FlightPrice('GD8732', CustomerType.REGULAR, DateType.WEEKENDS, 1500),
    new FlightPrice('GD8732', CustomerType.REWARD, DateType.WEEKENDS, 400),

    new FlightPrice('GD2502', CustomerType.REGULAR, DateType.WEEKDAYS, 1700),
    new FlightPrice('GD2502', CustomerType.REWARD, DateType.WEEKDAYS, 800),
    new FlightPrice('GD2502', CustomerType.REGULAR, DateType.WEEKENDS, 900),
    new FlightPrice('GD2502', CustomerType.REWARD, DateType.WEEKENDS, 800),

    new FlightPrice('GD2607', CustomerType.REGULAR, DateType.WEEKDAYS, 1600),
    new FlightPrice('GD2607', CustomerType.REWARD, DateType.WEEKDAYS, 1100),
    new FlightPrice('GD2607', CustomerType.REGULAR, DateType.WEEKENDS, 600),
    new FlightPrice('GD2607', CustomerType.REWARD, DateType.WEEKENDS, 500),

    new FlightPrice('GD8733', CustomerType.REGULAR, DateType.WEEKDAYS, 1600),
    new FlightPrice('GD8733', CustomerType.REWARD, DateType.WEEKDAYS, 1500),
    new FlightPrice('GD8733', CustomerType.REGULAR, DateType.WEEKENDS, 1000),
    new FlightPrice('GD8733', CustomerType.REWARD, DateType.WEEKENDS, 400)
  ]

  static findFlightPrice = (flightNumber, customerType, dateType) => {
    const result = FlightPriceService.totalFlightPrice.filter(item => {
      return item.flightNumber === flightNumber && item.customerType === customerType && item.dateType === dateType
    })
    return result.length === 1 ? result[0] : null
  }

  static findFlightPriceList = (flightInfoList, customerType, dateType) => {
    return flightInfoList.map(item => {
      const { flightNumber, scheduled } = item
      const result = FlightPriceService.findFlightPrice(flightNumber, customerType, dateType)
      return {
        ...result,
        scheduled
      }
    })
  }
}

module.exports = FlightPriceService
