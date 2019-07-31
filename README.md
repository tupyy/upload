A proof of concept react app to upload files directly to AWS S3. 

## Frontend

The front is made with ReactJS using redux for state management. The upload services are written in pure js without any additional libraries like axios. just plain old XMLHttpRequest. The upload service will perform three actions:
  - ask the back to sign the url for S3. This url is required by S3 to allow on any private buckets
  - upload the photo to bucket
  - tell to the backend that upload was ok and the entry can be writted in database

Basic operations are available: stop/start the upload. If the upload was not started then the user can remove the photo from the list, otherwise the `Delete` button is bind to `stop upload` action.

There is a global progress bar and a progress bar for each upload. 

## Backend

A simple Python/Flask app.
