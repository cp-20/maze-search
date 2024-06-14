export class PriorityQueue<T> {
  private queue: { value: T; cost: number }[] = []

  constructor(initialValues: { value: T; cost: number }[] = []) {
    this.queue = initialValues
    this.queue.sort((a, b) => a.cost - b.cost)
  }

  public enqueue(value: T, cost: number) {
    this.queue.push({ value, cost })
    this.queue.sort((a, b) => a.cost - b.cost)
  }

  public dequeue() {
    return this.queue.shift()
  }

  public isEmpty() {
    return this.queue.length === 0
  }
}
