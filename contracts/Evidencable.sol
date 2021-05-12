pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/// @title 用于实现支持证据上传功能的库
/// @author Yu Zhang
contract Evidencable is Ownable {
    /// @dev SafeMath库用于避免整数上溢和下溢问题
    using SafeMath for uint8;

    mapping(address => bool) private evidenceProviders;
    mapping(string => uint8) private evidenceCounts;

    /// @dev 函数修改器用于对函数调用者进行限制，只允许以注册证据的提供者可以进行调用
    modifier onlyEvidenceProvider() {
        require(evidenceProviders[msg.sender], "只允许已注册的证据提供者调用");
        _;
    }

    /// @notice 获取特定作品（哈希值）的证据计数
    /// @param hash 作品内容哈希值，如IPFS的Base58哈希
    function getEvidenceCount(string memory hash) public view returns (uint8) {
        return evidenceCounts[hash];
    }

    /// @notice 对特定作品（哈希值）添加一个证据计数
    /// @param hash 作品内容哈希值，如IPFS的Base58哈希
    function addEvidence(string memory hash) public onlyEvidenceProvider {
        evidenceCounts[hash] = uint8(evidenceCounts[hash].add(1));
    }

    /// @notice 添加一个证据提供者，可调用addEvidence(...)方法
    /// @param provider 提供证据的地址
    function addEvidenceProvider(address provider) public onlyOwner {
        evidenceProviders[provider] = true;
    }

    /// @notice 检查特定作品（哈希值）是否已有注册证据
    /// @dev 用于检查作品相应证据计数是否为0
    /// @param hash 作品内容哈希值，如IPFS的Base58哈希
    function isUnevidenced(string memory hash) internal view returns(bool) {
        return (evidenceCounts[hash] == 0);
    }
}
