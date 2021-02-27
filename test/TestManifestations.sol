pragma solidity 0.5.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Manifestations.sol";


contract TestManifestations {
    Manifestations private manifestations = Manifestations(DeployedAddresses.Manifestations());

    string constant HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
    string constant HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPBDG";
    string constant HASH3 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
    string constant TITLE = "A nice picture";

    // Testing that manifest authorship of single author works
    function testSingleAuthorRegistered() public {
        string memory title;
        address[] memory authors;
        uint256 time;
        uint256 expiry;

        manifestations.manifestAuthorship(HASH1, TITLE);
        (title, authors, time, expiry) = manifestations.getManifestation(HASH1);

        Assert.equal(title, TITLE, "The title of manifestation should match the registered one");
        Assert.equal(authors.length, 1, "There should be just one author");
        Assert.equal(time, now, "Manifest time should be now");
    }

    // Testing that manifest joint authorship with 3 additional authors works
    function testJointAuthorRegistered() public {
        address[] memory ADDITIONAL_AUTHORS = new address[](3);
        ADDITIONAL_AUTHORS[0] = address(0x1);
        ADDITIONAL_AUTHORS[0] = address(0x2);
        ADDITIONAL_AUTHORS[0] = address(0x3);
        string memory title;
        address[] memory authors;
        uint256 time;
        uint256 expiry;

        manifestations.manifestJointAuthorship(HASH2, TITLE, ADDITIONAL_AUTHORS);
        (title, authors, time, expiry) = manifestations.getManifestation(HASH2);

        Assert.equal(title, TITLE, "The title of manifestation should match the registered one");
        Assert.equal(authors.length, 4, "There should 4 authors");
        Assert.equal(authors[1], ADDITIONAL_AUTHORS[0], "Second author should be the expected one");
        Assert.equal(authors[2], ADDITIONAL_AUTHORS[1], "Third author should be the expected one");
        Assert.equal(authors[3], ADDITIONAL_AUTHORS[2], "Fourth author should be the expected one");
        Assert.equal(time, now, "Manifest time should be now");
    }

    // Testing that manifest joint authorship with 0 additional authors works
    function testSingleAuthorThroughJointAuthorRegistered() public {
        address[] memory ADDITIONAL_AUTHORS = new address[](0);
        string memory title;
        address[] memory authors;
        uint256 time;
        uint256 expiry;

        manifestations.manifestJointAuthorship(HASH3, TITLE, ADDITIONAL_AUTHORS);
        (title, authors, time, expiry) = manifestations.getManifestation(HASH3);

        Assert.equal(title, TITLE, "The title of manifestation should match the registered one");
        Assert.equal(authors.length, 1, "There should 4 authors");
        Assert.equal(time, now, "Manifest time should be now");
    }

    function testThrowFunctions() public {
      bool r;
      (r, ) = address(this).call(abi.encodePacked(this.alreadyRegistered.selector));
      Assert.isFalse(r, "Should be false, as it should be reverted if already registered");
    }

    // Testing that trying to re-register content fails
    function alreadyRegistered() public {
        manifestations.manifestAuthorship(HASH1, TITLE);
    }
}
