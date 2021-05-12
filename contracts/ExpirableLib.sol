pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";


/// @title 用于实现过期作品的库
/// @author Yu Zhang
library ExpirableLib {
    /// @dev SafeMath库用于避免整数上溢和下溢问题
    using SafeMath for uint;

    struct TimeAndExpiry {
        uint256 creationTime;
        uint256 expiryTime;
    }

    /// @notice 用于检查是否到达过期时间
    /// @dev 用于检查是否设置了过期时间以及是否已经过期
    /// @param self TimeAndExpiry struct
    function isExpired(TimeAndExpiry storage self) internal view returns(bool) {
        return (self.expiryTime > 0 && self.expiryTime < now);
    }

    /// @notice 设置过期时间为现在时间加持续时长
    /// @dev 调用方法设置TimeAndExpiry struct中的创建时间与过期时间
    /// @param self TimeAndExpiry struct
    /// @param duration 从当前到过期的持续时间
    function setExpiry(TimeAndExpiry storage self, uint256 duration) internal {
        self.creationTime = now;
        self.expiryTime = now.add(duration);
    }
}