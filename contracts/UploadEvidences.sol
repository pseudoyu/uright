pragma solidity >=0.4.21 <0.6.0;

import "./Evidencable.sol";

/// @title Contract to register evidence based on uploading content to IPFS
/// @author Roberto García (http://rhizomik.net/~roberto/)
contract UploadEvidences {

    /// @notice Allows checking if some content has already been used as evidence.
    mapping(string => bool) private existingEvidence;

    event UploadEvidenceEvent(address indexed registry, bytes32 indexed evidencedIdHash,
        string evidencedHash, string evidenceHash, address indexed evidencer);

    /// @notice Get if the evidence with content hash `evidenceHash` is already registered.
    /// @param evidenceHash Hash of the evidence content, for instance IPFS Base58 Hash
    function getEvidenceExistence(string memory evidenceHash) public view returns (bool) {
        return existingEvidence[evidenceHash];
    }

    /// @notice Add evidence for item in `registry` identified by `evidencedHash`. The evidence
    /// has `evidenceHash` and is registered by `msg.sender`.
    /// @dev The address of the registry containing the evidenced item is required to update
    /// its evidence count. Evidence is stored just in the log as UploadEvidenceEvent events.
    /// Note: the evidenceHash is hashed using keccak256 before emitting the event so it can be indexed.
    /// @param registry The address of the contract holding the items evidenced
    /// @param evidencedHash Hash used by the registry contract to identify the item receiving evidence
    /// @param evidenceHash Hash of the uploaded content to be used as evidence, for instance IPFS Base58 Hash
    function addEvidence(address registry, string memory evidencedHash, string memory evidenceHash) public {
        require(!existingEvidence[evidenceHash], "The evidence has been already registered");
        Evidencable(registry).addEvidence(evidencedHash);
        existingEvidence[evidenceHash] = true;
        emit UploadEvidenceEvent(registry, keccak256(abi.encodePacked(evidencedHash)),
            evidencedHash, evidenceHash, msg.sender);
    }
}
