import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdleTimerService {
  private timeout!: number;
  private eventHandler!: (() => void);
  private onTimeout!: any;
  private timeoutTracker!: any;

  initTimer(timeout: number, onTimeout: any) {
    if (typeof window !== 'undefined') {
      this.timeout = timeout;
      this.onTimeout = onTimeout;

      this.eventHandler = this.updateExpiredTime.bind(this);
      window.addEventListener("mousemove", this.eventHandler);
      window.addEventListener("scroll", this.eventHandler);
      window.addEventListener("keydown", this.eventHandler);
    }
  }

  private updateExpiredTime() {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
    }

    var toExpire = this.timeout * 1000;
    this.timeoutTracker = setTimeout(() => {
      this.onTimeout();
      this.cleanUp();
    }, toExpire);
  }

  private cleanUp() {
    clearTimeout(this.timeoutTracker);
    window.removeEventListener("mousemove", this.eventHandler);
    window.removeEventListener("scroll", this.eventHandler);
    window.removeEventListener("keydown", this.eventHandler);
  }

}
