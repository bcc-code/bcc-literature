const { When, Then } = require('cucumber');
const { Selector, ClientFunction} = require('testcafe');

When('I go to the Authors tab',{timeout: 80 * 1000}, async() => {
    const headerComponent = Selector(".main-content header nav").child(1);
    
    await testController.click(headerComponent);
});

Then('The page url contains the string {string}', {timeout: 80 * 1000}, async(string) => {
    const getPageUrl = ClientFunction(() => window.location.href).with({ boundTestRun: testController });
    
    await testController
        .expect(getPageUrl())
        .contains(string);
});

Then('The page contains the AuthorOverview component', {timeout: 80 * 1000}, async () => {
    const popularAuthorsGrid = Selector('.popular-authors').find(".grid").with({boundTestRun: testController});
    const articlesACount = popularAuthorsGrid.find('article').count;
    
    const allAuthorsGrid = Selector('.author-library').find(".grid").with({boundTestRun: testController});
    const allAuthorsArticleCount = allAuthorsGrid.find('article').count;

    await testController
        .expect(articlesACount)
        .gt(0);

    await testController
        .expect(allAuthorsArticleCount)
        .gt(0);
});

Then('The subscriptions grid is not empty',{timeout: 80 * 1000}, async () => {
    const subscriptionsGrid = Selector('#main').find("header").with({ boundTestRun: testController });
    
    await testController
        .expect(subscriptionsGrid.childElementCount)
        .gt(0);
});