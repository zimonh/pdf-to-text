
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const getNamedArgs = require('get-node-named-cli-args')
const myArgs = getNamedArgs();

if(!myArgs.file || myArgs.file.length === 0){
  console.error('missing \'file="myfile.pdf"\' argument after \'node app.js \'');
  process.exit(1);
}

class Parser {
  constructor(file, page, debug) {
    this.pages = [];
    this.pdf = null;
    this.debug = debug;
    this.file = file;
    this.page = page;
  }
  log(...message){
    if(!this.debug){ return; }
    console.log(...message);
  }
  logPageHeader(page){
    this.log(`
${'#'.repeat(66)}
${'#'.repeat(28)} PAGE ${("   " + page).slice(page.toString().length)} ${'#'.repeat(28)}
${'#'.repeat(66)}
    `);
  }
  loadPage(pageNum) {
   
    return this.pdf.getPage(pageNum).then(page => {
      this.logPageHeader(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      this.log("Size: " + viewport.width + "x" + viewport.height);
      return page
        .getTextContent()
        .then((content)=>{
          const strings = content.items.map(item => item.str);

          const textWithPosition = content.items.map(item => {
            const tx = pdfjsLib.Util.transform(pdfjsLib.Util.transform(viewport.transform, item.transform),[1, 0, 0, -1, 0, 0]);
            // Small cleanup
            return {
              str: item.str,
              width: Math.round(item.width * 100) / 100,
              height: Math.round(item.height * 100) / 100,
              transform: tx.map(tr => Math.round(tr * 10000) / 10000)
            };
          });

          this.log("Text Content Start");
          this.log(strings.join("\n"));
          this.pages[pageNum] = {page :pageNum, text: strings.join("\n"), textWithPosition};
        })
        .then(()=> {
          this.log('Text Content End');
        });
    });
    

  }
  run(){
    const loadingTask = pdfjsLib.getDocument({url: this.file, verbosity: pdfjsLib.VerbosityLevel.ERRORS});
    loadingTask.promise.then(pdf => {
    this.pdf = pdf;
    const numPages = this.pdf.numPages;
    this.log("-- Document Loaded");
    this.log("Number of Pages: " + numPages);

    let lastPromise; // will be used to chain promises

    lastPromise = this.pdf.getMetadata().then(data => {
      this.log("-- Info");
      this.log(JSON.stringify(data.info, null, 2));
      if (data.metadata) {
        this.log("-- Metadata --");
        this.log(JSON.stringify(data.metadata.getAll(), null, 2));
      }
    });
    if(this.page){
      return lastPromise.then(this.loadPage.bind(this, this.page));
    }else{
      for (let i = 1; i <= numPages; i++) {
        lastPromise = lastPromise.then(this.loadPage.bind(this, i));
      }
    }

    return lastPromise;
  })
  .then(() => {
      if(this.page){
        console.log(JSON.stringify(this.pages[this.page]));
      }else{
        this.pages.shift();
        console.log(JSON.stringify(this.pages));
      }
    },
    error => {
      console.error("Error: " + error);
    }
  );
  }
}

const parser = new Parser(myArgs.file, myArgs.page, myArgs.debug);
parser.run();
