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
from calendar import timegm
from datetime import datetime
import locale
from time import mktime

# Python 3 backported

# 3rd party libraries
from openpyxl import load_workbook
from geojson import dump, Feature, FeatureCollection, Point
import pytz

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
# 28        X_NOMINATIM
# 29        Y_NOMINATIM
# 30        LI_ID_EVT

# /Structure attendue ##################################

# liste pour stocker les objets
li_objs = []

# ouverture du fichier des participants en lecture
wb = load_workbook(filename='ParisBeerWeek_participants.xlsx',
                   read_only=True,
                   guess_types=True,
                   data_only=True,
                   use_iterators=True
                   )

# noms des onglets
# print(wb.get_sheet_names())

ws = wb.worksheets[0]  # ws = première feuille

row_count = ws.get_highest_row() - 1
column_count = ws.get_highest_column() + 1

print(row_count)
print(column_count)

for row in ws.iter_rows(row_offset=1):
    # extraire le nom
    nom = row[1].value

    # vérification qu'il s'agit bien d'une ligne remplie
    if not nom:
        print('\nFin du tableau')
        break
    else:
        pass

    # si l'adresse n'est pas renseignée, on s'arrache
    if not row[26].value and not row[27].value:
        print('\nCoordinates NR, use Geocoder before')
        continue
    else:
        pass

    # extraire l'adresse
    # libelle = str(row[6].value) + " " + row[8].value + " " + row[9].value
    # ville = row[11].value
    # addr = nom + ", " + ville + ", France"
    addr = row[13].value

    # extraction des coordonnées
    longitude = row[26].value
    latitude = row[27].value

    # extraction du téléphone
    if row[14].value:
        tel = row[14].value
    else:
        tel = "NR"

    # stockage dans des objets en vue de la sérialisation
    point = Point((longitude, latitude))
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
# 18        DDAY_START
# 19        TIME_START
# 20        DDAY_END
# 21        TIME_END
# 22        DTIME_START
# 23        DTIME_END
# 24        DUREE
# 25        OSM_URL
# 26        GMAPS_URL
# 27        DDAY_URL_FR
# 28        DDAY_URL_EN
# 29        LI_ID_PART
# 30        ED_YEAR
# 31        X_LONGITUDE
# 32        Y_LATITUDE
# 33        X_NOMINATIM
# 34        Y_NOMINATIM


# liste pour stocker les objets
li_objs = []

# ouverture du fichier des participants en lecture
wb = load_workbook(filename='ParisBeerWeek_evenements.xlsx',
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

x = 1

for row in ws.iter_rows(row_offset=1):
    # extraire l'adresse
    nom = row[6].value

    # vérification qu'il s'agit bien d'une ligne remplie
    if not nom:
        print('\nFin du tableau')
        break
    else:
        pass

    # si l'adresse n'est pas renseignée, on s'arrache
    if not row[31].value and not row[32].value:
        print('\nCoordinates NR, use Geocoder before')
        continue
    else:
        pass

    # extraire l'adresse
    if row[13].value:
        addr = nom + ", " + row[15].value
    else:
        addr = nom + ", Île-de-France, France"

    # date et horaires de l'événement
    paris_tz = pytz.timezone("Europe/Paris")  # fuseau horaire parisien

    locale.setlocale(locale.LC_ALL, '')

    # date et heure de début
    evt_start_input = datetime.strptime(row[22].value, "%d/%m/%Y %H:%M:%S")
    evt_start_input = paris_tz.localize(evt_start_input)
    evt_start_epc = timegm(evt_start_input.timetuple())
    evt_start_txt = evt_start_input.strftime('%A %d %B %Y à %H:%M'.encode('UTF-8'))
    evt_day_txt = evt_start_input.strftime('%A %d %B %Y'.encode('UTF-8'))
    evt_start_time_txt = evt_start_input.strftime('%H:%M'.encode('UTF-8'))
    startDate = evt_start_input.strftime('%d/%m/%Y %H:%M'.encode('UTF-8'))

    # date et heure de fin
    evt_end_input = datetime.strptime(row[23].value, "%d/%m/%Y %H:%M:%S")
    evt_end_input = paris_tz.localize(evt_end_input)
    evt_end_epc = timegm(evt_end_input.timetuple())
    evt_end_txt = evt_end_input.strftime('%A %d %B %Y à %H:%M'.encode('UTF-8'))
    evt_end_time_txt = evt_end_input.strftime('%H:%M'.encode('UTF-8'))
    endDate = evt_end_input.strftime('%d/%m/%Y %H:%M'.encode('UTF-8'))

    # extraction des coordonnées
    longitude = row[31].value
    latitude = row[32].value

    # stockage dans des objets en vue de la sérialisation
    point = Point((longitude, latitude))
    obj = Feature(geometry=point,
                  id=x,
                  properties={"NAME": row[1].value,
                              "DESCR_FR": row[3].value,
                              "DESCR_EN": row[4].value,
                              "ADDRESS": addr,
                              "EVT_START_TXT": evt_start_txt,
                              "EVT_START_EPC": evt_start_epc,
                              "startDate": startDate,
                              "EVT_START_TIME": evt_start_time_txt,
                              "EVT_END_TXT": evt_end_txt,
                              "EVT_END_EPC": evt_end_epc,
                              "endDate": endDate,
                              "EVT_END_TIME": evt_end_time_txt,
                              "EVT_DDAY": evt_day_txt,
                              "PBW_DAY_2015_FR": row[27].value,
                              "PBW_DAY_2015_EN": row[28].value,
                              "OSM": row[25].value,
                              "GMAPS": row[26].value
                              })
    li_objs.append(obj)

    # increment ID
    x += 1


# sérialisation en GeoJSON
featColl = FeatureCollection(li_objs)
with open("../ParisBeerWeek_evenements.geojson", "w") as outfile:
    dump(featColl, outfile, sort_keys=True)


###############################################################################
###### Stand alone program ########
###################################

# if __name__ == '__main__':
#     """ standalone execution """
