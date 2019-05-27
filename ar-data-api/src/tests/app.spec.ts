import { expect } from "chai";
import * as mocha from "mocha";
import MyClass from "../routes/fake";

describe("\n💀 💀 💀 💀 💀  🎈  AR MongoDB API unit tests   🎈  ☘️ 🍀", () => {
  it("\n💚  💙  💜   should return 12", () => {
    console.log(
      `\n\n💀  💀   Running fake test. 💀  🎈 🎈 🎈 🎈  just to get going ....`
    );
    const result = MyClass.sum(5, 7);

    expect(result).to.equal(12);
  });
});
