pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "zos-lib/contracts/Initializable.sol";
import "zos-lib/contracts/upgradeability/AdminUpgradeabilityProxy.sol";
import "./ExpirableLib.sol";
import "./Evidencable.sol";

/// @title Contract for copyright authorship registration through creations manifestations
/// @author Roberto García (http://rhizomik.net/~roberto/)
contract Manifestations is Pausable, Initializable, Evidencable {

    using ExpirableLib for ExpirableLib.TimeAndExpiry;

    struct Manifestation {
        string title;
        address[] authors;
        ExpirableLib.TimeAndExpiry time;
    }

    uint32 public timeToExpiry;
    mapping(string => Manifestation) private manifestations;

    event ManifestEvent(string hash, string title, address indexed manifester);
    event AddedEvidence(uint8 evidenceCount);

    constructor(uint32 _timeToExpiry) public {
        timeToExpiry = _timeToExpiry;
    }

    /// @dev To be used when proxied (upgradeability) to initialize proxy storage
    function initialize(uint32 _timeToExpiry) public initializer {
        _addPauser(msg.sender);
        _transferOwnership(msg.sender);
        timeToExpiry = _timeToExpiry;
    }

    /// @dev Modifier implementing the common logic for single and joint authorship.
    /// Checks title and that hash not registered or expired. Then stores title and sets expiry.
    /// Finally, emits ManifestEvent
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    /// @param title The title of the manifestation
    modifier registerIfAvailable(string memory hash, string memory title) {
        require(bytes(title).length > 0, "A title is required");
        require(manifestations[hash].authors.length == 0 ||
                (manifestations[hash].time.isExpired() && isUnevidenced(hash)),
            "Already registered and not expired or with evidence");
        _;
        manifestations[hash].title = title;
        manifestations[hash].time.setExpiry(timeToExpiry);
        emit ManifestEvent(hash, title, msg.sender);
    }

    /// @notice Register single authorship for `msg.sender` of the manifestation with title `title`
    /// and hash `hash`. Requires hash not previously registered or expired.
    /// @dev To be used when there is just one author, which is considered to be the message sender
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    /// @param title The title of the manifestation
    function manifestAuthorship(string memory hash, string memory title)
    public registerIfAvailable(hash, title) whenNotPaused() {
        address[] memory authors = new address[](1);
        authors[0] = msg.sender;
        manifestations[hash].authors = authors;
    }

    /// @notice Register joint authorship for `msg.sender` plus additional authors
    /// `additionalAuthors` of the manifestation with title `title` and hash `hash`.
    /// Requires hash not previously registered or expired and at most 64 authors,
    /// including the one registering.
    /// @dev To be used when there are multiple authors
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    /// @param title The title of the manifestation
    /// @param additionalAuthors The additional authors,
    /// including the one registering that becomes the first author
    function manifestJointAuthorship(string memory hash, string memory title, address[] memory additionalAuthors)
    public registerIfAvailable(hash, title) whenNotPaused() {
        require(additionalAuthors.length < 64, "Joint authorship limited to 64 authors");
        address[] memory authors = new address[](additionalAuthors.length + 1);
        authors[0] = msg.sender;
        for (uint8 i = 0; i < additionalAuthors.length; i++)
            authors[i+1] = additionalAuthors[i];
        manifestations[hash].authors = authors;
    }

    /// @notice Retrieve the title and authors of the manifestation with content hash `hash`.
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    /// @return The title and authors of the manifestation
    function getManifestation(string memory hash) public view
    returns (string memory, address[] memory, uint256, uint256) {
        return (manifestations[hash].title,
                manifestations[hash].authors,
                manifestations[hash].time.creationTime,
                manifestations[hash].time.expiryTime);
    }

    /// @notice Adds an evidence if there is already a manifestation for `hash`.
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    function addEvidence(string memory hash) public {
        require(bytes(manifestations[hash].title).length > 0, "The manifestation evidenced should exist");
        super.addEvidence(hash);
    }
}
