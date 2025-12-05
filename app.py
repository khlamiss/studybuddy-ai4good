# app.py - Backend Flask pour StudyBuddy
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import random

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Base de questions étendue
QUESTIONS = {
    "maths": [
        {
            "question": "Si j'ai 5 pommes et que j'en donne 2, combien me reste-t-il ?",
            "answers": [
                {"text": "3", "correct": True, "funny": "Exact ! Maintenant, partage-les avec Buddy ! 🍎"},
                {"text": "7", "correct": False, "funny": "7 ? Tu as des pommes magiques ? 🧙‍♂️"},
                {"text": "2", "correct": False, "funny": "Presque ! Recalcule doucement... 🐢"},
                {"text": "Je préfère les bananes 🍌", "correct": False, "funny": "Moi aussi ! Mais c'est pas la réponse ! 😂"}
            ],
            "explanation": "5 - 2 = 3 ! Les maths, c'est comme compter tes snacks préférés !",
            "difficulty": 1
        }
    ]
}

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/api/questions/<subject>')
def get_questions(subject):
    if subject in QUESTIONS:
        questions = QUESTIONS[subject].copy()
        random.shuffle(questions)
        return jsonify(questions[:5])  # Retourne 5 questions max
    return jsonify([])

@app.route('/api/analyze-performance', methods=['POST'])
def analyze_performance():
    data = request.json
    score = data.get('score', 0)
    correct = data.get('correct', 0)
    total = data.get('total', 1)
    
    percentage = (correct / total) * 100 if total > 0 else 0
    
    feedback = ""
    if percentage >= 90:
        feedback = "🌟 INCROYABLE ! Tu es un super-génie !"
    elif percentage >= 70:
        feedback = "🚀 EXCELLENT ! Tu maîtrises le sujet !"
    elif percentage >= 50:
        feedback = "👍 BIEN JOUÉ ! Continue comme ça !"
    else:
        feedback = "💪 COURAGE ! Chaque erreur te rend plus fort !"
    
    return jsonify({
        "percentage": round(percentage),
        "feedback": feedback,
        "level_up": percentage >= 80,
        "fun_fact": "Le cerveau apprend mieux après une bonne nuit de sommeil ! 😴"
    })

@app.route('/api/get-fun-fact')
def get_fun_fact():
    facts = [
        "Savais-tu que ton cerveau peut générer assez d'électricité pour alimenter une ampoule ? 💡",
        "Les neurones dans ton cerveau forment plus de connexions qu'il y a d'étoiles dans la galaxie ! 🌌",
        "Rire pendant qu'on apprend aide à mieux mémoriser ! 😄",
        "Faire des pauses régulières améliore la concentration de 30% ! ⏰"
    ]
    return jsonify({"fact": random.choice(facts)})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '').lower()
    
    responses = {
        "salut": "Hey ! Prêt à apprendre en t'amusant ? 😎",
        "aide": "Je peux t'aider avec les maths, les sciences, le français et l'histoire !",
        "blague": "Pourquoi le livre de maths était-il triste ? Parce qu'il avait trop de problèmes ! 😂",
        "merci": "De rien ! Tu es super, continue comme ça ! ✨",
        "fatigue": "Prends une pause ! Ton cerveau a besoin de repos pour mieux apprendre. 🛌"
    }
    
    response = responses.get(message, "Je ne comprends pas tout, mais je suis là pour t'aider à réviser ! 💪")
    
    return jsonify({
        "response": response,
        "mood": random.choice(["😊", "🤖", "🧠", "🎮"])
    })

if __name__ == '__main__':
    print("=== StudyBuddy AI4GOOD ===")
    print("Serveur démarré sur: http://127.0.0.1:5000")
    print("===========================")
    app.run(debug=True, port=5000)