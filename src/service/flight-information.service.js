const { FlightInformation } = require('./../entity')

class FlightInformationService {
  static totalFlightInformation = [
    new FlightInformation('GD2501', '08:00', 'Xi’an', 'Chengdu'),
    new FlightInformation('GD2606', '12:25', 'Xi’an', 'Chengdu'),
    new FlightInformation('GD8732', '19:30', 'Xi’an', 'Chengdu'),
    new FlightInformation('GD2502', '12:00', 'Chengdu', 'Xi’an'),
    new FlightInformation('GD2607', '16:25', 'Chengdu', 'Xi’an'),
    new FlightInformation('GD8733', '23:30', 'Chengdu', 'Xi’an')
  ]

  static findByFlightNumber = flightNumber => {
    const result = FlightInformationService.totalFlightInformation.filter(item => {
      return item.flightNumber === flightNumber
    })
    return result.length === 1 ? result[0] : null
  }

  static findByDepartingPlace = (departingPlace = 'Xi’an') => {
    return FlightInformationService.totalFlightInformation.filter(item => item.departure === departingPlace)
  }

  static findByReturningPlace = (returningPlace = 'Chengdu') => {
    return FlightInformationService.totalFlightInformation.filter(item => item.departure === returningPlace)
  }
}

module.exports = FlightInformationService
