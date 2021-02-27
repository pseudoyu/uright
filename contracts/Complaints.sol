pragma solidity >=0.4.21 <0.6.0;

/// @title Contract for copyright authorship complaints registration
/// @author Roberto García (http://rhizomik.net/~roberto/)
contract Complaints {

    struct Complaint {
        address complainer;
        string complaintHash;
        bool active;
    }

    address private owner;
    address private manifestations;
    mapping(string => Complaint) private complaints;

    event ComplaintEvent(address indexed complainer, string complaintHash, string indexed manifestationHashed);
    event RevokeComplaintEvent(address indexed complainer, string complaintHash, string indexed manifestationHashed);

    constructor(address _manifestations) public {
        owner = msg.sender;
        manifestations = _manifestations;
    }

    /// @notice Retrieve the IPFS hash of the complaint content for the input manifestation
    function getComplaintHash(string memory manifestationHash) public view returns (string memory) {
        require(complaints[manifestationHash].active, "No active complaint for manifestation hash");
        return (complaints[manifestationHash].complaintHash);
    }

    /// @notice Retrieve the account that made the complaint for the input manifestation hash
    function getComplainer(string memory manifestationHash) public view returns (address) {
        require(complaints[manifestationHash].active, "No active complaint for manifestation hash");
        return (complaints[manifestationHash].complainer);
    }

    /// @notice Register a complaint using the IPFS hash of the complaint content and the hash
    /// identifying the manifestation complainted. Just one unexpired complaint for the same
    /// manifestation hash allowed
    function makeComplaint(string memory complaintHash, string memory manifestationHash) public {
        require(!complaints[manifestationHash].active, "Complaint for manifestation hash already registered");
        complaints[manifestationHash].complainer = msg.sender;
        complaints[manifestationHash].complaintHash = complaintHash;
        complaints[manifestationHash].active = true;
        emit ComplaintEvent(msg.sender, complaintHash, manifestationHash);
    }

    /// @notice Remove the complaint for the input manifestation
    /// @dev Just the contract owner can remove complaints
    function revokeComplaint(string memory manifestationHash) public {
        require(owner == msg.sender, "Just contract owner can revoke complaints");
        complaints[manifestationHash].active = false;
        emit RevokeComplaintEvent(complaints[manifestationHash].complainer,
            complaints[manifestationHash].complaintHash, manifestationHash);
    }
}
