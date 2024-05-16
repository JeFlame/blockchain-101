import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { assert } from "chai";
import { ignition } from "hardhat";
import SimpleStorageModule from "../ignition/modules/SimpleStorage";

describe("SimpleStorage", function () {
  async function deploySimpleStorageModuleFixture() {
    return ignition.deploy(SimpleStorageModule);
  }

  it("Should start with a favorite number of 0", async function () {
    const { simpleStorage } = await loadFixture(
      deploySimpleStorageModuleFixture
    );

    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";

    assert.equal(currentValue.toString(), expectedValue);
  });

  it("Should update when we call store", async function () {
    const { simpleStorage } = await loadFixture(
      deploySimpleStorageModuleFixture
    );

    const expectedValue = "7";
    const transactionResponse = await simpleStorage.store(expectedValue);
    await transactionResponse.wait(1);

    const currentValue = await simpleStorage.retrieve();
    assert.equal(currentValue.toString(), expectedValue);
  });

  it("Should work correctly with the people struct and array", async function () {
    const { simpleStorage } = await loadFixture(
      deploySimpleStorageModuleFixture
    );

    const expectedPersonName = "Patrick";
    const expectedFavoriteNumber = 16;
    const transactionResponse = await simpleStorage.addPerson(
      expectedPersonName,
      expectedFavoriteNumber
    );
    await transactionResponse.wait(1);
    const { favoriteNumber, name } = await simpleStorage.people(0);
    // We could also do it like this
    // const person = await simpleStorage.people(0)
    // const favNumber = person.favoriteNumber
    // const pName = person.name

    assert.equal(name, expectedPersonName);
    assert.equal(favoriteNumber, expectedFavoriteNumber);
  });
});
