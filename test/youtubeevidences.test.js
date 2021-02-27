const YouTubeEvidences = artifacts.require("YouTubeEvidences");
const Manifestations = artifacts.require("Manifestations");
const Proxy = artifacts.require("AdminUpgradeabilityProxy");

const TITLE = "Snow Againg in Mollerussa";
const HASH1 = "QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVJxDj8";
const HASH2 = "QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVJxdJ9";
const HASH3 = "QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVJxdJ0";
const VIDEO_ID1 = "ZwVNLDIJKVA";
const VIDEO_ID2 = "3ANLBcUwizg";
const ORACLIZE_GASLIMIT = 120000; // Based on test for gasEstimate below
const ORACLIZE_GASPRICE = 5000000000; // 5 GWei
const ORACLIZE_TIMEOUT = 60*1000; // 60 seconds

contract("YouTubeEvidences - Check YouTube video ownership", function (accounts) {
  const OWNER = accounts[0];
  const PROXYADMIN = accounts[1];
  const MANIFESTER = accounts[2];

  let evidences, proxy, manifestations, price;

  before("setup contracts for each test", async () => {
    evidences = await YouTubeEvidences.new(ORACLIZE_GASPRICE);
    proxy = await Proxy.deployed();
    manifestations = await Manifestations.at(proxy.address);
    manifestations.addEvidenceProvider(evidences.address);

    await manifestations.manifestAuthorship(HASH1, TITLE, {from: MANIFESTER});
    await manifestations.manifestAuthorship(HASH2, TITLE, {from: MANIFESTER});

    price = await evidences.getPrice(ORACLIZE_GASLIMIT);
    console.log("Oraclize price: " + web3.utils.fromWei(price + "") + " ether");
    console.log("Prefixed gas limit: " + ORACLIZE_GASLIMIT);
    console.log("Custom gas price: " + ORACLIZE_GASPRICE);
  });

  it("should add evidence for YouTube video linked to manifestation", (done) => {
    const indexedEvidenceHash = web3.utils.soliditySha3(HASH1);
    evidences.YouTubeEvidenceEvent(
      {filter: {evidencedIdHash: indexedEvidenceHash}, fromBlock: "latest"})
    .on("data", event => {
      assert.equal(event.args.isVerified, true,
        "YouTube video linked to its manifestation should emit a successful YouTubeEvidenceEvent");
      assert.equal(event.args.evidencedIdHash, web3.utils.soliditySha3(HASH1),
        "unexpected evidence event hash");
      assert.equal(event.args.evidencedHash, HASH1,
        "unexpected evidence event hash");
      assert.equal(event.args.videoId, VIDEO_ID1,
        "unexpected evidence event video id");
      manifestations.getEvidenceCount(HASH1).then(count => {
        assert.equal(count.toNumber(), 1, "Evidence should have been accumulated");
        done();
      });
    });
    evidences.check(manifestations.address, HASH1, VIDEO_ID1, ORACLIZE_GASLIMIT, {value: price});
  }).timeout(ORACLIZE_TIMEOUT);

  it("shouldn't add evidence for YouTube video not linked to manifestation", (done) => {
    const indexedEvidenceHash = web3.utils.soliditySha3(HASH2);
    evidences.YouTubeEvidenceEvent(
      {filter: {evidencedIdHash: indexedEvidenceHash}, fromBlock: "latest"})
    .on("data", event => {
      assert.equal(event.args.isVerified, false,
        "YouTube video not linked to its manifestation should emit an unsuccessful YouTubeEvidenceEvent");
      assert.equal(event.args.evidencedIdHash, web3.utils.soliditySha3(HASH2),
        "unexpected evidence event hash");
      assert.equal(event.args.evidencedHash, HASH2,
        "unexpected evidence event hash");
      assert.equal(event.args.videoId, VIDEO_ID2,
        "unexpected evidence event video id");
      manifestations.getEvidenceCount(HASH2).then(count => {
        assert.equal(count.toNumber(), 0, "Evidence shouldn't have been accumulated");
        done();
      });
    });
    evidences.check(manifestations.address, HASH2, VIDEO_ID2, ORACLIZE_GASLIMIT, {value: price});
  }).timeout(ORACLIZE_TIMEOUT);

  it("shouldn't add evidence if manifestation does not exist", (done) => {
    const indexedEvidenceHash = web3.utils.soliditySha3(HASH3);
    evidences.YouTubeEvidenceEvent(
      {filter: {evidencedIdHash: indexedEvidenceHash}, fromBlock: "latest"})
    .on("data", event => {
      assert.equal(event.args.isVerified, false,
        "Unexisting manifestation should emit an unsuccessful YouTubeEvidenceEvent");
      assert.equal(event.args.evidencedIdHash, web3.utils.soliditySha3(HASH3),
        "unexpected evidence event hash");
      assert.equal(event.args.evidencedHash, HASH3,
        "unexpected evidence event hash");
      assert.equal(event.args.videoId, VIDEO_ID1,
        "unexpected evidence event video id");
      manifestations.getEvidenceCount(HASH3).then(count => {
        assert.equal(count.toNumber(), 0, "Evidence shouldn't have been accumulated");
        done();
      });
    });
    evidences.check(manifestations.address, HASH3, VIDEO_ID1, ORACLIZE_GASLIMIT, {value: price});
  }).timeout(ORACLIZE_TIMEOUT);

  it("shouldn't add evidence if not enough ether for Oraclize call", async () => {
    exception = false;

    try {
      await evidences.check(manifestations.address, HASH1, VIDEO_ID1, ORACLIZE_GASLIMIT, {value: price - 1});
    } catch(e) {
      assert(e.reason, "Not enough funds to run Oraclize query");
      exception = true;
    }

    assert.equal(exception, true,
      "Not providing enough ether for Oraclize call should raise revert exception");
  });

  it("should be able to get a callback gas estimate", async () => {
    let eventEmitted = false;
    await evidences.OraclizeQuery().on("data", event => {
      evidenceId = event.args.evidenceId;
      eventEmitted = true;
    });

    await evidences.check(manifestations.address, HASH1, VIDEO_ID1, ORACLIZE_GASLIMIT, {value: price});

    assert.equal(eventEmitted, true, "Oraclize query event should be emitted");
    const gasEstimate = await evidences.processVerification.estimateGas(evidenceId, "1.0");
    console.log("Gas estimate: " + gasEstimate);
    assert(gasEstimate > 0, "Gas estimate for callback should be higher than 0");
  });
});
