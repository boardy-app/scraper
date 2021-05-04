const puppeteer = require("puppeteer");
require("dotenv").config();

const shopKeeper = async (email, password) => {
  console.log(email);
  console.log(password);

  try {
    console.time("process");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
      timeout: 120000
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1440, height: 1440 });

    await page.goto("https://shopkeeper.com/login");

    console.log("DEBUG : page open");

    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', email);
    await page.type('input[name="password"]', password);

    await page.keyboard.press("Enter");

    console.log("DEBUG : login ok");

    await page.waitForNavigation({ waitUntil: ["networkidle2"] });

    await page.goto("https://shopkeeper.com/sales/overview");

    await page.waitForTimeout(2000);

    console.log("DEBUG : select today data");

    await page.select(
      "#app_sales_overview > div.block.block-bordered > div.sticky-header-group > div > div:nth-child(1) > div > div:nth-child(1) > div > select",
      "today"
    );

    await page.waitForTimeout(2000);

    const pathProfit =
      ".wrapper-row-totals > div > .col-indicator:nth-child(4)";
    const pathRevenue =
      ".wrapper-row-totals > div > .col-indicator:nth-child(5)";

    const todayRevenue = await page.$eval(pathRevenue, el => el.textContent);
    const todayProfit = await page.$eval(pathProfit, el => el.textContent);

    console.log("DEBUG : select yesterday data");

    await page.select(
      "#app_sales_overview > div.block.block-bordered > div.sticky-header-group > div > div:nth-child(1) > div > div:nth-child(1) > div > select",
      "yesterday"
    );
    await page.waitForTimeout(2000);

    const yesterdayRevenue = await page.$eval(
      pathRevenue,
      el => el.textContent
    );
    const yesterdayProfit = await page.$eval(pathProfit, el => el.textContent);

    console.log("DEBUG : select this month data");

    await page.select(
      "#app_sales_overview > div.block.block-bordered > div.sticky-header-group > div > div:nth-child(1) > div > div:nth-child(1) > div > select",
      "thismonth"
    );
    await page.waitForTimeout(2000);

    const thisMonthRevenue = await page.$eval(
      pathRevenue,
      el => el.textContent
    );
    const thisMonthProfit = await page.$eval(pathProfit, el => el.textContent);

    console.log("DEBUG : select year data");

    await page.select(
      "#app_sales_overview > div.block.block-bordered > div.sticky-header-group > div > div:nth-child(1) > div > div:nth-child(1) > div > select",
      "yearToDate"
    );
    await page.waitForTimeout(2000);

    const thisYearRevenue = await page.$eval(pathRevenue, el => el.textContent);
    const thisYearProfit = await page.$eval(pathProfit, el => el.textContent);

    await Promise.all([
      page.goto("https://shopkeeper.com/dashboard"),
      page.waitForNavigation({ waitUntil: "networkidle0" })
    ]);

    const currentStockValue = await page.$eval(
      "#app_dashboard > div:nth-child(3) > div.col-sm-6.col-lg-5 > a > div:nth-child(2) > div.block-content.block-content-mini.block-content-full.bg-gray-lighter.text-center > div > div:nth-child(1) > h2",
      el => el.textContent
    );
    const currentStock = await page.$eval(
      "#app_dashboard > div:nth-child(3) > div.col-sm-6.col-lg-5 > a > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div.h5.font-w300.text-muted",
      el => el.textContent
    );

    const lowStockNb = await page.$eval(
      "#app_dashboard > div:nth-child(4) > div:nth-child(1) > a > div:nth-child(2) > div:nth-child(4) > div > div.progress.center-block.push-5 > div > div.h4",
      el => el.textContent
    );
    const outOfStockNb = await page.$eval(
      "#app_dashboard > div:nth-child(4) > div:nth-child(1) > a > div:nth-child(2) > div:nth-child(5) > div > div.progress.center-block.push-5 > div > div.h4",
      el => el.textContent
    );

    const totalBalance = await page.$eval(
      "#app_dashboard > div:nth-child(5) > div:nth-child(3) > div > div.block-content.block-content-mini.block-content-full.bg-white.text-center > div > div:nth-child(2) > div.border-t.push-10-t > div.h4.font-w600.text-success",
      el => el.textContent
    );

    console.log(`todayRevenue : ${todayRevenue}`);
    console.log(`todayProfit : ${todayProfit}`);

    console.log(`yesterdayRevenue : ${yesterdayRevenue}`);
    console.log(`yesterdayProfit : ${yesterdayProfit}`);

    console.log(`thisMonthRevenue : ${thisMonthRevenue}`);
    console.log(`thisMonthProfit : ${thisMonthProfit}`);

    console.log(`thisYearRevenue : ${thisYearRevenue}`);
    console.log(`thisYearProfit : ${thisYearProfit}`);

    console.log(`currentStockValue : ${currentStockValue}`);
    console.log(`currentStock : ${currentStock}`);

    console.log(`lowStockNb : ${lowStockNb}`);
    console.log(`outOfStockNb : ${outOfStockNb}`);

    console.log(`totalBalance : ${totalBalance}`);

    await browser.close();

    console.timeEnd("process");

    return {
      todayRevenue: todayRevenue.replace(/[^0-9]/g, ""),
      todayProfit: todayProfit.replace(/[^0-9]/g, ""),
      yesterdayRevenue: yesterdayRevenue.replace(/[^0-9]/g, ""),
      yesterdayProfit: yesterdayProfit.replace(/[^0-9]/g, ""),
      thisMonthRevenue: thisMonthRevenue.replace(/[^0-9]/g, ""),
      thisMonthProfit: thisMonthProfit.replace(/[^0-9]/g, ""),
      thisYearRevenue: thisYearRevenue.replace(/[^0-9]/g, ""),
      thisYearProfit: thisYearProfit.replace(/[^0-9]/g, ""),
      currentStockValue: currentStockValue.replace(/[^0-9]/g, ""),
      currentStock: currentStock.replace(/[^0-9]/g, ""),
      lowStockNb: lowStockNb.replace(/[^0-9]/g, ""),
      outOfStockNb: outOfStockNb.replace(/[^0-9]/g, ""),
      totalBalance: totalBalance.replace(/[^0-9]/g, "")
    };
  } catch (e) {
    console.log("ERROR : " + e);
    try {
      await browser.close();
    } catch (ee) {
      console.log("ERROR 2 : " + ee);
    }
    console.timeEnd("process");
    return null;
  }
};

module.exports = shopKeeper;
