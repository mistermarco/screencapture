#! /usr/bin/python

from selenium import webdriver
driver = webdriver.Firefox()
driver.set_window_size(1024,400)
driver.get("http://www.google.com")
driver.save_screenshot('google.png')
driver.quit()
