import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Subscription {
  type: 'basic' | 'plus';
}

@Injectable({
  providedIn: 'root'
})
export class AboService {
  private currentSubscription: Subscription = {
    type: 'basic'
  };

  checkAccess(): boolean {
    return this.currentSubscription.type !== 'basic';
  }

  getSubscriptionType(): 'basic' | 'plus' {
    return this.currentSubscription.type;
  }

  setSubscription(type: 'basic' | 'plus') {
    this.currentSubscription.type = type;
  }
}
