<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet">
   <!-- REMIXICONS CSS -->
   <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet">
   <link rel="stylesheet" href="/static/css/home.css">
   <title>Home Page</title>
</head>
<body>

   <div class="container">
       <!-- Sidebar Section -->
       <aside>
           <div class="toggle">
               <div class="logo">
                    <i class="icon ri-tree-fill"></i>
                    <h2>Vision<span class="danger">Vault</span></h2>
               </div>
               <div class="close" id="close-btn">
                   <span class="material-icons-sharp">
                       close
                   </span>
               </div>
           </div>

           <div class="sidebar">
               <a href="#" class="sidebar-button active" data-target="dashboard">
                   <span class="material-icons-sharp">
                       dashboard
                   </span>
                   <h3>Dashboard</h3>
               </a>
               <a href="#" class="sidebar-button" data-target="profile">
                   <span class="material-icons-sharp">
                       person_outline
                   </span>
                   <h3>Profile</h3>
               </a>
               <a href="#goals" class="sidebar-button" data-target="goals">
                   <span class="material-icons-sharp">
                       insights
                   </span>
                   <h3>Goals</h3>
               </a>
               <a href="#" class="sidebar-button" data-target="garden">
                   <span class="material-icons-sharp">
                       mail_outline
                   </span>
                   <h3>Garden</h3>
                   <span class="message-count">27</span>
               </a>
               <a href="#" class="sidebar-button" data-target="journal">
                   <span class="material-icons-sharp">
                       receipt_long
                   </span>
                   <h3>Journal</h3>
               </a>
               <a href="#" class="sidebar-button" data-target="settings">
                   <span class="material-icons-sharp">
                       settings
                   </span>
                   <h3>Settings</h3>
               </a>
               <a href="#" class="sidebar-button">
                   <span class="material-icons-sharp">
                       logout
                   </span>
                   <h3>Logout</h3>
               </a>
           </div>
       </aside>
       <!-- End of Sidebar Section -->

       <!-- Main Content -->
       <main>
           <!-- Analyses -->
           <div class="page dashboard">
                <h1>Dashboard</h1>
                <div class="analyse">
                    <div class="sales">
                        <div class="status">
                            <div class="info">
                                <h3>Total Sales</h3>
                                <h1>$65,024</h1>
                            </div>
                            <div class="progress">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div class="percentage">
                                    <p>+81%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="visits">
                        <div class="status">
                            <div class="info">
                                <h3>Site Visit</h3>
                                <h1>24,981</h1>
                            </div>
                            <div class="progress">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div class="percentage">
                                    <p>-48%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="searches">
                        <div class="status">
                            <div class="info">
                                <h3>Searches</h3>
                                <h1>14,147</h1>
                            </div>
                            <div class="progress">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div class="percentage">
                                    <p>+21%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End of Analyses -->
    
                <!-- New Users Section -->
                <div class="new-users">
                    <h2>New Users</h2>
                    <div class="user-list">
                        <div class="user">
                            <img src="images/profile-2.jpg">
                            <h2>Jack</h2>
                            <p>54 Min Ago</p>
                        </div>
                        <div class="user">
                            <img src="images/profile-3.jpg">
                            <h2>Amir</h2>
                            <p>3 Hours Ago</p>
                        </div>
                        <div class="user">
                            <img src="images/profile-4.jpg">
                            <h2>Ember</h2>
                            <p>6 Hours Ago</p>
                        </div>
                        <div class="user">
                            <img src="/static/img/plus.png">
                            <h2>More</h2>
                            <p>New User</p>
                        </div>
                    </div>
                </div>
                <!-- End of New Users Section -->
    
                <!-- Recent Orders Table -->
                <div class="recent-orders">
                    <h2>Recent Orders</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Course Number</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                    <a href="#">Show All</a>
                </div>
                <!-- End of Recent Orders -->
           </div>
           <div class="page profile">
                <h1>Profile</h1>    
                <div class="profile-container">
                    <h1>Elon Musk</h1>
                    <img src="/static/img/profile.png" id="profile-pic">
                    <label for="input-file">Update image</label>
                    <input type="file" accept="image/jpeg, image/png, image/jpg" id="input-file">
                </div>
                <div class="info-container">

                </div>
           </div>
           <div class="page journal">
                <h1>Journal</h1>    
           </div>
           <div class="page goals">
                <h1>Goals</h1>
                <div class="goals-main-container">
                    <div class="title-container">Categories</div>
                    <div class="goals-categories-container">
                        <div class="category" data-category="personal">Personal</div>
                        <div class="category" data-category="professional">Professional</div>
                        <div class="category" data-category="health">Health</div>
                        <div class="category">Personal</div>
                        <div class="category">Professional</div>
                        <div class="category">Health</div>
                        <div class="category">Personal</div>
                        <div class="category">Professional</div>
                        <div class="category">Health</div>
                        <div class="category">Personal</div>
                        <div class="category">Professional</div>
                        <div class="category">Health</div>
                        <div class="category">Personal</div>
                        <div class="category">Professional</div>
                        <div class="category">Health</div>
                    </div>
                    <div class="goals-sub-container">
                        <!-- Add a Goal button -->
                        <button id="addGoalButton" class="goal-button">Add Goal</button>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Goal Name</th>
                                        <th>Due Date</th>
                                        <th>Priority</th>
                                        <th>Progress</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="goalsTable">
                                    {% for goal in goals %}
                                    <tr>
                                        <td>{{ goal.goal_name }}</td>
                                        <td>{{ goal.due_date }}</td>
                                        <td>{{ goal.priority_level }}</td>
                                        <td><!-- Add progress here --></td>
                                        <td>
                                            <button class="edit-goal-button"></button>
                                            <button class="delete-goal-button" data-goal-id="{{ goal.id }}"></button>
                                        </td>
                                    </tr>
                                    {% endfor %}
                                </tbody>
                            </table>
                        </div>
                    </div>
                                <!-- New Goal Modal -->
                    <div id="newGoalModal" class="modal">
                        <div class="modal-content">
                            <!-- <div class="error-message" id="main-info-error">Hello</div> -->
                            <span class="close-button">&times;</span>
                            <button id="continueButton" class="continue-button">Continue</button>
                            <button id="backButton" class="back-button">Back</button>
                            <button id="finaliseButton" class="finalise-button">Finalise</button>
                            <h2>Add a New Goal</h2>
                            <div class="tree-container">
                                <button id="prev" class="arrow">&#9664;</button>
                                <div class="tree-info">
                                    <img id="tree-image" class='pine-tree' src="/static/img/pine-tree.png" alt="Tree">
                                    <p id="tree-name">Pine Tree</p>
                                </div>
                                <button id="next" class="arrow">&#9654;</button>
                            </div>
                            <div class="main-info-container">
                                <!-- Form content goes here -->
                                <form id="goalForm" method="POST" action="/save_goal">
                                    <label for="goalName">Goal Name:</label>
                                    <input type="text" id="goalName" name="goalName" required>
                                    
                                    <label for="dueDate">Due Date:</label>
                                    <input type="date" id="dueDate" name="dueDate" required>
                                    
                                    <label for="priorityLevel">Priority Level:</label>
                                    <select id="priorityLevel" name="priorityLevel" required>
                                        <option value="">Select Priority</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                    
                                    <label for="goalCategory">Category:</label>
                                    <input type="text" id="goalCategory" name="goalCategory" required>
                                    
                                    <label for="description">Description:</label>
                                    <textarea id="description" name="description" rows="4" required></textarea>
                                </form>
                            </div>
                            <div class="sub-tasks-container">
                                <div class="content-wrapper">
                                    <div class="vertical-line"></div>
                                    <div class="task-container">
                                        <div class="task-content"></div>
                                        <div class="task-content"></div>
                                        <div class="task-content"></div>
                                        <button class="add-task-button" onclick="addTasks()">+</button>
                                    </div>
                                </div>
                                    
                            </div>
                        </div>
                    </div>

                    <!-- Edit Goal Modal -->
                    <div id="editGoalModal" class="modal">
                        <div id="editGoalModalContent" class="modal-content">
                            <span id="editGoalCloseButton" class="close-button">&times;</span>
                            <h2>Edit Goal</h2>
                            <div id="editGoalTreeContainer" class="tree-container">
                                <button id="prevEdit" class="arrow">&#9664;</button>
                                <div class="tree-info">
                                    <img id="tree-image-edit" class='pine-tree' src="/static/img/pine-tree.png" alt="Tree">
                                    <p id="tree-name-edit">Pine Tree</p>
                                </div>
                                <button id="nextEdit" class="arrow">&#9654;</button>
                            </div>
                            <div class="main-info-container">
                                <form id="editGoalForm" method="POST" action="/update_goal">
                                    <label for="editGoalName">Goal Name:</label>
                                    <input type="text" id="editGoalName" name="goalName" required>
                    
                                    <label for="editDueDate">Due Date:</label>
                                    <input type="date" id="editDueDate" name="dueDate" required>
                    
                                    <label for="editPriorityLevel">Priority Level:</label>
                                    <select id="editPriorityLevel" name="priorityLevel" required>
                                        <option value="">Select Priority</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                    
                                    <label for="editGoalCategory">Category:</label>
                                    <input type="text" id="editGoalCategory" name="goalCategory" required>
                    
                                    <label for="editDescription">Description:</label>
                                    <textarea id="editDescription" name="description" rows="4" required></textarea>
                                </form>
                            </div>
                            <div class="sub-tasks-container">
                                <div class="content-wrapper">
                                    <div class="vertical-line"></div>
                                    <div class="task-container" id="edit-task-container">
                                        <div class="task-content"></div>
                                        <div class="task-content"></div>
                                        <div class="task-content"></div>
                                        <button class="add-task-button" onclick="addTasks()">+</button>
                                    </div>
                                </div>
                            </div>
                            <button id="saveEditButton" class="finalise-button">Save</button>
                        </div>
                    </div>
                </div>    
           </div>
           <div class="page garden">
                <h1>Garden</h1>    
           </div>
           <div class="page settings">
                <h1>Settings</h1>    
           </div>
           

       </main>
       <!-- End of Main Content -->

       <!-- Right Section -->
       <div class="right-section">
           <div class="nav">
               <button id="menu-btn">
                   <span class="material-icons-sharp">
                       menu
                   </span>
               </button>
               <div class="dark-mode">
                   <span class="material-icons-sharp active">
                       light_mode
                   </span>
                   <span class="material-icons-sharp">
                       dark_mode
                   </span>
               </div>

           </div>
           <!-- End of Nav -->

           <div class="user-profile">
               <div class="logo">
                   <img src="/static/img/profile.png">
                   <h2>Hey Akshat</h2>
                   <p>Welcome to VisionVault!</p>
               </div>
           </div>

           <div class="reminders">
               <div class="header">
                   <h2>Reminders</h2>
                   <span class="material-icons-sharp">
                       notifications_none
                   </span>
               </div>

               <div class="notification">
                   <div class="icon">
                       <span class="material-icons-sharp">
                           volume_up
                       </span>
                   </div>
                   <div class="content">
                       <div class="info">
                           <h3>Workshop</h3>
                           <small class="text_muted">
                               08:00 AM - 12:00 PM
                           </small>
                       </div>
                       <span class="material-icons-sharp">
                           more_vert
                       </span>
                   </div>
               </div>

               <div class="notification deactive">
                   <div class="icon">
                       <span class="material-icons-sharp">
                           edit
                       </span>
                   </div>
                   <div class="content">
                       <div class="info">
                           <h3>Workshop</h3>
                           <small class="text_muted">
                               08:00 AM - 12:00 PM
                           </small>
                       </div>
                       <span class="material-icons-sharp">
                           more_vert
                       </span>
                   </div>
               </div>

               <div class="notification add-reminder">
                   <div>
                       <span class="material-icons-sharp">
                           add
                       </span>
                       <h3>Add Reminder</h3>
                   </div>
               </div>

           </div>
       </div>


   </div>

   <script src="/static/js/home.js"></script>
</body>
</html>



const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
})

const sidebarLinks = document.querySelectorAll('.sidebar-button');
document.addEventListener('DOMContentLoaded', function() {
    // Hide all pages except for the dashboard
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (!page.classList.contains('dashboard')) {
            page.classList.add('hidden'); // Add a class to hide pages;
        }
    });
    
    sidebarLinks.forEach(sidebarLink => {
        sidebarLink.addEventListener('click', () => {
            const currentActive = document.querySelector('.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            
            // Add 'active' class to the clicked sidebar link
            sidebarLink.classList.add('active');
            
            // Get the target page class from the clicked sidebar link's data-target attribute
            const targetPageClass = sidebarLink.dataset.target;

            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => {
                page.classList.add('hidden'); // Hide pages
            });
            
            // Show the corresponding page
            const targetPage = document.querySelector(`.page.${targetPageClass}`);
            if (targetPage) {
                targetPage.classList.remove('hidden'); // Hide pages
                // Toggle right section visibility based on the current page
                toggleRightSection(targetPageClass === 'dashboard');
            }

            // Function to toggle right section visibility
            function toggleRightSection(show) {
                const rightSection = document.querySelector('.right-section');
                if (rightSection) {
                    rightSection.style.display = show ? 'block' : 'none';
                }
            }
        })
    })})

// Script for changing profile picture
let profilePic = document.getElementById("profile-pic");
let inputFile = document.getElementById("input-file");

inputFile.onchange = function(){
    console.log("File input changed");
    console.log(profilePic);
    console.log(inputFile);
    profilePic.src = URL.createObjectURL(inputFile.files[0]);
    // Send a message containing the new profile picture source to the parent window
    window.parent.postMessage({ profilePicSrc: profilePic }, '*');
}

window.addEventListener('message', function(event) {
    // Check if the message contains a new profile picture source
    if (event.data && event.data.profilePicSrc) {
        let profilePicdashboard = document.getElementById("profile-pic");
        profilePicdashboard.src = event.data.profilePicSrc;
    }
});



const Orders = [
    {
        productName: 'JavaScript Tutorial',
        productNumber: '85743',
        paymentStatus: 'Due',
        status: 'Pending'
    },
    {
        productName: 'CSS Full Course',
        productNumber: '97245',
        paymentStatus: 'Refunded',
        status: 'Declined'
    },
    {
        productName: 'Flex-Box Tutorial',
        productNumber: '36452',
        paymentStatus: 'Paid',
        status: 'Active'
    },
]

// Orders.forEach(goal => {
//     const tr = document.createElement('tr');
//     const trContent = `
//         <td>${goal.productName}</td>
//         <td>${goal.productNumber}</td>
//         <td>${goal.paymentStatus}</td>
//         <td class="${goal.status === 'Declined' ? 'danger' : goal.status === 'Pending' ? 'warning' : 'primary'}">${goal.status}</td>
//         <td class="primary">Details</td>
//     `;
//     tr.innerHTML = trContent;
//     document.querySelector('table tbody').appendChild(tr);
// });

function resetTasks() {
    const tasks = document.querySelectorAll('.task-container .task-content');
    tasks.forEach(task => {
        task.querySelector('.task-label').textContent = 'Title:';
        task.querySelector('.task-text').textContent = '';
        task.querySelector('.task-text').style.display = 'block';
    });
}

function resetTree() {
    let originalTreeIndex = 0;
    currentIndex = originalTreeIndex;
    updateTree();
}

function resetModal() {
    const modal = document.getElementById('newGoalModal');
    const modalContent = document.querySelector('.modal-content');

    document.querySelector(".container").appendChild(modal);  // Move the modal back
    modal.style.display = "none";
    document.querySelector(".container").classList.remove("blurred");
    goalForm.reset(); // Reset the form data
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
    modalContent.classList.remove("modal-active"); // Reset modal-active class
    resetTasks(); // Reset the task info
    resetTree(); // Reset the tree
}

document.addEventListener("DOMContentLoaded", () => {
    const continueButton = document.querySelector(".continue-button");
    const backButton = document.querySelector(".back-button");
    const finaliseButton = document.querySelector(".finalise-button");
    const goalNameField = document.getElementById("goalName");
    const dueDateField = document.getElementById("dueDate");
    const priorityLevelField = document.getElementById("priorityLevel");
    const goalCategoryField = document.getElementById("goalCategory");
    const descriptionField = document.getElementById("description");
    const modal = document.getElementById("newGoalModal");
    const modalContent = document.querySelector(".modal-content"); 

    document.getElementById("addGoalButton").onclick = function() {
        document.body.appendChild(modal);  // Move the modal to the body
        modal.style.display = "block";
        document.querySelector(".container").classList.add("blurred");
    }
    
    document.querySelector(".close-button").onclick = function() {
        resetModal();
    }
    
    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            resetModal();
        }
    }

    continueButton.addEventListener("click", () => {
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
 
 
        // Define errors array
        let errors = [];

        if (goalNameField.value.trim() === "") {
            errors.push({field: goalNameField, message: 'Please enter the goal name.'});
        } else if (dueDateField.value.trim() === "") {
            errors.push({field: dueDateField, message: 'Please enter a due date.'});
        } else if (priorityLevelField.value.trim() === "") {
            errors.push({field: priorityLevelField, message: 'Please select a priority level.'});
        } else if (goalCategoryField.value.trim() === "") {
            errors.push({field: goalCategoryField, message: 'Please enter a category.'});
        }

        // Insert error messages
        errors.forEach(error => {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.textContent = error.message;
            error.field.parentNode.insertBefore(errorMessage, error.field.nextSibling);
        });
 
        if (errors.length === 0) {
            modalContent.classList.add("modal-active");

            // Attaching the finalise button event listener after continue is clicked and no errors are found
            finaliseButton.onclick = function() {
                console.log('Finalise button onclick works');
                // Gather the goal form data
                const goalName = goalNameField.value.trim();
                const dueDate = dueDateField.value.trim();
                const priorityLevel = priorityLevelField.value.trim();
                const goalCategory = goalCategoryField.value.trim();
                const description = descriptionField.value.trim();
                const treeSelected = treeName.textContent.trim();

                // Gather the task data
                const tasks = [];
                document.querySelectorAll('.task-container .task-content').forEach(task => {
                    tasks.push({
                        label: task.querySelector('.task-label').textContent.trim(),
                        text: task.querySelector('.task-text').textContent.trim()
                    });
                });

                // Send the data to the backend
                fetch('/save_goal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        goalName: goalName,
                        dueDate: dueDate,
                        priorityLevel: priorityLevel,
                        goalCategory: goalCategory,
                        description: description,
                        treeSelected: treeSelected,
                        tasks: tasks
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Goal saved successfully!'); 
                        // Append the new goal to the table
                        const newGoalRow = `
                        <tr data-goal-id="${data.goalId}">
                            <td>${goalName}</td>
                            <td>${dueDate}</td>
                            <td>${priorityLevel}</td>
                            <td><!-- Add progress here --></td>
                            <td>
                                <button class="edit-goal-button" data-goal-id="${data.goalId}></button>
                                <button class="delete-goal-button" data-goal-id="${data.goalId}"></button>
                            </td>
                        </tr>`;
                        document.querySelector("#goalsTable").insertAdjacentHTML('beforeend', newGoalRow); 

                        resetModal();

                    } else {
                        alert('Failed to save goal: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
    
    backButton.addEventListener("click", () => {
        modalContent.classList.remove("modal-active");
    })
    
    })

});

                            // EDIT GOAL DOM LISTENER // 

document.addEventListener("DOMContentLoaded", () => {
    const editGoalModal = document.getElementById("editGoalModal");
    const saveEditButton = document.getElementById("saveEditButton");
    const closeEditButton = editGoalModal.querySelector(".close-button");
    const modalContentEdit = editGoalModal.querySelector(".modal-content");

    document.getElementById("goalsTable").addEventListener("click", function(event) {
        if (event.target && event.target.classList.contains('edit-goal-button')) {
            const button = event.target;
            const goalId = button.getAttribute('data-goal-id');
            openEditModal(goalId);
        }
    });

    function openEditModal(goalId) {
        fetch(`/get_goal/${goalId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('editGoalName').value = data.goal.goalName;
                    document.getElementById('editDueDate').value = data.goal.dueDate;
                    document.getElementById('editPriorityLevel').value = data.goal.priorityLevel;
                    document.getElementById('editGoalCategory').value = data.goal.goalCategory;
                    document.getElementById('editDescription').value = data.goal.description;

                    // Populate tasks
                    const taskContainer = document.getElementById('edit-task-container');
                    taskContainer.innerHTML = '';
                    data.goal.tasks.forEach(task => {
                        const taskContent = document.createElement('div');
                        taskContent.classList.add('task-content');
                        taskContent.innerHTML = `
                            <label class="task-label">${task.label}</label>
                            <textarea class="task-text">${task.text}</textarea>
                        `;
                        taskContainer.appendChild(taskContent);
                    });

                    editGoalModal.setAttribute('data-goal-id', goalId);
                    document.body.appendChild(editGoalModal);  // Move the modal to the body
                    document.querySelector(".container").classList.add("blurred");
                    editGoalModal.style.display = 'block';
                    
                } else {
                    alert('Failed to load goal data: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    closeEditButton.onclick = function() {
        editGoalModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == editGoalModal) {
            editGoalModal.style.display = 'none';
        }
    }

    saveEditButton.onclick = function() {
        const goalId = editGoalModal.getAttribute('data-goal-id');
        const goalName = document.getElementById('editGoalName').value.trim();
        const dueDate = document.getElementById('editDueDate').value.trim();
        const priorityLevel = document.getElementById('editPriorityLevel').value.trim();
        const goalCategory = document.getElementById('editGoalCategory').value.trim();
        const description = document.getElementById('editDescription').value.trim();

        const tasks = [];
        document.querySelectorAll('#edit-task-container .task-content').forEach(task => {
            tasks.push({
                label: task.querySelector('.task-label').textContent.trim(),
                text: task.querySelector('.task-text').value.trim()
            });
        });

        fetch(`/update_goal/${goalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                goalName: goalName,
                dueDate: dueDate,
                priorityLevel: priorityLevel,
                goalCategory: goalCategory,
                description: description,
                tasks: tasks
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Goal updated successfully!');
                const row = document.querySelector(`tr[data-goal-id="${goalId}"]`);
                if (row) {
                    row.querySelector('td:nth-child(1)').textContent = goalName;
                    row.querySelector('td:nth-child(2)').textContent = dueDate;
                    row.querySelector('td:nth-child(3)').textContent = priorityLevel;
                    // Update other cells as necessary
                }
                editGoalModal.style.display = 'none';
            } else {
                alert('Failed to update goal: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

// Attach event listener to the goals table for delete button clicks
document.getElementById('goalsTable').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-goal-button')) {
        const button = event.target;
        const goalId = button.getAttribute('data-goal-id');
        if (confirm("Are you sure you want to delete this goal?")) {
            fetch(`/delete_goal/${goalId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Response data:', data); // Log the response data to the console
                if (data.success) {
                    const row = button.closest(`tr[data-goal-id="${goalId}"]`);
                        if (row) {
                            row.remove();
                        }
                        // Refresh the goals list from the server
                        fetch('/get_goals')
                        .then(response => response.json())
                        .then(goals => {
                            // Clear the current goals table
                            const goalsTable = document.getElementById('goalsTable');
                            goalsTable.innerHTML = '';
                            // Populate the goals table with the updated data
                            goals.forEach(goal => {
                                const newRow = `
                                    <tr>
                                        <td>${goal.goalName}</td>
                                        <td>${goal.dueDate}</td>
                                        <td>${goal.priorityLevel}</td>
                                        <td><!-- Add progress here --></td>
                                        <td>
                                            <button class="edit-goal-button"></button>
                                            <button class="delete-goal-button" data-goal-id="${goal.id}" onclick="deleteGoal(this)"></button>
                                        </td>
                                    </tr>`;
                                goalsTable.insertAdjacentHTML('beforeend', newRow);
                            });
                        })
                } else {
                    alert('Failed to delete goal: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }
});

function addTasks() {
    // Create a new task div
    const newTask = document.createElement('div');
    newTask.className = 'task-content';

    // Create label for the task
    const newLabel = document.createElement('div');
    newLabel.className = 'task-label';
    newLabel.contentEditable = true; // Make the label editable
    newLabel.textContent = 'Title:';
    newTask.appendChild(newLabel);

    // Create delete button for task
    const deleteButton = document.createElement('div');
    deleteButton.className = 'delete-task-button';
    deleteButton.onclick = function() {
        newTask.remove(); // Remove the task div
    };
    newTask.appendChild(deleteButton);

    const clickableArea = document.createElement('div');
    clickableArea.className = 'clickable-area';
    newTask.appendChild(clickableArea);

    // Add an onclick event to show/hide information
    clickableArea.onclick = function() {
        toggleInfo(newTask);
    };
    
    // const editIcon = document.createElement('button');
    // editIcon.className = 'edit-icon';

    // Create text div for the task
    const newText = document.createElement('div');
    newText.className = 'task-text';
    newText.contentEditable = true;
    newText.textContent = '';
    newTask.appendChild(newText);

    // Insert the new task before the add button
    const container = document.querySelector('.task-container');
    const addButton = container.querySelector('.add-task-button');
    container.insertBefore(newTask, addButton);
}

function toggleInfo(task) {
    const taskText = task.querySelector('.task-text');

    if (taskText.style.display === 'none') {
        taskText.style.display = 'block';
    } else {
        taskText.style.display = 'none';
    }
}

// Apply click event listener and initial visibility for all existing tasks
document.addEventListener("DOMContentLoaded", function() {
    const tasks = document.querySelectorAll('.task-container .task-content');
    tasks.forEach(task => {
        // Create label for the task
        const newLabel = document.createElement('div');
        newLabel.className = 'task-label';
        newLabel.contentEditable = true; // Make the label editable
        newLabel.textContent = 'Title';
        task.appendChild(newLabel);

        // Create delete button for task
        const deleteButton = document.createElement('div');
        deleteButton.className = 'delete-task-button';
        deleteButton.onclick = function() {
            task.remove(); // Remove the task div
        };
        task.appendChild(deleteButton);

        const clickableArea = document.createElement('div');
        clickableArea.className = 'clickable-area';
        task.appendChild(clickableArea);

        const newText = document.createElement('div');
        newText.className = 'task-text';
        newText.contentEditable = true;
        newText.textContent = '';
        task.appendChild(newText);

        clickableArea.onclick = function() {
            toggleInfo(task);
        };
        const taskText = task.querySelector('.task-text');
        taskText.style.display = 'block'; 
        
    });
});

// Tree container js for choosing type of tree
const trees = [
    { name: 'Pine Tree', image: '/static/img/pine-tree.png', className: 'pine-tree' },
    { name: 'Birch Tree', image: '/static/img/birch-tree.png', className: 'birch-tree' },
    { name: 'Spruce Tree', image: '/static/img/spruce-tree.png', className: 'spruce-tree' },
    { name: 'Cedar Tree', image: '/static/img/cedar-tree.png', className: 'cedar-tree' }
];

let currentIndex = 0;

const treeImage = document.getElementById('tree-image');
const treeName = document.getElementById('tree-name');

document.getElementById('prev').addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? trees.length - 1 : currentIndex - 1;
    updateTree();
});

document.getElementById('next').addEventListener('click', () => {
    currentIndex = (currentIndex === trees.length - 1) ? 0 : currentIndex + 1;
    updateTree();
});

function updateTree() {
    const currentTree = trees[currentIndex];
    treeImage.src = currentTree.image;
    treeName.textContent = currentTree.name;
    treeImage.className = currentTree.className;
}