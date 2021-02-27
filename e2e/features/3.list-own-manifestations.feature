Feature: List Own Manifestations
  In order to keep track of ownership claims
  As a creator
  I want to list all the manifestation I have registered so far

  Scenario: List own manifestations when I have one
    Given I'm on the home page and authenticated
    When I click submenu option "List Own" in menu "Manifestations"
    Then I see 1 result
    And I see a result with "Title" "Te Hoho Rock"
    And I see a result with "Registerer" "0x6273...Ef57"
