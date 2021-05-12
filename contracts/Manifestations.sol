pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "zos-lib/contracts/Initializable.sol";
import "zos-lib/contracts/upgradeability/AdminUpgradeabilityProxy.sol";
import "./ExpirableLib.sol";
import "./Evidencable.sol";

/// @title 用于实现音乐版权注册功能的合约
/// @author Yu Zhang

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

    /// @dev 初始化代理（可升级性）存储
    function initialize(uint32 _timeToExpiry) public initializer {
        _addPauser(msg.sender);
        _transferOwnership(msg.sender);
        timeToExpiry = _timeToExpiry;
    }

    /// @dev 函数修改器用于实现音乐人（或联合创作者）的公共逻辑
    /// 检查音乐作品标题及哈希值未注册、未过期
    /// 存储标题，设置过期时间
    /// 触发ManifestEvent事件
    /// @param hash 作品内容哈希值，如IPFS的Base58哈希
    /// @param title 音乐作品标题
    modifier registerIfAvailable(string memory hash, string memory title) {
        require(bytes(title).length > 0, "请填写音乐作品标题");
        require(manifestations[hash].authors.length == 0 ||
                (manifestations[hash].time.isExpired() && isUnevidenced(hash)),
            "音乐作品已注册且未过期（已上传支持证据）");
        _;
        manifestations[hash].title = title;
        manifestations[hash].time.setExpiry(timeToExpiry);
        emit ManifestEvent(hash, title, msg.sender);
    }

    /// @notice 注册作品音乐人为`msg.sender`，作品标题为 `title`，哈希值为`hash`
    /// 要求此哈希值未被注册或已经过期
    /// @dev 当作品仅有一个音乐人时调用，注册作品音乐人为`msg.sender`
    /// @param hash 作品内容哈希值，如IPFS的Base58哈希
    /// @param title 作品标题
    function manifestAuthorship(string memory hash, string memory title)
    public registerIfAvailable(hash, title) whenNotPaused() {
        address[] memory authors = new address[](1);
        authors[0] = msg.sender;
        manifestations[hash].authors = authors;
    }

    /// @notice 注册作品音乐人为`msg.sender`以及额外创作者为`additionalAuthors`
    /// 作品标题为 `title`，哈希值为`hash`，要求此哈希值未被注册或已经过期，且最多64个作者（含注册者）
    /// @dev 当作品有多个创作者时调用
    /// @param hash 作品内容哈希值，如IPFS的Base58哈希
    /// @param title 作品标题
    /// @param additionalAuthors 联合创作者（含注册者）
    function manifestJointAuthorship(string memory hash, string memory title, address[] memory additionalAuthors)
    public registerIfAvailable(hash, title) whenNotPaused() {
        require(additionalAuthors.length < 64, "联合创作者最多为64名");
        address[] memory authors = new address[](additionalAuthors.length + 1);
        authors[0] = msg.sender;
        for (uint8 i = 0; i < additionalAuthors.length; i++)
            authors[i+1] = additionalAuthors[i];
        manifestations[hash].authors = authors;
    }

    /// @notice 通过音乐作品哈希值来获取标题和作者
    /// @param hash 作品内容哈希值，如IPFS的Base58哈希
    /// @return 作品标题与创作者
    function getManifestation(string memory hash) public view
    returns (string memory, address[] memory, uint256, uint256) {
        return (manifestations[hash].title,
                manifestations[hash].authors,
                manifestations[hash].time.creationTime,
                manifestations[hash].time.expiryTime);
    }

    /// @notice 如果作品已注册，添加一个支持证据
    /// @param hash 作品内容哈希值，如IPFS的Base58哈希
    function addEvidence(string memory hash) public {
        require(bytes(manifestations[hash].title).length > 0, "The manifestation evidenced should exist");
        super.addEvidence(hash);
    }
}
