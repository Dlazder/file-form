const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    const filePath = req.url.substr(1);
    console.log('requested URL: ', filePath)
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.end('Error!');
            res.statusCode = 404;
        } else {
            res.end(data);
        }
    })

    if (req.url === '/file' && req.method === 'POST') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk
        })

        req.on('end', () => {
            res.statusCode = 200;
            const {fileName, base64Img} = JSON.parse(data);
            const file = Buffer.from(base64Img, 'base64')
            fs.writeFile('./images/' + fileName, file, (err) => {
                if (err) console.error(err) ;
                else {
                    console.log('The file has been saved!');
                }
            });
        });
    }

    if (req.url === '/delete-file' && req.method === 'POST') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        })

        req.on('end', () => {
            fs.unlink('./images/' + data, (err) => {
                if (err) console.error(err)
                else console.log('./images/' + data, 'has been removed!');
            })
        })
    }


}).listen(3000, () => {console.log('http://localhost:3000/index.html')});