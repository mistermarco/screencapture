// phantomjs capture.js

var page = require('webpage').create();

page.viewportSize = {
	width: 1024,
    height: 800
};

page.open('http://www.google.com', function() {
  page.render('google.png');
  phantom.exit();
});
