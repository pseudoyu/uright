pragma solidity >=0.4.21 <0.6.0;

import "./oraclizeAPI.sol";
import "./Evidencable.sol";

contract YouTubeEvidences is usingOraclize {
    string private constant HTML = "html(https://www.youtube.com/watch?v=";
    string private constant XPATH = ").xpath(count(//div[contains(@id,'description')]//a[contains(@href,'";

    mapping(bytes32=>YouTubeEvidence) public evidences;

    struct YouTubeEvidence {
        address registry;
        address evidencer;
        string evidencedId;
        string videoId;
        bool isPending;
        bool isVerified;
    }

    event OraclizeQuery(bytes32 evidenceId);

    event YouTubeEvidenceEvent(bytes32 evidenceId, bytes32 indexed evidencedIdHash,
        string evidencedHash, string videoId, address indexed evidencer, bool isVerified);

    constructor(uint gasPrice) public {
        oraclize_setCustomGasPrice(gasPrice);
    }

    /// @notice Callback for the oracle for query `evidenceId` including the `properLinksCount`
    /// amount of links to the manifestation hash from the YouTube video description.
    /// @param evidenceId The identifier of the oracle query
    /// @param properLinksCount The amount of proper links in the YouTube video description
    function __callback(bytes32 evidenceId, string memory properLinksCount) public {
      require(msg.sender == oraclize_cbAddress());

      processVerification(evidenceId, properLinksCount);
    }

    /// @notice Process the oracle callback for query `evidenceId` to check the `properLinksCount`
    /// amount of links to the manifestation hash from the YouTube video description.
    /// @dev There should be at least one proper link for the YouTubeEvidence to be verified.
    /// @param evidenceId The identifier of the oracle query
    /// @param properLinksCount The amount of proper links in the YouTube video description
    function processVerification(bytes32 evidenceId, string memory properLinksCount) public {
      require(evidences[evidenceId].isPending);

      evidences[evidenceId].isPending = false;
      if (parseInt(properLinksCount) > 0) {
        Evidencable(evidences[evidenceId].registry).addEvidence(evidences[evidenceId].evidencedId);
        evidences[evidenceId].isVerified = true;
      }
      emit YouTubeEvidenceEvent(evidenceId,
          keccak256(abi.encodePacked(evidences[evidenceId].evidencedId)),
          evidences[evidenceId].evidencedId, evidences[evidenceId].videoId,
          evidences[evidenceId].evidencer, evidences[evidenceId].isVerified);
    }

    /// @notice Check using an oracle if the YouTube `videoId` is linked to the manifestation with
    /// identifier `evidencedId` in the registry with address `registry`, optimizing the oracle
    /// call for gas limit `gasLimit`.
    /// @dev The oracle checks if the YouTube page for the video contains a link in its description
    /// pointing to the manifestation hash.
    /// @param registry The address of the contract holding the items receiving evidence
    /// @param evidencedId The identifier used by the registry contract for the item receiving evidence
    /// @param videoId The identifier of a YouTube video to be checked
    /// @param gasLimit The gas limit required by the Oraclize callback __callback(...)
    function check(address registry, string memory evidencedId, string memory videoId, uint gasLimit) public payable {
        require(address(this).balance >= oraclize_getPrice("URL", gasLimit), "Not enough funds to run Oraclize query");

        string memory query = strConcat(HTML, videoId, XPATH, evidencedId, "')]))");
        bytes32 evidenceId = oraclize_query("URL", query, gasLimit);
        evidences[evidenceId] = YouTubeEvidence(registry, msg.sender, evidencedId, videoId, true, false);
        emit OraclizeQuery(evidenceId);
    }

    /// @notice Get the Oraclize call price for the input gas limit `gasLimit`.
    /// @dev Used to show to the user the requested price for the Oraclize call.
    /// @param gasLimit Compute the call price based on the expected gas limit required by the
    /// Oraclize callback, recommended 100M gas as per tests in test/youtubeevidences.test.js
    function getPrice(uint gasLimit) public view returns (uint) {
        return oraclize.getPrice("URL", gasLimit);
    }
}
