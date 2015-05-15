# -*- coding: UTF-8 -*-
#!/usr/bin/env python3.4
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
from openpyxl import load_workbook
from geopy.geocoders import Nominatim
from geojson import dump, Feature, FeatureCollection, Point

# Custom modules


###############################################################################
########### Main program ##########
###################################

geolocator = Nominatim(timeout=60)

# PARTICIPANTS

# Structure attendue ##################################
# col_idx   col_name        description
# 0         ID
# 1         NOM
# 2         TYPE
# 3         DESCR_FR
# 4         DESCR_EN
# 5         WEBSITE
# 6         ADR_NUM
# 7         ADR_CMPLT
# 8         ADR_TYP
# 9         ADR_LIB
# 10        ADR_CP
# 11        ADR_CITY
# 12        ADR_COUNTRY
# 13        ADR_CONCAT
# 14        TEL
# 15        OSM_URL
# 16        GMAPS_URL
# 17        ed_01_2014
# 18        ed_02_2015
# 19        ed14_URL_FR
# 20        ed15_URL_FR
# 21        ed15_URL_EN
# 22        URL_FB
# 23        URL_TWITTER
# 24        URL_GPLUS
# 25        URL_THUMB
# 26        x_longitude
# 27        y_latitude
# 28        LI_ID_EVT

# /Structure attendue ##################################

# liste pour stocker les objets
li_objs = []

# ouverture du fichier en lecture
wb = load_workbook(filename='ParisBeerWeek_participants.xlsx',
                   read_only=True,
                   # guess_types=True,
                   data_only=True,
                   use_iterators=True)

# noms des onglets
# print(wb.get_sheet_names())

ws = wb.worksheets[0]  # ws = première feuille

row_count = ws.get_highest_row() - 1
column_count = ws.get_highest_column() + 1

print(row_count)
print(column_count)


for row in ws.iter_rows(row_offset=1):
    # for cell in row:
    #     if cell.value:
    #             try:
    #                 print(cell.value)
    #             except UnicodeEncodeError:
    #                 print(cell.value.encode("utf8"))
    #     else:
    #         pass
    # try:
    #     print(row[1].value)
    # except UnicodeEncodeError:
    #     print(row[1].value.encode("utf8"))

    # extraire l'adresse
    nom = row[1].value
    libelle = str(row[6].value) + " " + row[8].value +  " " + row[9].value
    ville = row[11].value
    addr = nom + ", " + ville + ", France"
    addr2 = row[13].value
    addr3 = nom + ", France"

    # géocoder
    geolocator = Nominatim(timeout=60)
    location = geolocator.geocode(addr)

    # tester si un résultat a été renvoyé et dégrader la précision
    if not location:
        addr = addr2
        location = geolocator.geocode(addr)
    else:
        pass

    # 2ème niveau de vérification
    if not location:
        addr = addr3
        location = geolocator.geocode(addr)
    else:
        pass

    # on print histoire de montrer ce que l'on a trouvé
    try:
        print("adresse tentée : " + addr)
        print(location.address)
        print((location.latitude, location.longitude))
    except UnicodeEncodeError:
        print(addr.encode("UTF-8"))
        print(location.address.encode("utf8"))
        print((location.latitude, location.longitude))



    # début sérialisation
    point = Point((location.longitude, location.latitude))
    obj = Feature(geometry=point,
                  id=row[0].value,
                  properties={"ADR_COUNTRY": row[12].value, 
                              "NAME": nom,
                              "ADDRESS": addr,
                              "DESCR_FR": row[3].value,
                              })
    li_objs.append(obj)


# sérialisation
featColl = FeatureCollection(li_objs)


with open("../ParisBeerWeek_participants.geojson", "w") as outfile:
    dump(featColl, outfile, sort_keys=True)

###############################################################################
###### Stand alone program ########
###################################

# if __name__ == '__main__':
#     """ standalone execution """
