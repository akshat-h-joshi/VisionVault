import os 
from flask import request, jsonify, render_template, session, url_for
from werkzeug.utils import secure_filename
from init import app,db
import logging
from datetime import datetime, date
from sqlalchemy import func

# Configure logging
logging.basicConfig(level=logging.DEBUG)

                        # Database models

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
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

# Category model
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Goal model
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

    @property
    def total_tasks(self):
        return len(self.tasks)

    @property
    def completed_tasks(self):
        return len([task for task in self.tasks if task.completed])

# Completed Goal model
class CompletedGoal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    goal_category = db.Column(db.String(100), nullable=False)
    completion_date = db.Column(db.Date, nullable=False)

# Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(150), nullable=False)
    text = db.Column(db.String(500), nullable=False)
    goal_id = db.Column(db.Integer, db.ForeignKey('goal.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)

# Initial load of login and registration page
@app.route('/')
def index():
    return render_template('index.html')

# Route to match given password with database value and confirm authentication
@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.password == password:  
        session['user_email'] = user.email
        return jsonify(success=True), 200
    else:
        return jsonify(success=False, message="Invalid email address and/or password."), 401
    
# Route to add new values to database under new user id
@app.route('/register', methods=['POST'])
def register():
    email = request.form.get('email')
    password = request.form.get('password')
    name = request.form.get('name')

    if User.query.filter_by(email=email).first():
        return jsonify(success=False, message="Email already registered."), 409

    new_user = User(email=email, password=password, name=name)  # Store plain text password so that it can be converted back for profile page
    db.session.add(new_user)
    db.session.commit()
    session['user_email'] = new_user.email
    return jsonify(success=True), 200

# Route to get user id with session email
@app.route('/get_user_id', methods=['GET'])
def get_user_id():
    email = session.get('user_email')
    if not email:
        return jsonify({'error': 'User not logged in'}), 401

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'user_id': user.id}), 200

# Route to logout and redirect to index
@app.route('/logout')
def logout():
    session.pop('user_email', None)
    return jsonify(success=True, message="Logged out successfully"), 200

# Route to main program and homepage
@app.route('/home')
def home():
    # Retrieve the user from the session
    email = session.get('user_email')
    if not email:
        return "User not logged in", 401

    user = User.query.filter_by(email=email).first()
    if not user:
        return "User not found", 404

    goals = Goal.query.filter_by(user_id=user.id).all()

    return render_template('home.html', goals=goals, user=user) # Redirect to homepage

# Create new upload folder within static folder to store profile images for retrieval
UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to upload and save profile image for each user
@app.route('/upload_profile_image', methods=['POST'])
def upload_profile_image():
    if 'profile_image' not in request.files:
        return jsonify(success=False, message='No file part')
    
    file = request.files['profile_image']
    if file.filename == '':
        return jsonify(success=False, message='No selected file')

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Retrieve user_id from request.form
        user_id = request.form.get('user_id')
        user = User.query.get(user_id)  # Adjust this as necessary

        if user:
            user.profile_image = filename
            db.session.commit()

            # Construct the profile image URL
            profile_image_url = url_for('static', filename='uploads/' + filename, _external=True)

            return jsonify(success=True, profile_image_url=profile_image_url)
        else:
            return jsonify(success=False, message='User not found')
    return jsonify(success=False, message='Invalid file type')

# Route to fetch user info for profile page
@app.route('/user_info', methods=['GET'])
def user_info():
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    
    if user:
        user_data = {
            'email': user.email,
            'password': user.password,
            'prestige_level': user.prestige_level,
            'pine_tree_number': user.pine_tree_number,
            'spruce_tree_number': user.spruce_tree_number,
            'birch_tree_number': user.birch_tree_number,
            'cedar_tree_number': user.cedar_tree_number
        }
        return jsonify(success=True, user_data=user_data)
    else:
        return jsonify(success=False, message='User not found')

# Route to fetch goal completion data for statistics
@app.route('/get_goal_completion_data/<int:user_id>', methods=['GET'])
def get_goal_completion_data(user_id):
    categories = ['Health', 'Professional', 'Personal']
    user_categories = Category.query.filter_by(user_id=user_id).all()
    category_names = categories + [cat.name for cat in user_categories]

    data = []
    for category in category_names:
        total_goals = (
            Goal.query.filter_by(user_id=user_id, goal_category=category).count() +
            CompletedGoal.query.filter_by(user_id=user_id, goal_category=category).count()
        )
        completed_goals = (
            db.session.query(Goal)
            .join(Task, Goal.id == Task.goal_id)
            .filter(Goal.user_id == user_id, Goal.goal_category == category)
            .group_by(Goal.id)
            .having(func.count(Task.id) == func.sum(Task.completed))
            .count()
        )
        # Add completed goals from the log
        completed_goals += CompletedGoal.query.filter_by(user_id=user_id, goal_category=category).count()

        goals_in_progress = total_goals - completed_goals

        data.append({
            'category': category,
            'total_goals': total_goals,
            'completed_goals': completed_goals,
            'goals_in_progress': goals_in_progress
        })

    return jsonify(data)

# Route to save goal with add goal modal
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
            tree_selected=tree_selected,
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

         # Get the updated total goals count
        total_goals = (
            Goal.query.filter_by(user_id=user.id).count() +
            CompletedGoal.query.filter_by(user_id=user.id).count()
        )

        completed_goals = CompletedGoal.query.filter_by(user_id=user.id).count()

        return jsonify(success=True, goalId=new_goal.id, total_goals=total_goals, completed_goals=completed_goals), 200
    
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500
    
# Route to delete goals when delete button for goal is clicked
@app.route('/delete_goal/<int:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    try:
        goal = Goal.query.get(goal_id)
        if not goal:
            return jsonify(success=False, message="Goal not found."), 404
        
        email = session.get('user_email')
        if not email:
            return jsonify({'error': 'User not logged in'}), 401

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        user_id = goal.user_id
        db.session.delete(goal)
        db.session.commit()

        # Get the updated total goals count
        total_goals = (
            Goal.query.filter_by(user_id=user_id).count() +
            CompletedGoal.query.filter_by(user_id=user_id).count()
        )

        completed_goals = CompletedGoal.query.filter_by(user_id=user.id).count()

        return jsonify(success=True, total_goals=total_goals, completed_goals=completed_goals), 200
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500

# Get goals from database
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
    
# Route to update goal when finalise button in edit goal modal is clicked
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

# Route to get singular goal from database
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
            'tasks': tasks,
            'completed_tasks': len([task for task in goal.tasks if task.completed]),
            'total_tasks': len(goal.tasks),
            'id': goal.id
        }
        
        return jsonify(success=True, goal=goal_data), 200
    except Exception as e:
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

# Route to get category name to determine which goals to delete when deleting category and goals
@app.route('/get_category_name', methods=['GET'])
def get_category_name():
    category_name = request.args.get('category_name')
    if not category_name:
        return jsonify({'success': False, 'message': 'Category name not provided.'}), 400

    category = Category.query.filter(Category.name.ilike(category_name)).first()
    if not category:
        return jsonify({'success': False, 'message': 'Category not found.'}), 404

    return jsonify({'success': True, 'category_name': category.name}), 200

# Route to delete category and goals from database
@app.route('/delete_category_and_goals/<category_name>', methods=['DELETE'])
def delete_category_and_goals(category_name):
    try:

        email = session.get('user_email')
        if not email:
            return jsonify({'error': 'User not logged in'}), 401

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
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

        completed_goals = CompletedGoal.query.filter_by(user_id=user.id).count()
        total_goals = (
            Goal.query.filter_by(user_id=user.id).count() +
            CompletedGoal.query.filter_by(user_id=user.id).count()
        )

        return jsonify({
            'message': 'Category and associated goals deleted successfully',
            'completed_goals': completed_goals,
            'total_goals': total_goals
        }), 200
    
    except Exception as e:
        print('Error deleting category and goals:', e)
        return jsonify({'message': 'Internal server error'}), 500
    
# Route to complete goals when all tasks are completed
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
        
        if today <= due_date: # Only give new tree when goal is completed prior to due date 
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

            # Log the completed goal
            completed_goal = CompletedGoal(
                user_id=user.id,
                goal_category=goal.goal_category,
                completion_date=today
            )
            db.session.add(completed_goal)

            db.session.delete(goal)
            db.session.commit()

            completed_goals = CompletedGoal.query.filter_by(user_id=user.id).count()
            total_goals = (
                Goal.query.filter_by(user_id=user.id).count() +
                CompletedGoal.query.filter_by(user_id=user.id).count()
            )

            return jsonify(success=True, completed_goals=completed_goals, total_goals = total_goals), 200
        else:
            db.session.delete(goal)
            db.session.commit()
            return jsonify(success=True, message="Goal completed, but your tree is unavailable since the due date has passed."), 200
    
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500

# Route to check tree availability when planting in the garden
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
    
# Route to get tree types in frame to return sprites upon page reload
@app.route('/get_tree_types/<int:user_id>', methods=['GET'])
def get_tree_types(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify(success=False, message="User not found."), 404
        
        tree_types = { # Determine which frames had which tree, if any at all
            'frame1_type': user.frame1_type,
            'frame2_type': user.frame2_type,
            'frame3_type': user.frame3_type
        }
        return jsonify(tree_types), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

# Route to update the frame to the corresponding tree image planted
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

# Route to reset frames upon their completion and increment prestige by 1 in the database
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

# Route to get total and completed goals through counting for dashboard page
@app.route('/get_total_and_completed_goals/<int:user_id>', methods=['GET'])
def get_total_and_completed_goals(user_id):
    try:
        total_goals = (
            Goal.query.filter_by(user_id=user_id).count() +
            CompletedGoal.query.filter_by(user_id=user_id).count()
        )

        completed_goals = CompletedGoal.query.filter_by(user_id=user_id).count()

        return jsonify(success=True, total_goals=total_goals, completed_goals=completed_goals), 200
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500

# Route to get 5 goals with closest due date for show in upcoming goals table
@app.route('/upcoming_goals')
def upcoming_goals():
    email = session.get('user_email')
    if not email:
        return jsonify({'error': 'User not logged in'}), 401

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Querying for the five goals closest to today's date
    today = date.today()
    upcoming_goals = Goal.query.filter(
        Goal.user_id == user.id,
        Goal.due_date >= today
    ).order_by(Goal.due_date).limit(5).all()
    
    # Convert upcoming_goals to a list of dictionaries for JSON serialization
    goals_list = []
    for goal in upcoming_goals:
        goals_list.append({
            'id': goal.id,
            'goal_name': goal.goal_name,
            'due_date': goal.due_date,
            'priority_level': goal.priority_level,
            'completed_tasks': len([task for task in goal.tasks if task.completed]),
            'total_tasks': len(goal.tasks),
            'goal_category': goal.goal_category
        })
    
    return jsonify(success=True, upcoming_goals=goals_list), 200
