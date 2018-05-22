/**
 * A simple server serving the content of dist dir to /static
 * And sending index.html for any other request
 */
var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {
    var filePath = request.url;
    if (filePath.startsWith('/static/')) {
        filePath = './dist/' + filePath.split('/static/')[1]
    } else {
        filePath = './dist/index.html';
    }

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end('Not found', 'utf-8');
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(8000);
