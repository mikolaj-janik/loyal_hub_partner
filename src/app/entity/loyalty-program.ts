import { LoyaltyLevel } from "./loyalty-level";

export class LoyaltyProgram {
    id: string;
    name: string;
    loyalty_levels: LoyaltyLevel[];
  
    constructor(id: string, name: string, loyalty_levels: LoyaltyLevel[]) {
      this.id = id;
      this.name = name;
      this.loyalty_levels = loyalty_levels;
    }
  }