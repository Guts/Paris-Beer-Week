# -*- coding: UTF-8 -*-
#!/usr/bin/env

from __future__ import (unicode_literals, print_function)
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

# Python 3 backported

# 3rd party libraries
from geojson import dump, Feature, FeatureCollection, Point
import overpy

# Custom modules

###############################################################################
########### Main program ##########
###################################

# liste pour stocker les différents points
li_openBeerMap = []

# création de l'instace de l'API overpass
api = overpy.Overpass()

# zone dans laquelle rechercher
bbox = (48.658291, 2.086790, 49.046940, 2.637910)  # Paris

# stockages des résultats pour trier plus facilement ensuite
bars = api.query(str("node{0}[amenity=bar];out;".format(bbox)))
pubs = api.query(str("node{0}[amenity=pub];out;".format(bbox)))
brasseries_art = api.query(str("node{0}[craft=brewery];out;".format(bbox)))

# quelques petites stats
print(len(bars.nodes))
print(len(pubs.nodes))
print(len(brasseries_art.nodes))

x = 1

# liste des bars où la bière est précisée
for node in bars.nodes:
    if 'brewery' in node.tags.keys():
        x += 1
        #
        if node.tags.get('microbrewery') == 'yes':
            ownBrew = 'Oui'
        else:
            ownBrew = 'Non'

        # on liste les bières répertoriées
        str_kindBeers = node.tags.get('brewery')
        li_kindBeers = str_kindBeers.split(";")
        li_kindBeers = map(lambda x: x.capitalize(), li_kindBeers)

        # création de l'objet géographique
        point = Point((round(node.lon, 4), round(node.lat, 4)))
        obj = Feature(geometry=point,
                      id=x,
                      properties={"NAME": node.tags.get('name'),
                                  "TYPE": node.tags.get('amenity'),
                                  "BEERS": sorted(li_kindBeers),
                                  "BREWER": ownBrew,
                                  "OSM_ID": node.id
                                  })

        li_openBeerMap.append(obj)
    else:
        pass

# liste des pubs où la bière est précisée
for node in pubs.nodes:
    if 'brewery' in node.tags.keys():
        x += 1
        #
        if node.tags.get('microbrewery') == 'yes':
            ownBrew = 'Oui'
        else:
            ownBrew = 'Non'

        # on liste les bières répertoriées
        str_kindBeers = node.tags.get('brewery')
        li_kindBeers = str_kindBeers.split(";")
        li_kindBeers = map(lambda x: x.capitalize(), li_kindBeers)

        # création de l'objet géographique
        point = Point((round(node.lon, 4), round(node.lat, 4)))
        obj = Feature(geometry=point,
                      id=x,
                      properties={"NAME": node.tags.get('name'),
                                  "TYPE": node.tags.get('amenity'),
                                  "BEERS": sorted(li_kindBeers),
                                  "BREWER": ownBrew,
                                  "OSM_ID": node.id
                                  })

        li_openBeerMap.append(obj)
    else:
        pass


# liste des pubs où la bière est précisée
for node in brasseries_art.nodes:
    if 'brewery' in node.tags.keys():
        x += 1
        #
        if node.tags.get('microbrewery') == 'yes':
            ownBrew = 'Oui'
        else:
            ownBrew = 'Non'

        # on liste les bières répertoriées
        str_kindBeers = node.tags.get('brewery')
        li_kindBeers = str_kindBeers.split(";")
        li_kindBeers = map(lambda x: x.capitalize(), li_kindBeers)

        # création de l'objet géographique
        point = Point((round(node.lon, 4), round(node.lat, 4)))
        obj = Feature(geometry=point,
                      id=x,
                      properties={"NAME": node.tags.get('name'),
                                  "TYPE": 'Brasserie',
                                  "BEERS": sorted(li_kindBeers),
                                  "BREWER": ownBrew,
                                  "OSM_ID": node.id
                                  })

        li_openBeerMap.append(obj)
    else:
        pass


# sérialisation
featColl = FeatureCollection(li_openBeerMap)

with open("../OpenBeerMap_IDF.geojson", "w") as outfile:
    dump(featColl, outfile, sort_keys=True)


###############################################################################
###### Stand alone program ########
###################################

# if __name__ == '__main__':
#     """ standalone execution """
