const CustomerType = {
  REGULAR: 'REGULAR',
  REWARD: 'REWARD'
}

const DateType = {
  WEEKDAYS: 'WEEKDAYS',
  WEEKENDS: 'WEEKENDS'
}

const ScheduledCompareStatus = {
  CLOSER: 1,
  EQUALS: 0,
  FARTHER: -1
}

module.exports = {
  CustomerType,
  DateType,
  ScheduledCompareStatus
}
