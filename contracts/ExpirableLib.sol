pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";


/// @title Library to implement expirable items
/// @author Roberto García (http://rhizomik.net/~roberto/)
library ExpirableLib {
    using SafeMath for uint;

    struct TimeAndExpiry {
        uint256 creationTime;
        uint256 expiryTime;
    }

    /// @notice Check if `self` TimeAndExpiry struct expiry time has arrived.
    /// @dev This method checks if there is a expiry time and if it is expired.
    /// @param self TimeAndExpiry struct
    function isExpired(TimeAndExpiry storage self) internal view returns(bool) {
        return (self.expiryTime > 0 && self.expiryTime < now);
    }

    /// @notice Set expiry time for `self` TimeAndExpiry struct to now plus `duration`.
    /// @dev Call this method to set the creationTime and expiryTime in the TimeAndExpiry struct.
    /// @param self TimeAndExpiry struct
    /// @param duration Time from current time till expiry
    function setExpiry(TimeAndExpiry storage self, uint256 duration) internal {
        self.creationTime = now;
        self.expiryTime = now.add(duration);
    }
}
