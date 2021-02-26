import keys from "../../../src/keys";
const appUrl = keys.APP_URL;
const { Given, When, Then } = require('cucumber');
const { Selector, ClientFunction} = require('testcafe');

Given('There are subscriptions in the Subscriptions section',{timeout: 80 * 1000}, async () => {
    const subscGrid = Selector('#main').find(".subscriptions-grid").with({ boundTestRun: testController });
    const subscGridChildCount = subscGrid.childElementCount;
    
    await testController
        .expect(subscGridChildCount)
        .gt(0);
});

Given('There are books in the Books Section',{timeout: 80 * 1000}, async () => {
    const booksGrid = Selector('.main-content').find(".grid").with({ boundTestRun: testController });
    const booksGridChildCount = booksGrid.childElementCount;
    
    await testController
        .expect(booksGridChildCount)
        .gt(0);
});

When('On clicking on a subscription, I am redirected to the subscriptions detail page', {timeout: 80 * 1000}, async () => {
    const subscriptionGridDiv = Selector('.main-content').find(".subscriptions-grid").with({ boundTestRun: testController });
    const anchorTag = subscriptionGridDiv.find('.subscription').find('a').with({ boundTestRun: testController });
    const getPageUrl = ClientFunction(() => window.location.href).with({ boundTestRun: testController });
    
    await testController
        .click(anchorTag)
        .expect(getPageUrl())
        .contains(appUrl+"books/");
});

Then('The page should contain articles for the selected subscription', {timeout: 80 * 1000}, async () => {
    const articlesListDiv = Selector('.main-content').find('.list').with({ boundTestRun: testController });
    const getArticlesCount = articlesListDiv.find('article').count;
    
    await testController
        .expect(getArticlesCount)
        .gt(0);
});