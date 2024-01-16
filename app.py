from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
from datetime import timedelta
import json
import pymysql

app = Flask(__name__)
CORS(app)  

# Configure MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'Master'
app.config['MYSQL_PASSWORD'] = 'Milokitty123'
app.config['MYSQL_DB'] = 'BrushedByHannahDB'

# Configure Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'bbhsender@gmail.com'
app.config['MAIL_PASSWORD'] = 'nxva swra sfuk blks'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

# Connect to MySQL Database
def get_mysql_connection():
    return pymysql.connect(host=app.config['MYSQL_HOST'],
            user=app.config['MYSQL_USER'],
            password=app.config['MYSQL_PASSWORD'],
            db=app.config['MYSQL_DB'],
            cursorclass=pymysql.cursors.DictCursor)


@app.route('/send_message', methods=['POST'])
def send_message():
    try:
        data = request.get_json()
        name = data['firstName']
        email = data['email']
        message = data['message']

        subject = f'New Message from {name} <{email}>'
        msg = Message(subject,
                      sender=email,
                      recipients=['brushedbyhannah@gmail.com'])
        msg.body = message
        mail.send(msg)
        return jsonify({'status': 'Message sent'})
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'status': 'Error', 'message': str(e)}), 500


@app.route('/api/availability/<date>', methods=['GET'])
def get_availability(date):
    conn = get_mysql_connection()
    try:
        with conn.cursor() as cur:
            result = cur.execute("SELECT availableStartTime, availableEndTime FROM TimeSlots WHERE date = %s", [date])
            if result > 0:
                availability = cur.fetchall()
                # Convert timedelta objects to a serializable format, e.g., string
                for slot in availability:
                    if isinstance(slot['availableStartTime'], timedelta):
                        slot['availableStartTime'] = str(slot['availableStartTime'])
                    if isinstance(slot['availableEndTime'],timedelta):
                        slot['availableEndTime'] = str(slot['availableEndTime'])
                        return jsonify(availability)
                    else:
                        # Instead of returning a 404 error, return an empty list with 200 OK status.
                        return jsonify({"message": "No available times", "availableSlots": []})
    finally:
        conn.close()



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

