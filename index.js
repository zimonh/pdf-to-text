function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// totdo laod using
// 
// 
// 
// <div class="loadingIcon" role="img" aria-label="Loading…"></div><div style="width: 793px; height: 1417px;" class="canvasWrapper"><canvas moz-opaque="" style="width: 794px; height: 1418px;" width="1588" hidden="" height="2836"></canvas></div><div class="textLayer" style="width: 793px; height: 1417px;"></div>
// <div class="loadingIcon" role="img" aria-label="Loading…"></div>
// 
// 


const { Builder, By, Key, until } = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  console.log('Start Parser');


  await driver.get('File:///Users/zimonh/Sites/pdf-parser/Albert42.pdf');
  let elements = await driver.findElements(By.className('page'));
  console.log('Found page elements', elements.length);

  await timeout(2000);

  for (var i = 0; i < elements.length * 2; i++) {
    await driver.actions().keyDown(Key.SPACE).perform();
    await timeout(500);
  }
  
  page = 0;
  for (let e of elements) {
    page++
    console.log('--------------------------------------------------------     page:' + page + ' -----------------------------------------------------------------');
    console.log('html: ' + await driver.executeScript("return document.querySelectorAll('.page')[" + (page - 1) + "].innerHTML")); // textContent
    console.log('text: ' + await e.getText());

  }
  //
  driver.quit();

})();