#!/usr/bin/env bash
trap 'kill $(jobs -p)' EXIT
./node_modules/.bin/webpack-dev-server --config ./webpack.client.js &
./node_modules/.bin/webpack-dev-server --config ./webpack.server.js &
wait