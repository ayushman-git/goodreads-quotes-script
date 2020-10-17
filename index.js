const fs = require("fs");
const pup = require("puppeteer");
const URL = "https://www.goodreads.com/quotes/tag/cosmos?page=";
const pages = 10;
const fileName = "quotesData.js"

for (let page = 1; page <= pages; page++) {
  (async () => {
    let quotes = [];
    const browser = await pup.launch();
    const page = await browser.newPage();
    await page.goto(URL + page, {
      waitUntil: "networkidle2",
      timeout: 0,
    });
    const rawQuotes = await page.evaluate(() => {
      let result = [];
      let author = [];
      document.querySelectorAll(".quoteText").forEach((el) => {
        result.push(el.innerText);
      });
      document.querySelectorAll("span.authorOrTitle").forEach((el) => {
        author.push(el.innerText);
      });
      return [result, author];
    });
    rawQuotes[0].forEach((quote) => {
      const obj = {
        content: quote.substring(quote.indexOf("“") + 1, quote.indexOf("”")),
      };
      quotes.push(obj);
    });

    for (let i = 0; i < rawQuotes[1].length; i++) {
      quotes[i].author = rawQuotes[1][i];
    }
    console.log(quotes);

    let quotesStringify = JSON.stringify(quotes) + ",";
    quotesStringify = quotesStringify.replace(/\[/g, "");
    quotesStringify = quotesStringify.replace(/\]/g, "");

    fs.appendFile(fileName, quotesStringify, "utf8", () => {
      console.log("Quotes added");
    });
    await browser.close();
  })();
}
