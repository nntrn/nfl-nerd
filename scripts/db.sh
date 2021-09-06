#!/usr/bin/env bash

TODAY="$(date +"%Y-%m-%d")"
SEASON=$(date +%Y)

DBPATH=./tmp/nfldb.db
mkdir -p $(dirname $DBPATH)
SEASONCSVPATH=${1:-./tmp/$TODAY/$SEASON-PLAYBYPLAYS.csv}

# Set season to last year if month is before June
if [[ $(date +%m | sed 's/^0*//') -lt 6 ]]; then
  SEASON=$((SEASON - 1))
fi

if [[ -f $DBPATH ]]; then
  echo "Backing up old $DBPATH to $DBPATH.bkp"
  mv $DBPATH $DBPATH.bkp
fi

if [[ -f $SEASONCSVPATH ]]; then
  sqlite3 $DBPATH <<EOF
.mode csv
.headers on
.import $SEASONCSVPATH plays
.save $DBPATH
EOF
fi
