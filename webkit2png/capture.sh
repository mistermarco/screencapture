#!/bin/bash

while read line
do
  url=$(echo $line)
  webkit2png $url -F -W 1024
done < ../test-sites.txt