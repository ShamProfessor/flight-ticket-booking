const { FlightInformationService, FlightPriceService } = require('./../service')
const { DateType, CustomerType } = require('./../enum')
describe('测试 FlightInformationService', () => {
  describe('findByFlightNumber', () => {
    it('测试 GD2501', async () => {
      const result = FlightInformationService.findByFlightNumber('GD2501')
      expect(result.flightNumber).toBe('GD2501')
      expect(result.scheduled).toBe('08:00')
      expect(result.departure).toBe('Xi’an')
      expect(result.arrival).toBe('Chengdu')
    })

    it('测试 GD2607', async () => {
      const result = FlightInformationService.findByFlightNumber('GD2607')
      expect(result.flightNumber).toBe('GD2607')
      expect(result.scheduled).toBe('16:25')
      expect(result.departure).toBe('Chengdu')
      expect(result.arrival).toBe('Xi’an')
    })

    it('测试 不存在的航班号', async () => {
      const result = FlightInformationService.findByFlightNumber('GD6666')
      expect(result).toBe(null)
    })
  })

  describe('findByDepartingPlace', () => {
    it('测试默认参数', async () => {
      const result = FlightInformationService.findByDepartingPlace()
      expect(result.length).toBe(3)
      expect(result.map(item => item.departure)).toEqual(['Xi’an', 'Xi’an', 'Xi’an'])
    })
  })

  describe('findByDepartingPlace', () => {
    it('测试默认参数', async () => {
      const result = FlightInformationService.findByReturningPlace()
      expect(result.length).toBe(3)
      expect(result.map(item => item.departure)).toEqual(['Chengdu', 'Chengdu', 'Chengdu'])
    })
  })
})

describe('测试 FlightPriceService', () => {
  describe('findFlightPrice', () => {
    it('测试 GD2501 CustomerType.REGULAR, DateType.WEEKDAYS', async () => {
      const result = FlightPriceService.findFlightPrice('GD2501', CustomerType.REGULAR, DateType.WEEKDAYS)
      expect(result.price).toBe(1100)
    })

    it('测试 GD2606 CustomerType.REWARD, DateType.WEEKENDS', async () => {
      const result = FlightPriceService.findFlightPrice('GD2606', CustomerType.REWARD, DateType.WEEKENDS)
      expect(result.price).toBe(500)
    })

    it('测试 错误的数据', async () => {
      const result = FlightPriceService.findFlightPrice('GD6666', CustomerType.REWARD, DateType.WEEKENDS)
      expect(result).toBe(null)
    })
  })
})
