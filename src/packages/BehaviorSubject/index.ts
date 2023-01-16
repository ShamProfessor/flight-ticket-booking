class BehaviorSubject<T = any> {
  private source: [T] | [] = []
  private subscriptions: ((d: T) => void)[] = []

  private cast(subscription: (d: T) => void) {
    const argument = this.source[0]
    if (argument === undefined) return
    subscription(argument)
  }

  private multicast() {
    this.subscriptions.forEach(this.cast.bind(this))
  }

  public dispatch(data: T) {
    this.source = [data]
    this.multicast()
  }

  public subscribe(callback: (d: T) => void) {
    this.subscriptions.push(callback)
    this.cast(callback)
  }

  public unsubscribe(callback: (d: T) => void) {
    this.subscriptions = this.subscriptions.filter(subscription => subscription !== callback)
  }
}

export default BehaviorSubject
