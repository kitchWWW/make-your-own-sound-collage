print("hello?")
from waitress import serve
print("hello? 1")
from flask import Flask, request, send_file, send_from_directory
print("hello? 2")
from flask_cors import CORS
print("hello? 3")
import time
import threading
import os
print("hello? 4")
# import processing  # Import the processing module
print("hello? 5")

app = Flask(__name__)
CORS(app)

def current_milli_time():
    return str(round(time.time() * 1000))

def testIt(arg):
    print("hello!!!!")

def run_process(filename):
    # Call the process function from processing.py in a separate thread
    thread = threading.Thread(target=testIt, args=(filename,))
    thread.start()

@app.route('/sound-collage/test')
def serve_static_files(filename):
    return "hello, world"
    return send_from_directory(os.getcwd(), filename)

# @app.route('/sound-collage/<path:filename>')
# def serve_static_files(filename):
#     return send_from_directory(os.getcwd(), filename)

@app.route('/sound-collage/upload_audio', methods=['POST'])
def upload_audio():
    print("yeeet")
    if 'audio' not in request.files:
        return 'No audio file provided', 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        return 'No selected file', 400

    file_prefix = current_milli_time()
    file_name = 'uploads/'+file_prefix+'_in.ogg'
    audio_file.save(file_name)  # Save the audio file locally
    run_process(file_name)
    
    return file_prefix, 200

if __name__ == '__main__':
    print("running!")
    serve(app, host="0.0.0.0", port=3008)
