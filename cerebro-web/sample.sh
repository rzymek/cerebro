#!/bin/bash
url=localhost:3000
url=bullhorn.meteor.com
curl $url/reset
for i in {1..10};do
    curl -w'\n' $url/report -d '{"sender":"'$i'", "listeners":["a","b","c"], "position":{"lat":52.'$i',"lon":24.'$i'}}'
done

