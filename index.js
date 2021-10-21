
const { Builder, By, Key, until } = require('selenium-webdriver');
const { performance } = require('perf_hooks');
const yargs = require('yargs');
const argv = yargs
    .usage('Usage $0 <command> [options]')
    .command('parse', 'PDF to Text')
    .alias('d', 'debug')
    .argv;

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function startFirefox() {
	try {
		return new Builder().forBrowser('firefox').build();
	} catch(e) {
		console.error(e);
	}
}

class Parser {
	constructor(debug) {
		this.debug = debug;
		this.pages = [];
		this.maxWaitDuration = 7000;
	}
	startFirefox() {
		try {
			return new Builder().forBrowser('firefox').build().then((firefox)=>{
				this.firefox = firefox;
			});
		} catch(e) {
			console.error(e);
		}
	}
	visitAddress(filePath){
		this.setStartTime();
		this.log('Start Parser: ', this.firefox);
		this.filePath = filePath;
		this.firefox.get(filePath);
	}
	getPageCount(){
		return this.runScript(`return document.querySelectorAll('.page').length`).then((count)=>{
			this.pageCount = count;
			this.log('JavaScript page count: ' + this.pageCount);
		});
	}
	getPageElements(){
		return this.firefox.findElements(By.className('page')).then((pageElements)=>{
			this.pageElements = pageElements;
			this.log('Webdriver page count:', pageElements.length);
		});
	}
	loadPage(page){
		this.page = page;
		this.logPageHeader(page);
	 	return this.runScript(this.getPageSelector(page) + ".scrollIntoView();");
	
	}
	getPageSelector(page){
		return `document.querySelectorAll('.page')[${page}]`;
	}
	done(){
		this.firefox.quit();
		this.endTime = performance.now();
		console.log(this.pages)
		this.log(`Done, pfd parser took ${ Math.round((this.endTime - this.startTime) / 10) / 100 } seconds`)
	}
	setStartTime(){
		this.startTime = performance.now();
	}
	logPageHeader(page){
		this.log(`
##################################################################
############################ PAGE ${("   " + page).slice(page.toString().length)} ############################
##################################################################
		`);
	}
	log(...message){
		if(this.debug){
			console.log(...message);
		}
	}
	runScript(...script){
		return this.firefox.executeScript(...script)
	}
	blockImages(...script){
		return this.runScript(`document.querySelector('head').innerHTML += '<style>canvas{width: 1px !important;height: 1px !important;}</style>'`);
	}
	testPageLoaded(page){
		return this.firefox.wait(() => {
			return this.runScript("return " + this.getPageSelector(page) + ".querySelector('div').getAttribute('aria-label')")
			.then((label)=>{
				this.log('Wait: ' + (label === 'Loading…') + ' page: ' + page + ' aria-label: ' + label);
				return label !== 'Loading…';
			});
		}, this.maxWaitDuration);
	}
	parse(page){
		this.pageElements[page].getText().then((text)=>{
			this.runScript("return " + this.getPageSelector(page) + ".innerHTML").then((html)=>{
				this.log('text: ' + text);
				this.log('HTMLlength: ' + html.length);
				this.pages[page] = 
				{
					page,
					text,
					HTMLlength: html.length,
				};

			});

		});
	}
}


(async function parse() {
	const pages = [];
	const parser = await new Parser(argv.debug);
	await parser.startFirefox();
	await parser.visitAddress('File:///Users/zimonh/Sites/pdf-parser/Albert42.pdf');
	//await parser.blockImages();
	await timeout(3000);
	await parser.getPageCount();
	await parser.getPageElements(); // To get the correct \v and \h use the webdriver to get the elements
	for(let page = 0; page < parser.pageCount; page++){
		await parser.loadPage(page);
		await parser.testPageLoaded(page);
		await timeout(200);
		await parser.parse(page);
	}
	
	parser.done();

})();