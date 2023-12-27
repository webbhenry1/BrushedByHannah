from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_mysqldb import MySQL
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  


# Configure MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'Master'   
app.config['MYSQL_PASSWORD'] = 'Milokitty123'  
app.config['MYSQL_DB'] = 'bbhDB' 

# Configure Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'bbhsender@gmail.com'  
app.config['MAIL_PASSWORD'] = 'nxva swra sfuk blks' 
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)
mysql = MySQL(app)

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


@app.route('/api/availability/<date>')
def get_availability(date):
    cur = mysql.connection.cursor()
    cur.execute("SELECT startTime, endTime, isBooked FROM Availability WHERE date = %s", [date])
    availability = cur.fetchall()
    cur.close()
    return jsonify(availability)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

