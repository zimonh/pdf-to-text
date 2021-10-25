# PDF Parser
PDF to text/HTML using the selenium-webdriver.
Example.pdf outputs:
```json
[
    {
        "page": 1,
        "text": "This is page 1",
        "html": "<div style=\"width: 732px; height: 1417px;\" class=\"canvasWrapper\"><canvas moz-opaque=\"\" style=\"width: 733px; height: 1418px;\" width=\"1466\" height=\"2836\"></canvas></div><div class=\"textLayer\" style=\"width: 732px; height: 1417px;\"><span class=\"markedContent\"><span style=\"left: 187.977px; top: 84.8499px; font-size: 58.3333px; font-family: sans-serif; transform: scaleX(1.00907);\" role=\"presentation\" dir=\"ltr\">This is page 1</span></span><div class=\"endOfContent\"></div></div>"
    },
    {
        "page": 2,
        "text": "This is page 2",
        "html": "<div style=\"width: 732px; height: 1417px;\" class=\"canvasWrapper\"><canvas moz-opaque=\"\" style=\"width: 733px; height: 1418px;\" width=\"1466\" height=\"2836\"></canvas></div><div class=\"textLayer\" style=\"width: 732px; height: 1417px;\"><span class=\"markedContent\"><span style=\"left: 194.054px; top: 84.8499px; font-size: 58.3333px; font-family: sans-serif; transform: scaleX(1.00907);\" role=\"presentation\" dir=\"ltr\">This is page 2</span></span><div class=\"endOfContent\"></div></div>"
    },
    {
        "page": 3,
        "text": "This is page 3",
        "html": "<div style=\"width: 732px; height: 1417px;\" class=\"canvasWrapper\"><canvas moz-opaque=\"\" style=\"width: 733px; height: 1418px;\" width=\"1466\" height=\"2836\"></canvas></div><div class=\"textLayer\" style=\"width: 732px; height: 1417px;\"><span class=\"markedContent\"><span style=\"left: 191.297px; top: 84.8499px; font-size: 58.3333px; font-family: sans-serif; transform: scaleX(1.00907);\" role=\"presentation\" dir=\"ltr\">This is page 3</span></span><div class=\"endOfContent\"></div></div>"
    }
]
```

## Description
PDF files can become extremely complex, there are different versions, formats and a sometimes, a large number of nested elements.

To circumvent this problem a browser with a JavaScript accessible PDF viewer is used to extract the data.

Chrome was not an option as of 2021-10-25.
Firefox is as of 2021-10-25.

## Getting Started
To turn your PDF into text or HTML:
* Install [Firefox](https://www.mozilla.org/en-US/firefox/new/)
* Install [Gekko Driver](https://askubuntu.com/questions/870530/how-to-install-geckodriver-in-ubuntu)
* See: Installing

### Dependencies
* Firefox
* Gekko Driver

### Installing
Clone this repository:
```shell
git clone git@github.com:zimonh/pdf-parser.git
```
Install npm packages:
```shell
npm install
```

### Executing program
First lets run a test.
```shell
node app.js -d -f 'https://anywhere.com/book-article-or-whatever.pdf'
```
Now remove the '-d' debug option
```shell
node app.js -f 'https://anywhere.com/book-article-or-whatever.pdf'
```
You can also return a specific page '-p' option
```shell
node app.js -p 42 -f 'https://anywhere.com/book-article-or-whatever.pdf'
```
You can also access local files
```shell
node app.js  -f 'File:///Users/Me/Desktop/book-article-or-whatever.pdf'
```

## Known issues
* Page returns as empty, but is not the second try. Reason: Sometimes pages have a long load time. To ensure other pages do get loaded, the process will timeout.
* In rare cases, Firefox instances don't quit properly. 
* Your file does not exist. (Try to copy the path from your browser)
* undefined = Your page does not exist. View the PDF in a browser, search carefully, sometimes there are multiple page numbers on your screen.


## Authors
ZIMONH
www.zimonh.at
