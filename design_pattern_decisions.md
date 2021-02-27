## Design Pattern Decisions

The project implements a "Circuit Breaker / Emergency Stop" for the *Manifestations* contract using OpenZeppelin *Pausable* contract, 
[https://openzeppelin.org/api/docs/lifecycle_Pausable.html]()

This pattern is tested in [manifestations.test.js](test/manifestations_pausable.test.js)

Moreover, a pattern similar to "Automatic Deprecation" has been implemented for the registered manifestations. This way, if a
user registers manifestations but does not provide evidence, the manifestations expire after a given amount of time fixed during
deployment o the *Manifestations* contract. Expiration in this case means that the manifestation can be overwritten by another user.

This pattern is implemented as a library in [ExpirableLib](contracts/ExpirableLib.sol), to facilitate its reuse. 
It has been tested in [manifestations_expirable.test.js](test/manifestations_expirable.test.js)

Overall, the contracts have been designed favouring modularity and reusability. Thus, the previous expiration functionality has been
implemented as a Solidity Library. There is also the "evidencable" functionality, that makes a item capable of accumulating evidence
supporting it, that has been implemented using a Solidity contract [Evidencable](contracts/Evidencable.sol). This facilitates
making manifestations capable of accumulating evidence supporting them, but also reusing this same behaviour for complaints. Moreover,
making this functionality available as a library reduces deployment costs.

### Architecture Overview

The overview show the developed contracts and libs in light green and the reused ones in grey. 
The arrows with hollow heads mark the contracts extended by the source contract.
The arrows with small heads point from caller contracts to called contracts or libraries. 

![Entities Model Diagram](http://www.plantuml.com/plantuml/svg/3SmnZiGW30NGFgV8NW3tK-KgZ6C14c3q-TOejzzqhthNPWPZzEElJUrnMw2VbLpx8uByIwMnnZUsGNtI9fFw47Z9A3v5VJrefR8_gRcCl6cG3AsDfWnOMcz_7fVD-yK_)
