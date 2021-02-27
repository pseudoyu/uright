const Manifestations = artifacts.require('Manifestations');
const Proxy = artifacts.require("AdminUpgradeabilityProxy");

contract('Manifestations - Pausable', function (accounts) {

  const OWNER = accounts[0];
  const ADMIN = accounts[1];
  const MANIFESTER = accounts[2];
  const HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
  const TITLE = "A nice picture";

  let proxy, manifestations;

  beforeEach('setup contracts for each test', async () => {
    proxy = await Proxy.deployed();
    manifestations = await Manifestations.at(proxy.address);
  });

  it("shouldn't work when paused by owner", async () => {
    const receipt = await manifestations.pause({from: OWNER});

    assert.equal(receipt.logs[0].event, 'Paused',
      'should have emitted the Paused event on pause');

    try {
      await manifestations.manifestAuthorship(HASH1, TITLE, {from: MANIFESTER});
    } catch(e) {
      assert(e.message, "Returned error: VM Exception while processing transaction: revert");
    }

    const result = await manifestations.getManifestation(HASH1);

    assert.equal(result[0], '', 'Title should be empty because no registrations while paused');
  });

  it("should work again when unpaused by owner", async () => {
    const receipt = await manifestations.unpause({from: OWNER});

    assert.equal(receipt.logs[0].event, 'Unpaused',
      'should have emitted the Unpaused event on unpause');

    await manifestations.manifestAuthorship(HASH1, TITLE, {from: MANIFESTER});

    const result = await manifestations.getManifestation(HASH1);

    assert.equal(result[0], TITLE, 'Manifestation title should be registered when unpaused');
  });

  it("shouldn't be paused by a non-owner", async () => {
    let failed = false;
    try {
      await manifestations.pause({from: MANIFESTER});
    } catch(e) {
      failed = true;
      assert(e.message, "Returned error: VM Exception while processing transaction: revert");
    }
    assert.equal(failed, true,
      'should have failed because non-owner cannot pause the contract');
  });
});
