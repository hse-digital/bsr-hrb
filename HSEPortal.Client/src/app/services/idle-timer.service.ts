import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdleTimerService {
  private timeout!: number;
  private eventHandler!: (() => void);
  private interval!: any;
  private onTimeout!: any;
  private timeoutTracker!: any;

  initTimer(timeout: number, onTimeout: any) {
    this.timeout = timeout;
    this.onTimeout = onTimeout;

    this.eventHandler = this.updateExpiredTime.bind(this);
    this.tracker();
    this.startInterval();
  }

  private startInterval() {
    this.updateExpiredTime();

    this.interval = setInterval(() => {
      console.log("interval");
      const expiredTime = parseInt(localStorage.getItem("_expiredTime") ?? '', 10);
      if (expiredTime < Date.now()) {
        if (this.onTimeout) {
          this.onTimeout();
          this.cleanUp();
        }
      }
    }, 1000);
  }

  private updateExpiredTime() {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
    }
    this.timeoutTracker = setTimeout(() => {
      let expiredTime = Date.now() + this.timeout * 1000;
      localStorage.setItem("_expiredTime", expiredTime.toString());
    }, 300);
  }

  private tracker() {
    window.addEventListener("mousemove", this.eventHandler);
    window.addEventListener("scroll", this.eventHandler);
    window.addEventListener("keydown", this.eventHandler);
  }

  private cleanUp() {
    clearInterval(this.interval);
    localStorage.removeItem("_expiredTime");
    window.removeEventListener("mousemove", this.eventHandler);
    window.removeEventListener("scroll", this.eventHandler);
    window.removeEventListener("keydown", this.eventHandler);
  }

}
