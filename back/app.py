import boto3
from botocore.config import Config
from flask import Flask, render_template, jsonify, request

from config import load_env_variables

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html', name="index")


@app.route('/sign-s3', methods=['POST'])
def sign_s3():
    # Load necessary information into the application
    S3_BUCKET = "cosmin-photos-test"

    # Load required data from the request
    data = request.json

    # Initialise the S3 client
    s3 = boto3.client('s3', config=Config(signature_version='s3v4'))

    signed_urls = dict()
    for k, v in data.items():
        presigned_url = s3.generate_presigned_url(
            ClientMethod='put_object',
            Params={
                'Bucket': S3_BUCKET,
                'Key': v.get('filename'),
                'ContentType': v.get('filetype')
            }
        )
        signed_urls[k] = presigned_url

    # Return the data to the client
    return jsonify(signed_urls)


if __name__ == '__main__':
    load_env_variables()
    app.run()
