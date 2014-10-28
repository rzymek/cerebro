#!/bin/bash

export MONGO_URL="mongodb://127.0.0.1:27017/meteor"
export ROOT_URL="http://54.191.116.59"
export NODE_ENV="production"
export PORT="80"
export METEOR_SETTINGS="$(cat config/master/settings.json)"
