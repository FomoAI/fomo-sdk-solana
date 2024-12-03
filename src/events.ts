import { Program } from "@coral-xyz/anchor";
import { FomoContract } from "./idl/fomo_contract.devnet";
import { FomoEventMapping } from "./types";

export class FomoEvents {
  private program: Program<FomoContract>;
  constructor(program: Program<FomoContract>) {
    this.program = program;
  }

  addFomoListener<E extends keyof FomoEventMapping>(
    e: E,
    fn: (data: FomoEventMapping[E]) => Promise<void>
  ) {
    this.program.addEventListener(e, async (data) => {
      await fn(data);
    });
  }
}
