from flask import Flask, request, jsonify, send_from_directory, render_template
import os
import json
from PIL import Image
from PIL.ExifTags import TAGS
from datetime import datetime
import pytz
import uuid
import vision_request_mod1 as vision
app = Flask(__name__)

def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response



def get_utc_minus_5_time():
    # Define the timezone for UTC-5
    utc_minus_5 = pytz.timezone('Etc/GMT+5')  # 'Etc/GMT+5' is equivalent to UTC-5

    # Get the current time in UTC
    utc_now = datetime.now(pytz.utc)

    # Convert the current UTC time to UTC-5
    utc_minus_5_now = utc_now.astimezone(utc_minus_5)

    # Format the time in the desired format
    formatted_time = utc_minus_5_now.strftime("%m/%d/%Y %H:%M:%S")
    return formatted_time

def print_image_metadata(file_path):
    try:
        image = Image.open(file_path)
        exif_data = image._getexif()
        
        if exif_data:
            print("Metadata for", file_path)
            for tag, value in exif_data.items():
                tag_name = TAGS.get(tag, tag)
                print(f"{tag_name}: {value}")
        else:
            print("No EXIF metadata found for", file_path)
    except Exception as e:
        print(f"Error reading metadata for {file_path}: {e}")


@app.route('/analisis', methods=['POST', 'OPTIONS'])
def analisis():
    if request.method == 'OPTIONS':
        return add_cors_headers(jsonify({"message": "CORS options"}))

    if request.method == 'POST':
        # Imprime los parámetros de la URL
        calidad_foto = request.args.get('calidadFoto')
        marcas_presentes = request.args.get('marcasPresentes')

        print(calidad_foto, marcas_presentes)
        
        if 'file' not in request.files:
            return add_cors_headers(jsonify({"error": "No file part in the request"})), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return add_cors_headers(jsonify({"error": "No selected file"})), 400
        
        if file:
            # Genera un nombre único para el archivo
            filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
            upload_path = os.path.join('./uploads', filename)
            
            # Guarda el archivo temporalmente
            file.save(upload_path)
            
            # Ajusta la calidad de la imagen
            quality = 100 - int(calidad_foto)
            with Image.open(upload_path) as img:
                img.save(upload_path, quality=quality)
            
            # Imprime la metadata de la imagen
            print_image_metadata(upload_path)

            prompt = "necesito que hagas un análisis de la visibilidad de los productos correspondiente a las marcas y me digas si hay una buena visibilidad de los productos para cada una de las marcas. Deberás entregar un número del 1 al 100 correspondiente al nivel de visibilidad correcto de los productos, además deberas entregar un numero del 1 al 100 para determinar la calidad de la imagen. Deberás identificar también la cantidad de productos en la imagen. Haz una evaluacion de toda la foto, no de cada marca individualmente, pero en el único comentario, da feedback para cada marca. Además entrega un pequeño análisis de la foto como para que el comerciante pueda tener feedback. Si la foto no está relacionada a productos comerciales, menciónalo en el comentario. LA RESPUESTA QUE ENTREGUES TIENE QUE SEGUIR LA SIGUIENTE ESTRUCTURA DE MANERA OBLIGATORIA, SIN NINGUNA OTRA ADICION. {\"puntaje \": 90, \"productos\": N, \"calidad\":X, \"description\": comentario}  Entrega solamente 1 un string en formato json que pueda usar con la funcion json.loads()"

            result = vision.ask_gpt(upload_path, prompt)
            print("RAW", result)

            result = json.loads(result)
            

            result['id'] = 1
            result['georef'] = {"lat": "-12.101884262734925", "lng":"-77.0445747954727"}
            result['puntaje'] = int(result['puntaje'])
            result['productos'] = int(result['productos'])
            result['calidad'] = int(result['calidad'])

            result['hora'] = get_utc_minus_5_time()

            print(result)

            response = jsonify({'results': result})
            return add_cors_headers(response)
        else:
            return add_cors_headers(jsonify({"error": "No file data in request"})), 400



@app.route('/canal', methods=['POST', 'OPTIONS', 'GET'])
def canal():
    # LLAMADA A BD 
    canal = [
                {
                "id": 1,
                "canal": "Tienda"
                }, {
                "id": 2,
                "canal": "Mercado"
                }, {
                "id": 3,
                "canal": "Super Mercado"
                }
            ]


    canal_ = {"results" : canal}

    if request.method in ['OPTIONS', 'GET']:
        print("a")
        return add_cors_headers(jsonify(canal_))

    data = request.get_json()
    print("Data recibida en /canal:", data)
    response = jsonify({"received": data})
    return add_cors_headers(response)



@app.route('/tienda', methods=['POST', 'OPTIONS', 'GET'])
def tienda():
    # LLAMADA A BD 
    canal = [
                {"id":1,"tienda":"MASS"},
                {"id":2,"tienda":"Don Pepe"},
                {"id":3,"tienda":"Bodega María"}
            ]


    canal_ = {"results" : canal}

    if request.method in ['OPTIONS', 'GET']:
        print("a")
        return add_cors_headers(jsonify(canal_))

    data = request.get_json()
    print("Data recibida en /canal:", data)
    response = jsonify({"received": data})
    return add_cors_headers(response)


@app.route('/')
def home():
    return send_from_directory(os.getcwd(),'desktop.html')

@app.route('/fabricante', methods=['POST', 'OPTIONS', 'GET'])
def fabricante():
    # LLAMADA A BD 
    canal = [
                {
                "id": 1,
                "fabricante": "P&G"
                }, {
                "id": 2,
                "fabricante": "Kuhn and Sons"
                }, {
                "id": 3,
                "fabricante": "Hintz, Metz and Wiegand"
                }
            ]


    canal_ = {"results" : canal}

    if request.method in ['OPTIONS', 'GET']:
        print("a")
        return add_cors_headers(jsonify(canal_))

    data = request.get_json()
    print("Data recibida en /canal:", data)
    response = jsonify({"received": data})
    return add_cors_headers(response)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)