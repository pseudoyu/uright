const Evidences = artifacts.require("UploadEvidences");
const Manifestations = artifacts.require("Manifestations");
const Proxy = artifacts.require("AdminUpgradeabilityProxy");

contract("UploadEvidences - Manifestations accumulate evidence", function (accounts) {

  const OWNER = accounts[0];
  const NOT_OWNER = accounts[1];
  const MANIFESTER = accounts[2];
  const HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const TITLE1 = "A nice picture";
  const HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
  const TITLE2 = "Unmanifested picture";
  const HASH3 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPBDG";
  const EVIDENCE_HASH1 = "QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVJxDj8";
  const EVIDENCE_HASH2 = "QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVjXdJ8";

  let evidences, proxy, manifestations, registry, evidencedIdHash, evidencedHash,
    evidenceHash, evidencer;

  beforeEach("setup contracts for each test", async () => {
    proxy = await Proxy.deployed();
    manifestations = await Manifestations.at(proxy.address);
    evidences = await Evidences.deployed();
    manifestations.addEvidenceProvider(evidences.address);
  });

  it("should add evidence if registered evidence provider", async () => {
    await manifestations.manifestAuthorship(HASH1, TITLE1, {from: MANIFESTER});
    let eventEmitted = false;
    const indexedEvidenceHash = web3.utils.soliditySha3(HASH1);
    await evidences.UploadEvidenceEvent({
      filter: { evidencedIdHash: indexedEvidenceHash },
      fromBlock: 0 }, (error, event) => {
        registry = event.args.registry;
        evidencedIdHash = event.args.evidencedIdHash;
        evidencedHash = event.args.evidencedHash;
        evidenceHash = event.args.evidenceHash;
        evidencer = event.args.evidencer;
        eventEmitted = true;
    });

    await evidences.addEvidence(
      manifestations.address, HASH1, EVIDENCE_HASH1, {from: MANIFESTER});
    const evidenceCount = await manifestations.getEvidenceCount(HASH1);

    assert.equal(evidenceCount, 1,
        "the manifestation should accumulate 1 evidence");
    assert.equal(eventEmitted, true,
        "adding an upload evidence should emit an UploadEvidenceEvent");
    assert.equal(registry, manifestations.address,
        "the contract receiving the evidence should be the manifestations");
    assert.equal(evidencedIdHash, web3.utils.soliditySha3(HASH1),
        "the manifestation receiving the evidence should be the manifested one");
    assert.equal(evidencedHash, HASH1,
      "the manifestation receiving the evidence should be the manifested one");
    assert.equal(evidenceHash, EVIDENCE_HASH1,
        "the hash of the evidence should be the registered one");
    assert.equal(evidencer, MANIFESTER,
        "the account providing the evidence should be the same than the manifester");
  });

  it("should add multiple evidence for the same manifestation", async () => {
    let eventEmitted = false;
    const indexedEvidenceHash = web3.utils.soliditySha3(HASH1);
    await evidences.UploadEvidenceEvent({
      filter: { evidencedIdHash: indexedEvidenceHash },
      fromBlock: 0 }, (error, event) => {
      registry = event.args.registry;
      evidencedIdHash = event.args.evidencedIdHash;
      evidencedHash = event.args.evidencedHash;
      evidenceHash = event.args.evidenceHash;
      evidencer = event.args.evidencer;
      eventEmitted = true;
    });

    await evidences.addEvidence(
      manifestations.address, HASH1, EVIDENCE_HASH2, {from: MANIFESTER});
    const evidenceCount = await manifestations.getEvidenceCount(HASH1);

    assert.equal(evidenceCount, 2,
      "The manifestation should accumulate 2 evidence");
    assert.equal(eventEmitted, true,
      "adding an upload evidence should emit an UploadEvidenceEvent");
    assert.equal(registry, manifestations.address,
      "the contract receiving the evidence should be the manifestations");
    assert.equal(evidencedIdHash, web3.utils.sha3(HASH1),
      "the manifestation receiving the evidence should be the manifested one");
    assert.equal(evidenceHash, EVIDENCE_HASH2,
      "the hash of the evidence should be the registered one");
    assert.equal(evidencer, MANIFESTER,
      "the account providing the evidence should be the same than the manifester");
  });

  it("shouldn't add the same evidence for the same manifestation", async () => {
    let failed = false;
    try {
      await evidences.addEvidence(manifestations.address, HASH1, EVIDENCE_HASH1, {from: MANIFESTER});
    } catch(e) {
      failed = true;
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    const evidenceCount = await manifestations.getEvidenceCount(HASH1);

    assert.equal(evidenceCount, 2,
      "The manifestation should accumulate repeated evidences");
    assert.equal(failed, true,
      "Registering the same evidence should fail");
  });

  it("shouldn't add the same evidence for a different manifestation", async () => {
    let failed = false;
    await manifestations.manifestAuthorship(HASH2, TITLE2, {from: MANIFESTER});
    try {
      await evidences.addEvidence(manifestations.address, HASH2, EVIDENCE_HASH1, {from: MANIFESTER});
    } catch(e) {
      failed = true;
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    const evidenceCount = await manifestations.getEvidenceCount(HASH2);

    assert.equal(evidenceCount, 0,
      "The manifestation should accumulate 1 evidence");
    assert.equal(failed, true,
      "Should fail if reusing evidence for a different manifestation");
  });

  it("shouldn't add evidence if not a registered evidence provider", async () => {
    const unregisteredEvidences = await Evidences.new();
    let failed = false;

    try {
      await unregisteredEvidences.addEvidence(manifestations.address, HASH1, EVIDENCE_HASH1, {from: MANIFESTER});
    } catch(e) {
      failed = true;
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    const evidenceCount = await manifestations.getEvidenceCount(HASH1);

    assert.equal(evidenceCount, 2,
      "The manifestation should not accumulate evidence from unregistered evidence provider");
    assert.equal(failed, true,
      "Should fail if evidence comming from unregistered evidence provider");
  });

  it("shouldn't add evidence if the manifestation does not exists", async () => {
    const evidences = await Evidences.new();
    manifestations.addEvidenceProvider(evidences.address);
    let failed = false;

    try {
      await evidences.addEvidence(manifestations.address, HASH3, EVIDENCE_HASH1, {from: MANIFESTER});
    } catch(e) {
      failed = true;
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    const evidenceCount = await manifestations.getEvidenceCount(HASH3);

    assert.equal(evidenceCount, 0,
      "An unexisting manifestation should not accumulate evidence");
    assert.equal(failed, true,
      "Should fail if evidence for unexisting manifestation");
  });

  it("should be enforced that just the owner registers evidence providers", async () => {
    const unregisteredEvidences = await Evidences.new();
    let failed = false;
    try {
      await manifestations.addEvidenceProvider(unregisteredEvidences.address, {from: NOT_OWNER});
    } catch(e) {
      failed = true;
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }
    assert.equal(failed, true,
      "Should fail if non-owner tries to register and evidence provider");

    const evidenceCount = await manifestations.getEvidenceCount(HASH1);
    await manifestations.addEvidenceProvider(unregisteredEvidences.address, {from: OWNER});
    await unregisteredEvidences.addEvidence(manifestations.address, HASH1, EVIDENCE_HASH1, {from: MANIFESTER});
    const newEvidenceCount = await manifestations.getEvidenceCount(HASH1);

    assert.equal(newEvidenceCount, evidenceCount.toNumber() + 1,
      "The new UploadEvidences contract should allow adding evidences once registered by owner");
  });
});
