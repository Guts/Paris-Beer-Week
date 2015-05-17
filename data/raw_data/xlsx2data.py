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
import datetime
import calendar

# Python 3 backported

# 3rd party libraries
from openpyxl import load_workbook
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from geojson import dump, Feature, FeatureCollection, Point

# Custom modules

###############################################################################
########### Main program ##########
###################################

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

# ouverture du fichier des participants en lecture
wb = load_workbook(filename='ParisBeerWeek_participants.xlsx',
                   read_only=True,
                   guess_types=True,
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
    # extraire l'adresse
    nom = row[1].value
    libelle = str(row[6].value) + " " + row[8].value + " " + row[9].value
    ville = row[11].value
    addr = nom + ", " + ville + ", France"
    addr2 = row[13].value
    addr3 = nom + ", France"

    # géocoder
    geolocator = Nominatim(timeout=80)
    try:
        location = geolocator.geocode(addr)
    except GeocoderTimedOut:
        print('TimeOut: Try Again')
        continue

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
        # print("adresse tentée : " + addr)
        print(location.address)
        print((location.latitude, location.longitude))
    except UnicodeEncodeError:
        # print(addr.encode("UTF-8"))
        print(location.address.encode("utf8"))
        print((location.latitude, location.longitude))

    # extraction d'informations pour plus facilité
    if row[14].value:
        tel = row[14].value
    else:
        tel = "NR"

    # stockage dans des objets en vue de la sérialisation
    point = Point((location.longitude, location.latitude))
    obj = Feature(geometry=point,
                  id=row[0].value,
                  properties={"ADR_COUNTRY": row[12].value,
                              "NAME": nom,
                              "TYPE": row[2].value,
                              "DESCR_FR": row[3].value,
                              "DESCR_EN": row[4].value,
                              "ADDRESS": addr,
                              "TEL": tel,
                              "WEBSITE": row[5].value,
                              "FACEBOOK": row[22].value,
                              "TWITTER": row[23].value,
                              "PBW_2015_FR": row[20].value,
                              "PBW_2015_EN": row[21].value,
                              "THUMBNAIL": row[25].value,
                              "OSM": row[15].value,
                              "GMAPS": row[16].value
                              })
    li_objs.append(obj)


# sérialisation en GeoJSON
featColl = FeatureCollection(li_objs)
with open("../ParisBeerWeek_participants.geojson", "w") as outfile:
    dump(featColl, outfile, sort_keys=True)

############################### EVENEMENTS 

# Structure attendue ##################################
# col_idx   col_name        description
# 0         ID
# 1         EVT_NOM
# 2         TYPE
# 3         DESCR_FR
# 4         DESCR_EN
# 5         ADR_ID
# 6         ADR_NOM
# 7         ADR_PARTIC
# 8         ADR_NUM
# 9         ADR_COMPL
# 10        ADR_TYP
# 11        ADR_LIB
# 12        ADR_CP
# 13        ADR_CITY
# 14        ADR_COUNTRY
# 15        ADR_CONCAT
# 16        ADR_IMG
# 17        DATE_INIT
# 18        DDAY
# 19        TIME_START
# 20        TIME_END
# 21        DTIME_START
# 22        DTIME_END
# 23        DUREE
# 24        OSM_URL
# 25        GMAPS_URL
# 26        DDAY_URL_FR
# 27        DDAY_URL_EN
# 28        LI_ID_PART
# 29        ED_YEAR
# 30        X_LONGITUDE
# 31        Y_LATITUDE


# liste pour stocker les objets
li_objs = []

# ouverture du fichier des participants en lecture
wb = load_workbook(filename='ParisBeerWeek_evenements.xlsx',
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
    # extraire l'adresse
    nom = row[6].value
    if row[13].value:
        ville = row[13].value
        addr = nom + ", " + ville + ", France"
        addr2 = row[15].value
        addr3 = nom + ", France"
    else:
        addr = nom + ", Île-de-France, France"
        addr2 = nom + ", France"
        addr3 = nom + ", France"

    # géocoder
    geolocator = Nominatim(timeout=80)
    try:
        location = geolocator.geocode(addr)
    except GeocoderTimedOut:
        print('TimeOut: Try Again')
        continue

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

    # 3ème niveau de vérification
    if not location:
        print('Not found: ' + addr)

    # on print histoire de montrer ce que l'on a trouvé
    try:
        print(location.address)
        print((location.latitude, location.longitude))
    except UnicodeEncodeError:
        print(location.address.encode("utf8"))
        print((location.latitude, location.longitude))

    # date et horaires de l'événement
    # 18        DDAY
# 19        TIME_START
# 20        TIME_END
# 21        DTIME_START
# 22        DTIME_END
# 23        DUREE
    # if row[18].value:
    #     tel = row[14].value
    # else:
    #     tel = "NR"
    evt_start = row[21].value
    print(type(evt_start))
    print(evt_start.year)



    # stockage dans des objets en vue de la sérialisation
    point = Point((location.longitude, location.latitude))
    obj = Feature(geometry=point,
                  id=row[0].value,
                  properties={"ADR_COUNTRY": row[12].value,
                              "NAME": row[1].value,
                              "TYPE": row[2].value,
                              "DESCR_FR": row[3].value,
                              "DESCR_EN": row[4].value,
                              "ADDRESS": addr,
                              "EVT_START": "row[21].value",
                              "EVT_END": "row[22].value",
                              "EVT_DUR": "row[23].value",
                              "PBW_DAY_2015_FR": row[27].value,
                              "PBW_DAY_2015_EN": row[28].value,
                              "THUMBNAIL": row[16].value,
                              "OSM": row[25].value,
                              "GMAPS": row[26].value
                              })
    li_objs.append(obj)


# sérialisation en GeoJSON
featColl = FeatureCollection(li_objs)
with open("../ParisBeerWeek_evenements.geojson", "w") as outfile:
    dump(featColl, outfile, sort_keys=True)


###############################################################################
###### Stand alone program ########
###################################

# if __name__ == '__main__':
#     """ standalone execution """
