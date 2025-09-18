#!/bin/sh

sed -i 's|http://localhost:4200|https://nonprod.cosmicevents.app|g' ./dist/web/browser/index.html

exec "$@"
