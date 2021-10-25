# PDF Parser
PDF to text/HTML using the selenium-webdriver.

## Description
PDF files can become extremely complex, there are different versions, formats and a sometimes, a large number of nested elements.

To circumvent this problem a browser with a JavaScript accessible PDF viewer is used to extract the data.

Chrome was not an option as of 2021-10-25.
Firefox is as of 2021-10-25.

## Getting Started
To turn your PDF into text or HTML:
* Install Firefox
* See: Installing

### Dependencies
* Firefox

### Installing

Clone this repository:
```
git clone git@github.com:zimonh/pdf-parser.git
```
Install npm packages:
```
npm install
```

### Executing program
First lets run a test.
```
node app.js -d -f 'https://anywhere.com/book-article-or-whatever.pdf'
```
Now remove the '-d' debug option
```
node app.js -f 'https://anywhere.com/book-article-or-whatever.pdf'
```
You can also return a specific page '-p' option
```
node app.js -p 42 -f 'https://anywhere.com/book-article-or-whatever.pdf'
```
You can also access local files
```
node app.js  -f 'File:///Users/Me/Desktop/book-article-or-whatever.pdf'
```

## Known issues
* Page returns as empty, but is not the second try. Reason: Sometimes pages have a long load time. To ensure other pages do get loaded, the process will timeout, .
* In rare cases, Firefox instances don't quit properly. 
* You forgot to install Firefox.
* Your file does not exist. (Try to copy the path from your browser)
* undefined = Your page does not exist. View the PDF in a browser, search carefully, sometimes there are multiple page numbers on your screen.


## Authors
ZIMONH
www.zimonh.at
