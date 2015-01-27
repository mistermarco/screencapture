
# Automated screen capture techniques

The goal is to have a way to run a script that will take some screenshots of a series of web sites, return an image fore each web page after it's been rendered (all elements have loaded, Javascript fired, CSS applied).

Then, this image could be used to compare to a known good version to see if there is a difference.

Installation of some of these programs can be done quickly on a Mac using Homebrew (http://brew.sh/)

## Using Built-in Mac OS X programs

The command 'open' allows you to open a URL in the default browser. For example:

    open https://www.google.com

The command 'screencapture' allows a screenshot of the desktop. For example:

    screencapture ~/Desktop/screenshot.jpg

### Pros

* easy, all commands are available on Mac OS X

### Cons

* does not capture the entire webpage, but only what’s visible on the screen
* captures the desktop, not just the browser

screencapture can use the -w flag to capture just a particular window, but the process for choosing that window is not automatic.

## Use webkit2png

webkit2png from Paul Hammond does what’s promised by the name. It uses the webkit engine to fetch, render and save a website as PNG.

http://www.paulhammond.org/webkit2png/

To install using Homebrew:

    brew install webkit2png

Alternatively, you can download the script from the github repository at https://github.com/paulhammond/webkit2png

To use, simply run webkit2png with the URL you want to capture.

    webkit2png https://www.google.com

By default, webkit2png creates 3 images (full, clipped and thumbnail). It also loaded pages with a very small viewport, so I had to add the following flags to make it work for me:

    # load the page in a window that's 1024 pixels wide
    —width 1024

    # only create the full image
    —fullsize

    # specify the name of the output file
    —filename ~/Desktop/webkit2pngtest.png

### Pros

* easy, quick install
* captures the entire page
* works in the background
* renders page fully (web fonts and all)

### Cons

* webkit only
* mac os x only
* will append -full.png to the name of your image

## Use Selenium + Python + Firefox

Selenium (http://docs.seleniumhq.org/) is used to automate browsers. Here, we automate the opening of the page and taking a screenshot of it.

To install Selenium:

    sudo easy_install selenium

Once selenium is installed, you can create a small Python script that will open a web page in Firefox and capture it as a PNG:

    from selenium import webdriver
    driver = webdriver.Firefox()
    driver.set_window_size(1024,480)
    driver.get("https://itservices.stanford.edu")
    driver.save_screenshot('selenium-test.png')
    driver.quit()

## Pros

* captures the entire page (the height specified is ignored)
* renders the page fully (web fonts and all)
* can run multiple browsers as long as the driver for them is installed
* should work on Linux and Windows as well (not tested)
* scriptable through Python (e.g. can run a test, and only take a screenshot if it fails).

## Cons

* opens up the browser (not headless)


## Using PhantomJS + Javascript

PhantomJS is a headless WebKit browser scriptable with a Javascript API.

http://phantomjs.org/

To install:

    brew install phantomjs

(Note: this allows selenium to work with phantomsjs, see more below)

Once PhantomJS is installed, you control it through Javascript. Enter the code in a file. For example:

    // phantom-test.js
    var page = require('webpage').create();
    
    page.viewportSize = {
      width: 1024,
            height: 2000
    };
    
    page.open('http://www.google.com', function() {
      page.render('phantomjs-test.png');
      phantom.exit();
    });

And then you call PhantomJS with the script:

    phantomjs phantom-test.js

This is quite powerful as it allows you to inject Javascript into the page to be rendered. Some of the issues I've encountered were the rendering of Font Awesome icons, although that seems to have been fixed.

Web fonts are still an issue, however. In my tests, PhantomJS would not load Google Web Fonts unless a copy of the font was also installed locally. Even then, the display of the font didn't quite match what real browsers were showing. There are several issues on the PhantomJS github queue addressing this, but it appears to have been a problem for some time.

### Pros

* scriptable through Javascript
* runs on Linux, too (not tested)
* headless (no windows popping up)
* captures the entire page, although I've sometimes run into issues with rendering

### Cons

* doesn’t render Web Fonts correctly
* Webkit only

## Using Selenium + PhantomJS

It's possible to use PhantomJS with Selenium:

    from selenium import webdriver
    driver = webdriver.PhantomJS()
    driver.set_window_size(1024,480)
    driver.get("https://itservices.stanford.edu")
    driver.save_screenshot('selenium-test.png')
    driver.quit()

## Testing images

ImageMagick (http://www.imagemagick.org/) is a suite of tools for manipulating images. Part of the package is the _compare_ command whic will take two images and compare them to determine if they are different.

To install:

    brew install imagemagick

To compare two images:

    compare image1.png image2.png diff.png

This will produce a third image with annotations showing the differences between the pages. This could be used to spot quickly if a website has changed, and where.

## TODO

* script the various solutions to act on multiple websites
* test the Python bindings for ImageMagick
