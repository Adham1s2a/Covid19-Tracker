const isFunction = (fn: any) => typeof fn === 'function';
export type Nullable<T> = T | null | undefined;

export interface SubscriptionLike {
  unsubscribe(): void;
}

export class SubSink {
  protected _subs: Nullable<SubscriptionLike>[] = [];

  constructor() {}

  add(...subscriptions: Nullable<SubscriptionLike>[]) {
    this._subs = this._subs.concat(subscriptions);
  }

  set sink(subscription: Nullable<SubscriptionLike>) {
    this._subs.push(subscription);
  }
  unsubscribe() {
    this._subs.forEach(
      (sub) => sub && isFunction(sub.unsubscribe) && sub.unsubscribe()
    );
    this._subs = [];
  }
}
