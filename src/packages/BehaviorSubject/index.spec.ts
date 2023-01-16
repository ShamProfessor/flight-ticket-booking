import BehaviorSubject from './index'

test('can communicate via p2p', () => {
  const subject = new BehaviorSubject()
  const subscription = jest.fn()
  subject.subscribe(subscription)
  subject.dispatch({})
  expect(subscription).toHaveBeenCalled()
})

test('events can be received when subscribe is after dispatch', () => {
  const subject = new BehaviorSubject()
  const subscription = jest.fn()
  subject.dispatch({})
  subject.subscribe(subscription)
  expect(subscription).toHaveBeenCalled()
})

test('subscription do not received same event twice', () => {
  const subject = new BehaviorSubject()

  const subscriptionA = jest.fn()
  const subscriptionB = jest.fn()

  subject.subscribe(subscriptionA)
  subject.dispatch({})
  expect(subscriptionA).toHaveBeenCalled()

  subject.subscribe(subscriptionB)
  expect(subscriptionB).toHaveBeenCalled()
  expect(subscriptionA).toHaveBeenCalledTimes(1)
})

test('do not recived event when subject is empty', () => {
  const subject = new BehaviorSubject<string>()
  const subscription = jest.fn()
  const a: string = undefined as unknown as string
  subject.dispatch(a)
  subject.subscribe(subscription)
  expect(subscription).not.toHaveBeenCalled()
})
