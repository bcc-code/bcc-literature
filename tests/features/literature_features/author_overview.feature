Feature: Open the Author tab

    As a user
    I want to open the Author tab
    So that I can test that the page url is correct

@AuthorsTest
Scenario: I am able to open the Authors tab

    Given I login to Literature

    When I go to the Authors tab

    Then The page url contains the string "author"
        And The page contains the AuthorOverview component
        And The subscriptions grid is not empty