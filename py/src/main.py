#! /bin/python

from __future__ import division

import json

from flask import Flask, request

from heightfinder import HeightFinder

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/heightmap/', methods=['POST', ])
def get_heights():
    data = json.loads(request.body)
    centre = data.get('centre')
    paths = data.get('paths')
    hf = HeightFinder(centre, paths)
    return 'OK'




if '__main__' == __name__:
    app.run()
