const fs = require('fs');
const f = 'node_modules/bn.js/lib/bn.js';

fs.readFile(f, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/assert\(false, 'Number can only safely store up to 53 bits'\)/g,
    'return 0x3FFFFFFFFFFFFF');

  fs.writeFile(f, result, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
  });
});
