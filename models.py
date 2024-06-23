import os 
from flask import request, jsonify, render_template, session
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from init import app,db
import logging
from datetime import datetime



# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Database model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    categories = db.relationship('Category', backref='user', lazy=True, cascade="all, delete-orphan")
    pine_tree_number = db.Column(db.Integer, default=0)
    spruce_tree_number = db.Column(db.Integer, default=0)
    birch_tree_number = db.Column(db.Integer, default=0)
    cedar_tree_number = db.Column(db.Integer, default=0)
    frame1_type = db.Column(db.String(50))  # Example: 'Pine Tree', 'Spruce Tree', etc.
    frame2_type = db.Column(db.String(50))
    frame3_type = db.Column(db.String(50))
    prestige_level = db.Column(db.Integer, default=0)
    profile_image = db.Column(db.String(150), nullable=True) 

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Goal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    goal_name = db.Column(db.String(150), nullable=False)
    due_date = db.Column(db.String(150), nullable=False)
    priority_level = db.Column(db.String(50), nullable=False)
    goal_category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    tree_selected = db.Column(db.String(50), nullable=False)
    tree_stage = db.Column(db.Integer, default=1)  # Add tree stage field
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tasks = db.relationship('Task', backref='goal', lazy=True, cascade="all, delete-orphan")

    @property
    def total_tasks(self):
        return len(self.tasks)

    @property
    def completed_tasks(self):
        return len([task for task in self.tasks if task.completed])

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(150), nullable=False)
    text = db.Column(db.String(500), nullable=False)
    goal_id = db.Column(db.Integer, db.ForeignKey('goal.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)

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

@app.route('/get_user_id', methods=['GET'])
def get_user_id():
    email = session.get('user_email')
    if not email:
        return jsonify({'error': 'User not logged in'}), 401

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'user_id': user.id}), 200

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

UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload_profile_image', methods=['POST'])
def upload_profile_image():
    data = request.get_json()
    user_id = data.get('user_id')
    user = User.query.get(user_id)

    if 'profile_image' not in request.files:
        return jsonify(success=False, message='No file part')
    
    file = request.files['profile_image']
    if file.filename == '':
        return jsonify(success=False, message='No selected file')

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        if user:
            user.profile_image = filename
            db.session.commit()
            return jsonify(success=True)
        else:
            return jsonify(success=False, message='User not found')
    return jsonify(success=False, message='Invalid file type')

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
        tree_stage = 1  # Assuming default stage is 1, adjust as needed

        new_goal = Goal(
            user_id=user.id,
            goal_name=goal_name,
            due_date=due_date,
            priority_level=priority_level,
            goal_category=goal_category,
            description=description,
            tree_selected=tree_selected,
            tree_stage=tree_stage
        )

        db.session.add(new_goal)
        db.session.commit()

        for task_data in tasks_data:
            label = task_data.get('label')
            text = task_data.get('text')
            completed = task_data.get('completed', False)
            new_task = Task(label=label, text=text, goal_id=new_goal.id, completed=completed)
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
        goals_data = [{'id': goal.id, 'goalName': goal.goal_name, 'dueDate': goal.due_date, 'priorityLevel': goal.priority_level, 'goalCategory': goal.goal_category} for goal in goals]
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
        goal.tree_stage = data['treeStage']
        
        # Clear existing tasks
        Task.query.filter_by(goal_id=goal.id).delete()

        # Add new tasks
        for task in data['tasks']:
            new_task = Task(
                goal_id=goal.id, 
                label=task['label'], 
                text=task['text'], 
                completed=task['completed']
            )
            db.session.add(new_task)
        
        # Commit the changes to the database
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
        tasks = [{'id': task.id, 'label': task.label, 'text': task.text, 'completed': task.completed} for task in goal.tasks]
        
        goal_data = {
            'goalName': goal.goal_name,
            'dueDate': goal.due_date,
            'priorityLevel': goal.priority_level,
            'goalCategory': goal.goal_category,
            'description': goal.description,
            'treeSelected': goal.tree_selected,
            'treeStage': goal.tree_stage,
            'tasks': tasks,
            'id': goal.id
        }
        
        return jsonify(success=True, goal=goal_data), 200
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500
    
@app.route('/complete_task/<int:task_id>', methods=['PUT'])
def complete_task(task_id):
    try:
        data = request.get_json()
        completed = data.get('completed')
        task = Task.query.get(task_id)
        
        if not task:
            return jsonify(success=False, message="Task not found."), 404

        task.completed = completed
        db.session.commit()

        # Check goal completion status and update tree stage
        goal = task.goal
        total_tasks = len(goal.tasks)
        completed_tasks = sum(1 for t in goal.tasks if t.completed)
        tree_stage = completed_tasks / total_tasks * 4  # Calculate tree stage

        return jsonify(success=True, tree_stage=tree_stage), 200
    
    except Exception as e:
        logging.error(f"Error occurred in complete_task: {str(e)}")
        return jsonify(success=False, message=str(e)), 500

# Route to add a new category for a user
@app.route('/add_category', methods=['POST'])
def add_category():
    data = request.get_json()
    user_id = data.get('user_id')
    category_name = data.get('category_name')

    if not user_id or not category_name:
        return jsonify({'error': 'User ID or Category name not provided'}), 400

    # Check if the user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Check if the category already exists for the user
    existing_category = Category.query.filter_by(user_id=user_id, name=category_name).first()
    if existing_category:
        return jsonify({'error': 'Category already exists for this user'}), 400

    # Create a new Category object and add it to the user
    new_category = Category(name=category_name, user_id=user_id)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({'message': 'Category added successfully', 'category': category_name}), 200

# Route to retrieve all categories for a user
@app.route('/categories/<int:user_id>', methods=['GET'])
def get_categories(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    categories = Category.query.filter_by(user_id=user_id).all()
    category_list = [{'id': category.id, 'name': category.name} for category in categories]
    return jsonify({'categories': category_list}), 200

@app.route('/get_category_name', methods=['GET'])
def get_category_name():
    category_name = request.args.get('category_name')
    if not category_name:
        return jsonify({'success': False, 'message': 'Category name not provided.'}), 400

    category = Category.query.filter(Category.name.ilike(category_name)).first()
    if not category:
        return jsonify({'success': False, 'message': 'Category not found.'}), 404

    return jsonify({'success': True, 'category_name': category.name}), 200

@app.route('/delete_category_and_goals/<category_name>', methods=['DELETE'])
def delete_category_and_goals(category_name):
    try:
        # Fetch the category to be deleted
        category = Category.query.filter(Category.name.ilike(category_name)).first()
        if not category:
            return jsonify({'message': 'Category not found'}), 404

        # Fetch and delete goals associated with this category
        goals = Goal.query.filter(Goal.goal_category.ilike(category.name)).all()
        for goal in goals:
            db.session.delete(goal)

        # Delete the category
        db.session.delete(category)
        db.session.commit()

        return jsonify({'message': 'Category and associated goals deleted successfully'}), 200
    except Exception as e:
        print('Error deleting category and goals:', e)
        return jsonify({'message': 'Internal server error'}), 500
    

@app.route('/complete_goal/<int:goal_id>', methods=['POST'])
def complete_goal(goal_id):
    try:
        goal = Goal.query.get(goal_id)
        if not goal:
            return jsonify(success=False, message="Goal not found."), 404

        user = User.query.get(goal.user_id)
        if not user:
            return jsonify(success=False, message="User not found."), 404

        tree_selected = goal.tree_selected
        due_date = datetime.strptime(goal.due_date, '%Y-%m-%d').date()  # Convert due_date string to datetime.date object
        today = datetime.now().date()
        
        if today <= due_date:
            if tree_selected == 'Pine Tree':
                user.pine_tree_number += 1
            elif tree_selected == 'Spruce Tree':
                user.spruce_tree_number += 1
            elif tree_selected == 'Birch Tree':
                user.birch_tree_number += 1
            elif tree_selected == 'Cedar Tree':
                user.cedar_tree_number += 1
            else:
                return jsonify(success=False, message="Invalid tree type."), 400

            db.session.delete(goal)
            db.session.commit()

            return jsonify(success=True), 200
        else:
            db.session.delete(goal)
            db.session.commit()
            return jsonify(success=True, message="Goal completed, but your tree is unavailable since the due date has passed."), 200
    
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500

@app.route('/check_tree_availability/<int:user_id>/<tree_type>', methods=['GET'])
def check_tree_availability(user_id, tree_type):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify(success=False, message="User not found."), 404
        
        if tree_type == 'Pine Tree' and user.pine_tree_number > 0:
            user.pine_tree_number -= 1
            db.session.commit()
            return jsonify(available=True)
        elif tree_type == 'Spruce Tree' and user.spruce_tree_number > 0:
            user.spruce_tree_number -= 1
            db.session.commit()
            return jsonify(available=True)
        elif tree_type == 'Birch Tree' and user.birch_tree_number > 0:
            user.birch_tree_number -= 1
            db.session.commit()
            return jsonify(available=True)
        elif tree_type == 'Cedar Tree' and user.cedar_tree_number > 0:
            user.cedar_tree_number -= 1
            db.session.commit()
            return jsonify(available=True)
        else:
            return jsonify(available=False, message=f"You don't have a {tree_type}.")
    except Exception as e:
        return jsonify(error=str(e)), 500
    
@app.route('/get_tree_types/<int:user_id>', methods=['GET'])
def get_tree_types(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify(success=False, message="User not found."), 404
        
        tree_types = {
            'frame1_type': user.frame1_type,
            'frame2_type': user.frame2_type,
            'frame3_type': user.frame3_type
        }
        return jsonify(tree_types), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/update_tree_type/<int:user_id>/<int:frame_number>', methods=['POST'])
def update_tree_type(user_id, frame_number):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify(success=False, message="User not found."), 404
        
        data = request.get_json()
        tree_type = data.get('tree_type')
        
        if not tree_type:
            return jsonify(success=False, message="Tree type not provided."), 400
        
        if frame_number == 1:
            user.frame1_type = tree_type
        elif frame_number == 2:
            user.frame2_type = tree_type
        elif frame_number == 3:
            user.frame3_type = tree_type
        else:
            return jsonify(success=False, message="Invalid frame number."), 400
        
        db.session.commit()
        return jsonify(success=True), 200
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500

@app.route('/check_frames_and_increase_prestige/<int:user_id>', methods=['POST'])
def check_frames_and_increase_prestige(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify(success=False, message="User not found."), 404
        
        # Check if all frames have a tree
        if user.frame1_type and user.frame2_type and user.frame3_type:
            # Increase the prestige level
            user.prestige_level += 1
            
            # Reset the frames
            user.frame1_type = None
            user.frame2_type = None
            user.frame3_type = None
            
            db.session.commit()
            return jsonify(success=True, message="Prestige level increased and frames reset."), 200
        else:
            return jsonify(success=False, message="Not all frames have trees."), 400
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500
