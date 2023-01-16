const { getDateType, compareScheduled } = require('./../util')
const { DateType, ScheduledCompareStatus } = require('./../enum')

describe('util', () => {
  describe('getDateType', () => {
    it('测试 20160410SUN', () => {
      const result = getDateType('20160410SUN')
      expect(result).toBe(DateType.WEEKENDS)
    })

    it('测试 20160420WED', () => {
      const result = getDateType('20160420WED')
      expect(result).toBe(DateType.WEEKDAYS)
    })

    it('测试 20160415FRI', () => {
      const result = getDateType('20160415FRI')
      expect(result).toBe(DateType.WEEKDAYS)
    })

    it('测试 20160420WED', () => {
      const result = getDateType('20210808SUN')
      expect(result).toBe(DateType.WEEKENDS)
    })

    it('测试 错误数据', () => {
      const result = getDateType('20210808HHH')
      expect(result).toBe(null)
    })
  })

  describe('compareScheduled', () => {
    it('测试 12:00 12:00', () => {
      expect(compareScheduled('12:00', '12:00')).toBe(ScheduledCompareStatus.EQUALS)
    })

    it('测试 12:00 13:00', () => {
      expect(compareScheduled('12:00', '13:00')).toBe(ScheduledCompareStatus.CLOSER)
    })

    it('测试 13:00 12:00', () => {
      expect(compareScheduled('13:00', '12:00')).toBe(ScheduledCompareStatus.FARTHER)
    })

    it('测试 11:00 13:00', () => {
      expect(compareScheduled('11:00', '13:00')).toBe(ScheduledCompareStatus.EQUALS)
    })
  })

  describe('findLowestPrice', () => {})
})
