## Avoiding Common Attacks

All contracts have been verified using both Remix and the [Solhint](https://github.com/protofire/solhint) tool for
Solidity code linting. Both tools check for common security issues like Reentrancy or Timestamp Dependence. No Reentrancy
issue is identified by any of these tools, neither after visual inspection of the code. There is a Timestamp Dependence
warning regarding the ExpirableLib library as timestamps are used to check expiry conditions. However, this is not an issue
as the intended expiry period is going to be long enough to avoid this issue, currently set to one day.

Regarding Integer Overflow and Underflow, the OpenZeppelin [SafeMath](https://openzeppelin.org/api/docs/math_SafeMath.html) 
library has been used to avoid this kind of issues.

Finally, Solhint has been set as one of the steps in the Continuous Integration and Deployment workflow defined in 
[.travis.yml](.travis.yml). This way, each time code is pushed to GitHub, Travis runs all tests (for both the contracts and
the Angular frontend) and takes care of the deployment if all tests pass. 
Moreover, the [Solhint](https://github.com/protofire/solhint) tool is also executed before the tests and it helps tracking 
any security issue that might appear.
