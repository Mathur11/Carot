import { test, expect, request } from '@playwright/test';


test('Login through UI to get Token and Create contact through API', async ({ browser, request }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(
        'https://qa.zolastaging.com'
    );
    // Fill login form
    await page.waitForLoadState('networkidle');
    const username = page.locator('input#txtUserName');
    await username.fill('performance.tester.1@mailinator.com');
    const password = page.locator('input#txtPwd');
    await password.fill('Success123');
    await page.locator('#loginBtn').click();

    // Wait for the CARET Legal logo to ensure login is successful
    await page.getByRole('img', { name: 'CARET Legal' }).waitFor();

    // Validate token exists in cookies
    const cookies = await page.context().cookies();
    const webTok = cookies.find(c => c.name === 'web-tok')?.value;
    await console.log('web-tok cookie value:', webTok);

    const cookieHeader = cookies
        .map(c => `${c.name}=${c.value}`)
        .join('; ');

    await console.log('Cookie Header:', cookieHeader);

    // Use the token to create a contact via API

    const response = await request.post(
        'https://qa.zolastaging.com/api2/contact/person',
        {
            headers: {
                accept: 'application/json, text/javascript, */*; q=0.01',
                authorization: `Bearer ${webTok}`,
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'x-requested-with': 'XMLHttpRequest',
                'svc-type': 'web',
                'Cookie': cookieHeader
            },

            form: {
                FirstName: 'Jake',
                LastName: 'jon',
                ActiveStatusId: '1',
                CompanyId: '',
                EmailList: '[]',
                WebsiteList: '[]',
                PhoneList: '[]',
                IMList: '[]',
                AddressList: '[]',
                ConsolidateInvoices: 'false',
                TransferSurcharge: 'false',
                ChargeInterest: 'false',
                Tags: '[]',
                TimeEntryRuleList: '[]'
            }
        }
    );

    //  Status validation
    console.log('Response body:', await response.text());

    expect(response.status()).toBe(200);
    console.log('Contact creation response status:', response.status());
    console.log('Response body:', await response.text());

});