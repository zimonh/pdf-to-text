
# PDF to text
<img src="https://user-images.githubusercontent.com/4648145/138750839-28ef8239-76e1-49ae-bc68-722d22165eea.png" width="248"> 

PDF to text/TextPosition using the pdf-dist.

Example.pdf outputs:
```json
[
    {
        "page": 1,
        "text": "This is page 1",
        "TextPosition":
        [
            {
                "height": 35,
                "str": "This is page 1",
                "transform":
                [
                    35,
                    0,
                    0,
                    35,
                    112.7861,
                    76.5766
                ],
                "width": 219.83
            }
        ]
    },
    {
        "page": 2,
        "text": "This is page 2",
        "TextPosition":
        [
            {
                "height": 35,
                "str": "This is page 2",
                "transform":
                [
                    35,
                    0,
                    0,
                    35,
                    116.4326,
                    76.5766
                ],
                "width": 219.83
            }
        ]
    },
    {
        "page": 3,
        "text": "This is page 3",
        "TextPosition":
        [
            {
                "height": 35,
                "str": "This is page 3",
                "transform":
                [
                    35,
                    0,
                    0,
                    35,
                    114.7783,
                    76.5766
                ],
                "width": 219.83
            }
        ]
    }
]
```

## Description
PDF files can become extremely complex, there are different versions, formats and a sometimes, a large number of nested elements.

To circumvent this problem JavaScript from a browsers PDF viewer is used to extract the data.


## Getting Started
* See: Installing

### Installing
Clone this repository:
```shell
git clone git@github.com:zimonh/pdf-to-text.git
```
Install npm packages:
```shell
npm install
```

### Executing program
First run in dedug mode, find a nice pdf and run like:
```shell
node app.js file='https://anywhere.com/book-article-or-whatever.pdf' debug=true
```
Now remove the debug option
```shell
node app.js file='https://anywhere.com/book-article-or-whatever.pdf'
```
You can also return a specific page 'page' option
```shell
node app.js file='https://anywhere.com/book-article-or-whatever.pdf' page=42
```
You can also access local files
```shell
node app.js file='File:///Users/Me/Desktop/book-article-or-whatever.pdf'
```

## Known issues
* Your file does not exist. (Try to copy the path from your browser)
* undefined = Your page does not exist. View the PDF in a browser, search carefully, sometimes there are multiple page numbers on your screen.

## Special thanks
[Nickmanbear](https://github.com/Nickmanbear)

## Authors
ZIMONH
www.zimonh.at
