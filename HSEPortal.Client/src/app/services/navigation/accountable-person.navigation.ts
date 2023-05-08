import { BaseNavigation } from "./navigation";

class AccountablePersonNavigation extends BaseNavigation {
  override getNextRoute(): string {
    throw new Error("Method not implemented.");
  }

}