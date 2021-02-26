import keys from "../../../src/keys";
const appUrl = keys.APP_URL;
const { Given } = require('cucumber');
const config = {
    email: "literaturetestuser@bcc.no",
    password: "gnJjV3GGjk2EL5M4R25"
}

Given('I login to Literature', {timeout: 80 * 1000}, async () => {
    await testController.navigateTo(appUrl);
    await testController.typeText ('[name = "email"]', config.email);
    await testController.typeText ('[name = "password"]', config.password);
    await testController.click('button[type=submit]');
});