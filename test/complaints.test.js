const Manifestations = artifacts.require('Manifestations');
const Proxy = artifacts.require("AdminUpgradeabilityProxy");
const Complaints = artifacts.require("./Complaints.sol");

contract('Complaints - Register complaints', function (accounts) {

  const OWNER = accounts[0];
  const PROXYADMIN = accounts[1];
  const MANIFESTER = accounts[2];
  const COMPLAINER = accounts[3];
  const HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const TITLE1 = "A nice picture";
  const HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
  const TITLE2 = "Unmanifested picture";
  const COMPLAINT_HASH1 = web3.utils.randomHex(46);
  const COMPLAINT_HASH2 = web3.utils.randomHex(46);

  let proxy, manifestations, complaints, complainer, complaintHash, manifestationHashed;

  beforeEach('setup contracts for each test', async () => {
    proxy = await Proxy.deployed();
    manifestations = await Manifestations.at(proxy.address);
    complaints = await Complaints.deployed();
  });

  it("should register a new complaint", async () => {
    await manifestations.manifestAuthorship(HASH1, TITLE1, {from: MANIFESTER});
    let eventEmitted = false;
    await complaints.ComplaintEvent().on('data', result => {
      complainer = result.args.complainer;
      complaintHash = result.args.complaintHash;
      manifestationHashed = result.args.manifestationHashed;
      eventEmitted = true;
    });

    await complaints.makeComplaint(COMPLAINT_HASH1, HASH1, {from: COMPLAINER});

    assert.equal(eventEmitted, true,
        'a proper complaint should emit a ComplaintEvent');
    assert.equal(manifestationHashed, web3.utils.sha3(HASH1),
        'unexpected manifestation hashed');
    assert.equal(complaintHash, COMPLAINT_HASH1,
        'unexpected complaint hash');
    assert.equal(complainer, COMPLAINER,
        'unexpected complainer');
  });

  it("shouldn't register a complaint if already one for manifestation", async () => {
    let eventEmitted = false;
    await complaints.ComplaintEvent().on('data', result => {
      eventEmitted = true;
    });

    try {
      await complaints.makeComplaint(COMPLAINT_HASH2, HASH1, {from: COMPLAINER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
      'a repeated complaint should not emit a ComplaintEvent');
  });

  it("shouldn't allow to revoke complaint if not contract owner", async () => {
    let eventEmitted = false;
    await complaints.ComplaintEvent().on('data', result => {
      eventEmitted = true;
    });

    try {
      await complaints.revokeComplaint(HASH1, {from: COMPLAINER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
      'non-owner revoke should not emit a ComplaintEvent');
  });

  it("should retrieve an existing complaint", async () => {

    const complaintHash = await complaints.getComplaintHash(HASH1, {from: COMPLAINER});

    assert.equal(complaintHash, COMPLAINT_HASH1,
      'unexpected complaint hash');
  });

  it("should allow to revoke complaint if contract owner", async () => {
    let eventEmitted = false;
    await complaints.RevokeComplaintEvent().on('data', result => {
      complainer = result.args.complainer;
      complaintHash = result.args.complaintHash;
      manifestationHashed = result.args.manifestationHashed;
      eventEmitted = true;
    });

    await complaints.revokeComplaint(HASH1, {from: OWNER});

    assert.equal(eventEmitted, true,
      'owner revoke should emit a RevokeComplaintEvent');
    assert.equal(manifestationHashed, web3.utils.soliditySha3(HASH1),
      'unexpected manifestation hashed');
    assert.equal(complaintHash, COMPLAINT_HASH1,
      'unexpected complaint hash');
    assert.equal(complainer, COMPLAINER,
      'unexpected complainer');
  });

  it("shouldn't allow retrieving a revoked complaint", async () => {

    try {
      await complaints.getComplaintHash(HASH1, {from: COMPLAINER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }
  });

  it("shouldn't allow retrieving an unexisting complaint", async () => {

    try {
      await complaints.getComplaintHash(HASH2, {from: COMPLAINER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }
  });
});
