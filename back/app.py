import json
import os

import boto3
from botocore.config import Config
from flask import Flask, render_template, jsonify, request, Response
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors=CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def load_env_variables():
    """
        Load variables from config.env
    """
    basedir = os.path.abspath(os.path.dirname(__file__))
    baseconf = os.path.join(basedir, 'config.env')
    if os.path.exists(baseconf):
        print('Importing environment from .env file {}'.format(os.path.abspath(baseconf)))
        for line in open(baseconf):
            var = line.strip().split('=')
            if len(var) == 2:
                os.environ[var[0].strip()] = var[1].strip().replace("\"", "")


@app.route('/')
def hello_world():
    return render_template('index.html', name="index")


@app.route('/sign-s3', methods=['POST'])
@cross_origin()
def sign_s3():
    # Load necessary information into the application
    S3_BUCKET = "cosmin-photos-test"

    # Load required data from the request
    data = request.json

    # Initialise the S3 client
    s3 = boto3.client('s3', config=Config(signature_version='s3v4'))

    signed_url = s3.generate_presigned_url(
        ClientMethod='put_object',
        Params={
            'Bucket': S3_BUCKET,
            'Key': data.get('filename'),
            'ContentType': data.get('filetype')
        }
    )

    # Return the data to the client
    return jsonify(signed_url)


@app.route('/save/<photo_name>', methods=['POST'])
def save_image(photo_name):
    return Response(json.dumps({"name": photo_name}), status=200, mimetype="application/json")


if __name__ == '__main__':
    load_env_variables()
    app.run()
