Feature: Test Book Overview

    As a user 
    I want to click on a subscription
    So as to be able to read it

@BooksTest
Scenario: I am able to click on a subscription from Books tab

    Given I login to Literature
        And There are subscriptions in the Subscriptions section
        And There are books in the Books Section

    When On clicking on a subscription, I am redirected to the subscriptions detail page

    Then The page should contain articles for the selected subscription