import { ValueFactor } from "./value-factor";

export class LoyaltyLevel {
    id: string;
    name: string;
    valueFactor: ValueFactor;
    loyaltyProgram: string;
  
    constructor(id: string, name: string, valueFactor: ValueFactor, loyaltyProgram: string) {
      this.id = id;
      this.name = name;
      this.valueFactor = valueFactor;
      this.loyaltyProgram = loyaltyProgram;
    }
  }