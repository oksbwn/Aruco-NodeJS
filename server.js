const http = require('http');
const port = 8089;

function gtMarkerMatrix(id) {
    var ids = [16, 23, 9, 14];
    var index, val, x, y;
    var marker = [[0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]];

    for (y = 0; y < 5; y++) {
        index = (id >> 2 * (4 - y)) & 3;
        val = ids[index];
        for (x = 0; x < 5; x++) {
            if ((val >> (4 - x)) & 1) {
                marker[x][y] = 1;
            } else {
                marker[x][y] = 0;
            }
        }
    }
    return marker;
}

function getImage(size, id) {
    var x, y;
    var marker = gtMarkerMatrix(id);
    var image;

    if (size) {
        size = 'height="' + size + '" width="' + size + '"';
    } else {
        size = '';
    }

    image = '<svg ' + size + ' viewBox="0 0 7 7" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '  <rect x="0" y="0" width="7" height="7" fill="black"/>\n';

    for (y = 0; y < 5; y++) {
        for (x = 0; x < 5; x++) {
            if (marker[x][y] === 1) {
                image += '  <rect x="' + (x + 1) + '" y="' + (y + 1) +
                    '" width="1" height="1" fill="white" ' +
                    // Slight stroke to get around aliasing issues with adjacent rectangles
                    'stroke="white" stroke-width="0.01" />\n';
            }
        }
    }

    image += '</svg>';
    return image;
}


const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let data = JSON.parse(body);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'image/svg+xml');
            res.write(getImage(data.size || 150, data.id));
            res.end();
        });
    }

});


server.listen(port, () => {
    console.log(`Server listening on port :${port}`);
});