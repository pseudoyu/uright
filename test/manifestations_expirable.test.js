const Manifestations = artifacts.require('Manifestations');
const Proxy = artifacts.require("AdminUpgradeabilityProxy");
const UploadEvidences = artifacts.require("./UploadEvidences.sol");
const assert = require('assert');

contract('Manifestations - Expirable', function (accounts) {

  const OWNER = accounts[0];
  const PROXYADMIN = accounts[1];
  const MANIFESTER1 = accounts[2];
  const MANIFESTER2 = accounts[3];
  const HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
  const EVIDENCE_HASH = "QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVJxDj8";
  const TITLE_OLD = "A nice picture";
  const TITLE_NEW = "My nice picture";
  const timeToExpiry = 2; // Expiry 2 seconds

  let manifestations, shortExpiryManifestations, newProxy;

  beforeEach('setup specific contracts for this test with short expiry', async () => {
    shortExpiryManifestations = await Manifestations.new(timeToExpiry);
    newProxy = await Proxy.new(shortExpiryManifestations.address, PROXYADMIN, []);
    manifestations = await Manifestations.at(newProxy.address);
    manifestations.initialize(timeToExpiry);
  });

  it("should re-register just when already expired", async () => {
    await manifestations.manifestAuthorship(HASH1, TITLE_OLD, {from: MANIFESTER1});

    let result = await manifestations.getManifestation(HASH1);

    assert.equal(result[0], TITLE_OLD,
      'unexpected manifestation title');
    assert.equal(result[1][0], MANIFESTER1,
      'unexpected first author in manifestation authors');

    await sleep(1*1000);

    try {
      await manifestations.manifestAuthorship(HASH1, TITLE_NEW, {from: MANIFESTER2});
    } catch(e) {
      assert(e.reason, "Already registered and not expired or with evidence");
    }

    result = await manifestations.getManifestation(HASH1);
    const oldTimestamp = result[2];

    assert.equal(result[0], TITLE_OLD,
      'unexpected manifestation title');
    assert.equal(result[1][0], MANIFESTER1,
      'unexpected first author in manifestation authors');

    await sleep(2*1000);

    await manifestations.manifestAuthorship(HASH1, TITLE_NEW, {from: MANIFESTER2});

    result = await manifestations.getManifestation(HASH1);

    assert.equal(result[0], TITLE_NEW,
      'unexpected manifestation title');
    assert.equal(result[1][0], MANIFESTER2,
      'unexpected first author in manifestation authors');
    assert(result[2] > oldTimestamp + timeToExpiry,
      'manifestation time not properly updated');
  });

  it("shouldn't expire if manifestation with evidence", async () => {
    const evidences = await UploadEvidences.deployed();
    manifestations.addEvidenceProvider(evidences.address);

    await manifestations.manifestAuthorship(HASH2, TITLE_OLD, {from: MANIFESTER1});

    await evidences.addEvidence(manifestations.address, HASH2, EVIDENCE_HASH);

    await sleep(3*1000);

    try {
      await manifestations.manifestAuthorship(HASH2, TITLE_NEW, {from: MANIFESTER2});
    } catch(e) {
      assert(e.message, "Already registered and not expired or with evidence");
    }

    result = await manifestations.getManifestation(HASH2);

    assert.equal(result[0], TITLE_OLD,
      'unexpected manifestation title');
    assert.equal(result[1][0], MANIFESTER1,
      'unexpected first author in manifestation authors');
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
