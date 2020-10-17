const fs = require("fs");
const pup = require("puppeteer");
// for (let i = 1; i <= 10; i++) {
  (async () => {
    let quotes = [];
    const browser = await pup.launch();
    const page = await browser.newPage();
    await page.goto("https://www.goodreads.com/quotes/tag/cosmos?page=1", {
      waitUntil: "networkidle2",
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

   for(let i = 0; i <= rawQuotes[1].length; i++) {
     console.log(quotes[i])
    //  quotes[i].author = rawQuotes[1][i];
   }
   console.log(quotes)

    let quotesStringify = JSON.stringify(quotes);
    quotesStringify = quotesStringify.replace(/\[/g, "");
    quotesStringify = quotesStringify.replace(/\]/g, "");

    // fs.appendFile("quotesData.js", quotesStringify, "utf8", () => {
    //   console.log("Quotes added");
    // });
    await browser.close();
  })();