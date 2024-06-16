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
    const taskContainer = document.getElementById('task-container');
    const tasks = taskContainer.querySelectorAll('.task-content');
    
    // Reset the first task (index 0) without deleting it
    resetTask(tasks[0], false); 
    
    // Remove any tasks beyond the first one
    for (let i = 1; i < tasks.length; i++) {
        tasks[i].remove();
    }
}

// Function to create task content
function createTaskContent(label, text) {
    const taskContent = document.createElement('div');
    taskContent.classList.add('task-content');

    const taskLabel = document.createElement('div');
    taskLabel.classList.add('task-label');
    taskLabel.contentEditable = true; // Make the label editable
    taskLabel.textContent = label || 'Title';
    taskContent.appendChild(taskLabel);

    const clickableArea = document.createElement('div');
    clickableArea.className = 'clickable-area';
    taskContent.appendChild(clickableArea);

    clickableArea.onclick = function() {
        toggleInfo(taskContent);
    };

    const taskText = document.createElement('div');
    taskText.classList.add('task-text');
    taskText.contentEditable = true;
    taskText.textContent = text || '';
    taskContent.appendChild(taskText);

    return taskContent;
}

// Function to reset a single task content
function resetTask(taskContent, hasDeleteButton) {
    const taskLabel = taskContent.querySelector('.task-label');
    taskLabel.textContent = 'Title';
    taskLabel.contentEditable = true;

    const taskText = taskContent.querySelector('.task-text');
    taskText.textContent = '';
    taskText.contentEditable = true;

    // Show/hide delete button based on parameter
    const deleteButton = taskContent.querySelector('.delete-task-button');
    if (deleteButton) {
        deleteButton.style.display = hasDeleteButton ? 'block' : 'none';
    }
}

function resetTree() {
    let originalTreeIndex = 0;
    currentIndex = originalTreeIndex;
    updateTree();
}

function resetModal(modal) {
    const modalContent = modal.querySelector('.modal-content');

    document.querySelector(".container").appendChild(modal);  // Move the modal back
    modal.style.display = "none";
    document.querySelector(".container").classList.remove("blurred");
    modalContent.classList.remove("modal-active"); // Reset modal-active class
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
    
    if (modal.id === 'newGoalModal') {
        const goalForm = document.getElementById('goalForm');
        goalForm.reset(); // Reset the form data
        // Clear previous error messages
        resetTasks(); // Reset the task info
        resetTree(); // Reset the tree
    }
}

                    // ADD GOAL DOM LISTENER

document.addEventListener("DOMContentLoaded", () => {
    const newGoalModal = document.getElementById("newGoalModal");
    const modalContent = newGoalModal.querySelector(".modal-content"); 
    const continueButton = newGoalModal.querySelector(".continue-button");
    const backButton = newGoalModal.querySelector(".back-button");
    const finaliseButton = newGoalModal.querySelector(".finalise-button");
    const goalNameField = document.getElementById("goalName");
    const dueDateField = document.getElementById("dueDate");
    const priorityLevelField = document.getElementById("priorityLevel");
    const goalCategoryField = document.getElementById("goalCategory");
    const descriptionField = document.getElementById("description");

    document.getElementById("addGoalButton").onclick = function() {
        document.body.appendChild(newGoalModal);  // Move the modal to the body
        newGoalModal.style.display = "block";
        document.querySelector(".container").classList.add("blurred");
    }
    
    document.querySelector(".close-button").onclick = function() {
        resetModal(newGoalModal);
    }
    
    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == newGoalModal) {
            resetModal(newGoalModal);
        }
    });

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
                // Gather the goal form data
                const goalName = goalNameField.value.trim();
                const dueDate = dueDateField.value.trim();
                const priorityLevel = priorityLevelField.value.trim();
                const goalCategory = goalCategoryField.value.trim();
                const description = descriptionField.value.trim();
                const treeSelected = treeName.textContent.trim();

                // Gather the task data
                const tasks = [];
                document.querySelectorAll('#task-container .task-content').forEach(task => {
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
                                <button class="edit-goal-button" data-goal-id="${data.goalId}"></button>
                                <button class="delete-goal-button" data-goal-id="${data.goalId}"></button>
                            </td>
                        </tr>`;
                        document.querySelector("#goalsTable").insertAdjacentHTML('beforeend', newGoalRow); 

                        resetModal(newGoalModal);

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
    const continueButton = document.getElementById("continueButtonEdit");
    const backButton = document.getElementById("backButtonEdit");

    // Check to see if edit goal button is clicked, and determine which goal it has been clicked for 
    document.getElementById("goalsTable").addEventListener("click", function(event) {
        if (event.target && event.target.classList.contains('edit-goal-button')) {
            const button = event.target;
            const goalId = button.getAttribute('data-goal-id');
            console.log('Button clicked, goalId:', goalId); // Log goalId
            editGoalModal.setAttribute('data-goal-id', goalId);
            document.body.appendChild(editGoalModal);  // Move the modal to the body
            document.querySelector(".container").classList.add("blurred");
            editGoalModal.style.display = 'block';
            openEditModal(goalId);
        }
    });

    // Function for opening edit goal modal
    function openEditModal(goalId) {
        console.log('Fetching goal data for goalId:', goalId); // Log goalId before fetch 
        fetch(`/get_goal/${goalId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear previous sub-tasks
                const taskContainer = document.getElementById('task-container-edit');
                const tasks = taskContainer.querySelectorAll('.task-content');

                if (taskContainer) {
                    // Log task container before clearing
                    console.log('Task container before clearing:', taskContainer.innerHTML);

                    // Clear existing task contents
                    tasks.forEach(task => {
                        task.remove();
                    });

                    // Log task container after clearing
                    console.log('Task container after clearing:', taskContainer.innerHTML);

                    // Reset all input fields
                    document.getElementById('editGoalName').value = '';
                    document.getElementById('editDueDate').value = '';
                    document.getElementById('editPriorityLevel').value = '';
                    document.getElementById('editGoalCategory').value = '';
                    document.getElementById('editDescription').value = '';
                        
                    // Populate main goal details
                    document.getElementById('editGoalName').value = data.goal.goalName;
                    document.getElementById('editDueDate').value = data.goal.dueDate;
                    document.getElementById('editPriorityLevel').value = data.goal.priorityLevel;
                    document.getElementById('editGoalCategory').value = data.goal.goalCategory;
                    document.getElementById('editDescription').value = data.goal.description;

                    // Populate sub-tasks
                    data.goal.tasks.forEach((task, index) => {
                        const taskContent = createTaskContent(task.label, task.text); // Create task content with label and text
                        endButton = taskContainer.querySelector('add-task-button');

                        // Add delete button for tasks if needed
                        if (index > 0) {
                            const deleteButton = document.createElement('div');
                            deleteButton.className = 'delete-task-button';
                            deleteButton.onclick = function () {
                                taskContent.remove();
                            };
                            taskContent.appendChild(deleteButton);
                        }

                        // Append task content to task container
                        taskContainer.insertBefore(taskContent, endButton);
                    });

                    // Log task container after populating
                    console.log('Task container after populating:', taskContainer.innerHTML);
                } else {
                    console.error('Task container not found in DOM');
                }
            } else {
                alert('Failed to load goal data: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    closeEditButton.onclick = function() {
        resetModal(editGoalModal);
    }

    window.onclick = function(event) {
        if (event.target == editGoalModal) {
            resetModal(editGoalModal);
        }
    }

    continueButton.addEventListener("click", () => {
        const goalNameField = document.getElementById("editGoalName");
        const dueDateField = document.getElementById("editDueDate");
        const priorityLevelField = document.getElementById("editPriorityLevel");
        const goalCategoryField = document.getElementById("editGoalCategory");
        const descriptionField = document.getElementById("editDescription");
        
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
            modalContentEdit.classList.add("modal-active");

        }
    });

    backButton.addEventListener("click", () => {
        modalContentEdit.classList.remove("modal-active");
    })

    saveEditButton.onclick = function() {
        const goalId = editGoalModal.getAttribute('data-goal-id');
        const goalName = document.getElementById('editGoalName').value.trim();
        const dueDate = document.getElementById('editDueDate').value.trim();
        const priorityLevel = document.getElementById('editPriorityLevel').value.trim();
        const goalCategory = document.getElementById('editGoalCategory').value.trim();
        const description = document.getElementById('editDescription').value.trim();

        const tasks = [];
        document.querySelectorAll('#task-container-edit .task-content').forEach(task => {
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
    newLabel.textContent = 'Title';
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
    
    // Create text div for the task
    const newText = document.createElement('div');
    newText.className = 'task-text';
    newText.contentEditable = true;
    newText.textContent = '';
    newTask.appendChild(newText);

    // Find the container to insert new task
    const container = document.getElementById('task-container');
    if (container) {
        // Insert the new task before the add button if it exists
        const addButton = container.querySelector('.add-task-button');
        if (addButton) {
            container.insertBefore(newTask, addButton);
        } else {
            container.appendChild(newTask); // Fallback if addButton is not found
        }
    } else {
        console.error('task-container not found in DOM');
    }
}

function toggleInfo(taskContent) {
    const taskText = taskContent.querySelector('.task-text');

    if (taskText.style.display === 'none') {
        taskText.style.display = 'block';
    } else {
        taskText.style.display = 'none';
    }
}

// Apply click event listener and initial visibility for existing task
document.addEventListener("DOMContentLoaded", function() {
    const tasks = document.querySelectorAll('.task-container .task-content');
    tasks.forEach(task => {
        // Create label for the task
        const newLabel = document.createElement('div');
        newLabel.className = 'task-label';
        newLabel.contentEditable = true; // Make the label editable
        newLabel.textContent = 'Title';
        task.appendChild(newLabel);

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
