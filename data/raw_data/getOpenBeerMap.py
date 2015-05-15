#! python3.4
# -*- coding: UTF-8 -*-
#!/usr/bin/env

# from __future__ import (unicode_literals, print_function)
# -----------------------------------------------------------------------------
# Name:         Parser Geocoder from Excel file
# Purpose:      todo
#
# Author:       Julien Moura (https://twitter.com/geojulien)
#
# Python:       2.7.x
# Created:      14/05/2015
# Updated:      15/05/2015
#
# Licence:      GPL 3
# ------------------------------------------------------------------------------

###############################################################################
########### Libraries #############
###################################

# Standard library
# import urllib.request
import json
import datetime
import urllib2


# Python 3 backported


# 3rd party libraries
from geojson import dump, Feature, FeatureCollection, Point
import requests

# Custom modules

###############################################################################
########### Main program ##########
###################################

bbox = (48.8529, 2.3222, 48.8452, 2.3643)


rq = "http://api.openstreetmap.fr/oapi/interpreter?data=[out%3Ajson]%3B%0A%0A%28%0A%20%20%2F%2F%20get%20cycle%20route%20relatoins%0A%20%20relation[route%3Dbicycle]%2841.88166362505289%2C12.480323910713196%2C41.88522612431391%2C12.48598337173462%29-%3E.cr%3B%0A%20%20%2F%2F%20get%20cycleways%0A%20%20way[highway%3Dcycleway]%2841.88166362505289%2C12.480323910713196%2C41.88522612431391%2C12.48598337173462%29%3B%0A%20%20way[highway%3Dpath][bicycle%3Ddesignated]%2841.88166362505289%2C12.480323910713196%2C41.88522612431391%2C12.48598337173462%29%3B%0A%29%3B%0A%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B"

rq = "http://api.openstreetmap.fr/oapi/interpreter?data[out:json];(node({0})[amenity=bar];way({0})[amenity=bar];node({0})[amenity=cafe]['cuisine'!='coffee_shop'];way({0})[amenity=cafe]['cuisine'!='coffee_shop'];node({0})[amenity=biergarten];node({0})[microbrewery=yes];node({0})['brewery'];way({0})['brewery'];node({0})[amenity=pub];way({0})[amenity=pub]);out center;>;out;".format(bbox)
# rq = "http://api.openstreetmap.fr/oapi/interpreter?data[out\:json]\;(node((48.8529, 2.3222, 48.8452, 2.3643))[amenity=bar];way((48.8529, 2.3222, 48.8452, 2.3643))[amenity=bar];node((48.8529, 2.3222, 48.8452, 2.3643))[amenity=cafe]['cuisine'!='coffee_shop'];way((48.8529, 2.3222, 48.8452, 2.3643))[amenity=cafe]['cuisine'!='coffee_shop'];node((48.8529, 2.3222, 48.8452, 2.3643))[amenity=biergarten];node((48.8529, 2.3222, 48.8452, 2.3643))[microbrewery=yes];node((48.8529, 2.3222, 48.8452, 2.3643))['brewery'];way((48.8529, 2.3222, 48.8452, 2.3643))['brewery'];node((48.8529, 2.3222, 48.8452, 2.3643))[amenity=pub];way((48.8529, 2.3222, 48.8452, 2.3643))[amenity=pub]);out center;>;out;"


fullurl = urllib2.quote(rq, safe="%/:=&?~#+!$,;'@()*[]")
print fullurl


# print(rq)
# youhou = 'http://api.openstreetmap.fr/oapi/interpreter?data{0};{1}'.format("[out:json]", rq)
# search_req = urllib2.Request('http://api.openstreetmap.fr/oapi/interpreter?data{0};{1}'.format("[out:json]", rq))

# search_req = urllib.request.urlopen(rq)
search_req = urllib2.Request(fullurl)

# payload = {'key1': 'value1', 'key2[]': ['value2', 'value3']}
# r = requests.get('http://api.openstreetmap.fr/oapi/interpreter')

# print(youhou)
# Envoi de la requête dans une boucle de test pour prévenir les erreurs
try:
    search_resp = urllib2.urlopen(search_req)
    search_rez = json.load(search_resp)
    print(search_rez)
except urllib2.URLError, e:
    print(e)

###############################################################################
###### Stand alone program ########
###################################

# if __name__ == '__main__':
#     """ standalone execution """
