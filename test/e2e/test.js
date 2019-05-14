const PAGE_URL = 'http://localhost/executor-editor/demo/';

describe('General', () => {

    beforeEach(async (page, done) => {
        await page.url(PAGE_URL);
        await page.waitForElementVisible('body');
        done();
    });

    it('should works', async (page) => {
        await page.assert.elementPresent('.executor');
    });

});
