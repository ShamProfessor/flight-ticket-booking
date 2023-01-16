const { flightTicketBookingApp } = require('../app')

describe('测试 flightTicketBookingApp', () => {
  it('REWARD | 20160410SUN | 20160420WED', () => {
    const result = flightTicketBookingApp('REWARD', '20160410SUN', '20160420WED')
    expect(result.departingFlight).toBe('GD8732')
    expect(result.returningFlight).toBe('GD2502')
  })

  it('REGULAR | 20160415FRI | 20160418MON', () => {
    const result = flightTicketBookingApp('REGULAR', '20160415FRI', '20160418MON')
    expect(result.departingFlight).toBe('GD2501')
    expect(result.returningFlight).toBe('GD2607')
  })

  it('REWARD | 20160415FRI | 20160418MON | 20160415 20160418 被设置为节假日', () => {
    const result = flightTicketBookingApp('REWARD', '20160415FRI', '20160418MON')
    expect(result.departingFlight).toBe('GD2501')
    expect(result.returningFlight).toBe('GD2607')
  })
})
