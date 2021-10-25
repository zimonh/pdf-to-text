const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const { performance } = require('perf_hooks');
const yargs = require('yargs');
const argv = yargs
    .usage('Usage $0 <command> [options]')
    .command('parse', 'PDF to Text')
    .alias('d', 'debug')
    .alias('p', 'page')
    .nargs('p', 1)
    .describe('p', 'only collect specific page')
    .alias('f', 'file')
    .describe('f', 'Input path to file starting with File:/// or http:// or https://')
	.demandOption(['f'])
    .argv;

class Parser {
	constructor() {
		this.pages = [];
		this.maxWaitDuration = 7000;
	}
	log(...message){
		if(!this.debug){ return; }
		console.log(...message);
	}
	startFirefox() {
		const options = new firefox.Options();
		if(!this.debug){ options.addArguments("-headless"); }
		try {
			return new Builder().forBrowser('firefox')
				.setFirefoxOptions(options)
				.build()
				.then((firefox)=>{
					this.firefox = firefox;
				});
		} catch(e) {
			console.error('Parser startFirefox() failed:', e);
		}
	}
	async timeout(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	async visitAddress(filePath){
		this.filePath = filePath;
		this.startTime = performance.now();
		this.log('Start Parser for:', this.filePath);
		this.log('Driver:', this.firefox);
		await this.firefox.get(filePath);
		await this.timeout(100);
	}
	getPageCount(){
		return this.runScript(`return document.querySelectorAll('.page').length`)
			.then((count)=>{
				this.pageCount = count;
				this.log('JavaScript page count:', this.pageCount);
			});
	}
	getPageElements(){
		return this.firefox.findElements(By.className('page'))
			.then((pageElements)=>{
				this.pageElements = pageElements;
				this.log('Webdriver page count:', pageElements.length);
			});
	}
	runScript(...script){
		return this.firefox.executeScript(...script)
	}
	logPageHeader(page){
		this.log(`
${'#'.repeat(66)}
${'#'.repeat(28)} PAGE ${("   " + page).slice(page.toString().length)} ${'#'.repeat(28)}
${'#'.repeat(66)}
		`);
	}
	getPageSelector(page){
		return `document.querySelectorAll('.page')[${(page - 1)}]`;
	}
	loadPage(page){
		this.logPageHeader(page);
	 	return this.runScript(this.getPageSelector(page) + ".scrollIntoView();");
	}
	testPageLoaded(page){
		return this.firefox.wait(() => {
			return this.runScript("return " + this.getPageSelector(page) + ".querySelector('div').getAttribute('aria-label')")
			.then((label)=>{

				this.log('Wait: ' + (label === 'Loading…') + ' aria-label:', label);
				return label !== 'Loading…';
			});
		}, this.maxWaitDuration);
	}
	getText(page){
		return this.pageElements[(page - 1)].getText();
	}
	getHTML(page){
		return this.runScript("return " + this.getPageSelector(page) + ".innerHTML");
	}
	async parse(page){
		let text = await this.getText(page);
		let html = await this.getHTML(page);
		const item = { page, text, html };
		this.pages[page] = item;
		this.log('text:', text);
		this.log('HTMLlength:', html.length);
	}
	done(){
		this.firefox.quit();
		this.endTime = performance.now();
		let print = null;
		if(argv.page !== undefined){
			print = this.pages[argv.page];
		}else{
			this.pages.shift();
			print = this.pages;
		}
		console.log(JSON.stringify(print))
		this.log(`Done, pfd parser took ${ Math.round((this.endTime - this.startTime) / 10) / 100 } seconds`)
	}
	async run(file, onePage = false, debug = false){
		this.debug = debug;
		await this.startFirefox();
		try {
			await this.visitAddress(file);
		} catch(e) {
			console.error('PDF not found:', file)
			return;
		}
		await this.getPageCount();
		await this.getPageElements(); // To get the correct \v and \h use the webdriver to get the elements text
		for(let page = 1; page <= this.pageCount; page++){
			if(onePage && onePage !== page){
				continue;
			}
			await this.loadPage(page);
			await this.testPageLoaded(page);
			await this.timeout(600);
			await this.parse(page);
		}
		this.done();
	}
}

const parser = new Parser();
parser.run(argv.file, argv.page, argv.debug);