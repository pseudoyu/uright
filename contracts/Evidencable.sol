pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/// @title Library to implement items that can accumulate evidence
/// @author Roberto García (http://rhizomik.net/~roberto/)
contract Evidencable is Ownable {
    using SafeMath for uint8;

    mapping(address => bool) private evidenceProviders;
    mapping(string => uint8) private evidenceCounts;

    /// @dev Modifier controlling that only registered evidence providers are allowed
    modifier onlyEvidenceProvider() {
        require(evidenceProviders[msg.sender], "Only registered evidence providers allowed");
        _;
    }

    /// @notice Get the evidence count for the manifestation with `hash`.
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    function getEvidenceCount(string memory hash) public view returns (uint8) {
        return evidenceCounts[hash];
    }

    /// @notice Adds one to the evidence count for the manifestation with `hash`.
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    function addEvidence(string memory hash) public onlyEvidenceProvider {
        evidenceCounts[hash] = uint8(evidenceCounts[hash].add(1));
    }

    /// @notice Adds an evidence provider `provider` contract that can then call addEvidence(...)
    /// to add evidence.
    /// @param provider The address of a contract providing evidence
    function addEvidenceProvider(address provider) public onlyOwner {
        evidenceProviders[provider] = true;
    }

    /// @notice Check if the evidencable `hash` has no evidence yet.
    /// @dev Used to check if the corresponding item evidence count is 0.
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    function isUnevidenced(string memory hash) internal view returns(bool) {
        return (evidenceCounts[hash] == 0);
    }
}
