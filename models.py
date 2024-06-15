from flask import request, jsonify, render_template, session
from werkzeug.security import generate_password_hash, check_password_hash
from init import app,db

# Database model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

class Goal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    goal_name = db.Column(db.String(150), nullable=False)
    due_date = db.Column(db.String(150), nullable=False)
    priority_level = db.Column(db.String(50), nullable=False)
    goal_category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    tree_selected = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tasks = db.relationship('Task', backref='goal', lazy=True, cascade="all, delete-orphan")

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(150), nullable=False)
    text = db.Column(db.String(500), nullable=False)
    goal_id = db.Column(db.Integer, db.ForeignKey('goal.id'), nullable=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        session['user_email'] = user.email
        return jsonify(success=True), 200
    else:
        return jsonify(success=False, message="Invalid email address and/or password."), 401

@app.route('/register', methods=['POST'])
def register():
    email = request.form.get('email')
    password = request.form.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify(success=False, message="Email already registered."), 409

    new_user = User(email=email, password=generate_password_hash(password, method='pbkdf2'))
    db.session.add(new_user)
    db.session.commit()
    session['user_email'] = new_user.email
    return jsonify(success=True), 200

@app.route('/home')
def home():
    # Retrieve the user from the session
    try:
        email = session.get('user_email')
        if not email:
            return "User not logged in", 401

        user = User.query.filter_by(email=email).first()
        if not user:
            return "User not found", 404

        goals = Goal.query.filter_by(user_id=user.id).all()

        return render_template('home.html', goals=goals)
    
    except Exception as e:
        print("Error:", e)
        return "An error occurred while fetching goals"

@app.route('/save_goal', methods=['POST'])
def save_goal():
    try:
        data = request.get_json()
        email = session.get('user_email')

        if not email:
            return jsonify(success=False, message="User not logged in."), 401
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify(success=False, message="User not found."), 404

        goal_name = data['goalName']
        due_date = data['dueDate']
        priority_level = data['priorityLevel']
        goal_category = data['goalCategory']
        description = data['description']
        tree_selected = data['treeSelected']
        tasks_data = data['tasks']

        new_goal = Goal(
            user_id=user.id,
            goal_name=goal_name,
            due_date=due_date,
            priority_level=priority_level,
            goal_category=goal_category,
            description=description,
            tree_selected=tree_selected
        )

        db.session.add(new_goal)
        db.session.commit()

        for task_data in tasks_data:
            label = task_data.get('label')
            text = task_data.get('text')
            new_task = Task(label=label, text=text, goal_id=new_goal.id)
            db.session.add(new_task)

        db.session.commit()

        return jsonify(success=True, goalId=new_goal.id), 200
    
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500
    

@app.route('/delete_goal/<int:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    try:
        goal = Goal.query.get(goal_id)
        if not goal:
            return jsonify(success=False, message="Goal not found."), 404

        db.session.delete(goal)
        db.session.commit()

        return jsonify(success=True), 200
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500


@app.route('/get_goals', methods=['GET'])
def get_goals():
    try:
        # Fetch all goals from the database
        goals = Goal.query.all()
        # Convert goals to a list of dictionaries
        goals_data = [{'id': goal.id, 'goalName': goal.goal_name, 'dueDate': goal.due_date, 'priorityLevel': goal.priority_level} for goal in goals]
        return jsonify(goals_data)  # Send goals as JSON response
    except Exception as e:
        print('Error fetching goals:', e)
        return jsonify({'message': 'Internal server error'}), 500
    

@app.route('/update_goal/<int:goal_id>', methods=['PUT'])
def update_goal(goal_id):
    try:
        data = request.get_json()
        goal = Goal.query.get(goal_id)
        if not goal:
            return jsonify(success=False, message="Goal not found."), 404
        
        goal.goal_name = data['goalName']
        goal.due_date = data['dueDate']
        goal.priority_level = data['priorityLevel']
        goal.goal_category = data['goalCategory']
        goal.description = data['description']
        
        db.session.commit()
        
        return jsonify(success=True), 200
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500

@app.route('/get_goal/<int:goal_id>', methods=['GET'])
def get_goal(goal_id):
    try:
        goal = Goal.query.get(goal_id)
        if not goal:
            return jsonify(success=False, message="Goal not found."), 404
        
        # Convert tasks to a list of dictionaries
        tasks = [{'label': task.label, 'text': task.text} for task in goal.tasks]
        
        goal_data = {
            'goalName': goal.goal_name,
            'dueDate': goal.due_date,
            'priorityLevel': goal.priority_level,
            'goalCategory': goal.goal_category,
            'description': goal.description,
            'tasks': tasks
        }
        
        return jsonify(success=True, goal=goal_data), 200
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500