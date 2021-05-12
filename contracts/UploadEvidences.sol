pragma solidity >=0.4.21 <0.6.0;

import "./Evidencable.sol";

/// @title 用于实现证据上传功能的合约（基于上传至IPFS网络）
/// @author Yu Zhang
contract UploadEvidences {

    /// @notice 用于检查该内容是否已被用作证据
    mapping(string => bool) private existingEvidence;

    event UploadEvidenceEvent(address indexed registry, bytes32 indexed evidencedIdHash,
        string evidencedHash, string evidenceHash, address indexed evidencer);

    /// @notice 如果证据已被注册，返回
    /// @param evidenceHash 作品支持证据哈希值，如IPFS的Base58哈希
    function getEvidenceExistence(string memory evidenceHash) public view returns (bool) {
        return existingEvidence[evidenceHash];
    }

    /// @notice 添加支持证据，证据哈希值为`evidenceHash`，注册者为`msg.sender`
    /// @dev 更新包含此作品的证据计数
    /// 证据作为事件存在于日志中
    /// 注：evidenceHash在触发事件前用keccak256进行哈希化，所以可被索引
    /// @param registry 证据提供者的地址
    /// @param evidencedHash 已注册证据的哈希值
    /// @param evidenceHash 作品支持证据哈希值，如IPFS的Base58哈希
    function addEvidence(address registry, string memory evidencedHash, string memory evidenceHash) public {
        require(!existingEvidence[evidenceHash], "The evidence has been already registered");
        Evidencable(registry).addEvidence(evidencedHash);
        existingEvidence[evidenceHash] = true;
        emit UploadEvidenceEvent(registry, keccak256(abi.encodePacked(evidencedHash)),
            evidencedHash, evidenceHash, msg.sender);
    }
}
