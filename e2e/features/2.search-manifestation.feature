Feature: Search Manifestation
  In order to check authorship claims on content
  As a user
  I want to search if a piece of content is registered using its hash

  Scenario: Search a piece of content previously registered
    Given I'm on the home page and authenticated
    When I click submenu option "Search" in menu "Manifestations"
    And I fill the search form with content hash "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    Then I see a result with "Title" "Te Hoho Rock"
    And I see a result with "Authors" "0x6273...Ef57"

  Scenario: Search a piece of content not registered
    Given I go to the home page
    When I click submenu option "Search" in menu "Manifestations"
    And I fill the search form with content hash "QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ"
    And I click the "Search" button
    Then I see alert with text "Content hash not found, unregistered"
