
// Function to reset tasks to default (used when resetting modal)
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

// Function to reset a single task content, used in conjunction with resetTasks()
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

// Function to reset tree when opening new modal
function resetTree() {
    let originalTreeIndex = 0;
    currentIndex = originalTreeIndex;
    updateTree();
}

// Function to reset modal so that information doesn't linger from previous instance
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

// Function for adding tasks when add task button is clicked within add goal modal
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

// Toggle task text when clickable area (diamond) is clicked
function toggleInfo(taskContent) {
    const taskText = taskContent.querySelector('.task-text');

    if (taskText.style.display === 'none') {
        taskText.style.display = 'block';
    } else {
        taskText.style.display = 'none';
    }
}

// Function to fetch goal information
function fetchGoal(goalId) {
    return fetch(`/get_goal/${goalId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json());
}

// Function to update user information on profile page
function updateUserInfo(user) {
    // Replace text content with new information from database
    document.getElementById('user-prestige-level').textContent = user.prestige_level;
    document.getElementById('pine-tree-number').textContent = user.pine_tree_number;
    document.getElementById('spruce-tree-number').textContent = user.spruce_tree_number;
    document.getElementById('birch-tree-number').textContent = user.birch_tree_number;
    document.getElementById('cedar-tree-number').textContent = user.cedar_tree_number;
}

// Provide 'user' to updateUserInfo() to update user info
function performActionThatUpdatesUserInfo() {
    getUserId().then(userId => {
        if (userId) {
            fetch(`/user_info?user_id=${userId}`) // Replace with your actual endpoint
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const updatedUser = data.user_data;
                        
                        // Update the user info dynamically
                        updateUserInfo(updatedUser);
                    } else {
                        console.error('Failed to update user data:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }).catch(error => {
        console.error('Error fetching user ID:', error);
    });
}

// Function to create task content
function createTaskContent(goalId, taskId, label, text, completed) {
    // Create task content div
    const taskContent = document.createElement('div');
    taskContent.classList.add('task-content');
    if (completed) {
        taskContent.classList.add('completed');
    }

    // Create task label (title) div
    const taskLabel = document.createElement('div');
    taskLabel.classList.add('task-label');
    taskLabel.contentEditable = true; // Make the label editable
    taskLabel.textContent = label || 'Title';
    taskContent.appendChild(taskLabel);

    // Create clickable area (diamond) div
    const clickableArea = document.createElement('div');
    clickableArea.className = 'clickable-area';
    taskContent.appendChild(clickableArea);

    clickableArea.onclick = function() {
        toggleInfo(taskContent);
    };

    // Create tick icon 
    const tickIcon = document.createElement('div');
    tickIcon.className = 'complete-task-button';
    taskContent.appendChild(tickIcon);

    // Functionality to mark task as completed
    tickIcon.onclick = function() {
        // Check if the task is already completed
    if (!taskContent.classList.contains('completed')) {
        // Mark the task as completed
        taskContent.classList.add('completed');
        // Update the tree stage by incrementing
        updateTreeStage(goalId);
    }
    };

    const taskText = document.createElement('div');
    taskText.classList.add('task-text');
    taskText.contentEditable = true;
    taskText.textContent = text || '';
    taskContent.appendChild(taskText);

    return taskContent;
}



// Function to add a new category
function addCategory(category_name) {
    getUserId().then(user_id => {
        fetch('/add_category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: user_id, category_name: category_name }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.message); });
            }
            return response.json();
        })
        .then(data => {
            updateCategoryDropdown('goalCategory');
            updateCategoryDropdown('editGoalCategory');
            updateCategoriesContainer();
        })
        .catch(error => {
            console.error('Error adding category:', error);
            showAlert('Failed to add category. Please try again.');
        });
    });
}

// Function to update the dropdown menu with categories
function updateCategoryDropdown(selectId) {
    const goalCategoryDropdown = document.getElementById(selectId);
    if (!goalCategoryDropdown) {
        console.error(`Element with id "${selectId}" not found.`);
        return;
    }
    getUserId().then(user_id => {
        fetch(`/categories/${user_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch categories.');
            }
            return response.json();
        })
        .then(data => {
            const preMadeCategories = ['Personal', 'Professional', 'Health'];

            // Clear existing user-added categories
            for (let i = goalCategoryDropdown.options.length - 1; i >= 0; i--) {
                const option = goalCategoryDropdown.options[i];
                if (!preMadeCategories.includes(option.value)) {
                    goalCategoryDropdown.remove(i);
                }
            }

            // Add categories from data to the dropdown
            data.categories.forEach(category => {
                if (!preMadeCategories.includes(category.name)) {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    goalCategoryDropdown.appendChild(option);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            showAlert('Failed to fetch categories. Please try again.');
        });
    });
}

// Re-bind click events after categories are updated
function updateCategoriesContainer() {
    getUserId().then(user_id => {
        fetch(`/categories/${user_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch categories.');
                }
                return response.json();
            })
            .then(data => {
                const categoriesContainer = document.querySelector('.goals-categories-container');

                // Remove dynamically added categories
                const preMadeCategories = ['personal', 'professional', 'health', 'all'];
                const categoryElements = categoriesContainer.querySelectorAll('.category');
                categoryElements.forEach(categoryElement => {
                    if (!preMadeCategories.includes(categoryElement.getAttribute('data-category'))) {
                        categoriesContainer.removeChild(categoryElement);
                    }
                });

                // Add categories from data to the container
                data.categories.forEach(category => {
                    if (!preMadeCategories.includes(category.name.toLowerCase())) {
                        const categoryDiv = document.createElement('div');
                        categoryDiv.className = 'category';
                        categoryDiv.setAttribute('data-category', category.name.toLowerCase());
                        categoryDiv.setAttribute('data-category-id', category.id); // Add category ID to the div
                        categoryDiv.textContent = category.name;

                        categoriesContainer.appendChild(categoryDiv);
                    }
                });

                // Remove any existing delete button
                const existingDeleteButton = document.querySelector('.delete-category-button');
                if (existingDeleteButton) {
                    existingDeleteButton.remove();
                }

                // Add the delete button at the end of the container
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-category-button';
                deleteButton.textContent = 'X';
                deleteButton.addEventListener('click', deleteSelectedCategory);
                categoriesContainer.appendChild(deleteButton);

                // Re-bind click events to the updated categories
                bindCategoryClickEvents();
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                showAlert('Failed to fetch categories. Please try again.');
            });
    });
}

// Function to get the category name based on its attribute value
function getCategoryName(categoryName) {
    return fetch(`/get_category_name?category_name=${encodeURIComponent(categoryName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch category name.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                return data.category_name;
            } else {
                console.error(`Error fetching category name: ${data.message}`);
                throw new Error(data.message);
            }
        })
        .catch(error => {
            console.error('Error in getCategoryName:', error);
            throw error;
        });
}

// Function to delete the selected category and its goals
function deleteSelectedCategory() {
    const selectedCategory = document.querySelector('.category.category-active');
    if (!selectedCategory) {
        showAlert('Please select a category to delete.');
        return;
    }

    const categoryName = selectedCategory.getAttribute('data-category').toLowerCase();

    // List of protected categories
    const protectedCategories = ['all', 'personal', 'health', 'professional'];

    // Check if the selected category is protected
    if (protectedCategories.includes(categoryName.toLowerCase())) {
        showAlert(`The category "${categoryName}" cannot be deleted.`);
        return;
    }

    showPrompt('customPromptConfirmation', 'promptSubmitButtonConfirmation');


    // Remove any existing event listeners on the OK button to avoid multiple triggers
    const submitButton = document.getElementById("promptSubmitButtonConfirmation");
    submitButton.replaceWith(submitButton.cloneNode(true));

    // Handle OK button click
    document.getElementById("promptSubmitButtonConfirmation").addEventListener("click", function() {
        getCategoryName(categoryName).then((categoryName) => {
    
            fetch(`/delete_category_and_goals/${encodeURIComponent(categoryName)}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete category.');
                }
                return response.json();
            })
            .then(data => {
                updateCategoriesContainer();
                updateCategoryDropdown('goalCategory');
                updateCategoryDropdown('editGoalCategory');
    
                // Remove the goals associated with the deleted category from the table
                const goalsTable = document.getElementById('goalsTable');
                const rows = goalsTable.querySelectorAll(`#goalsTable tr[data-category="${categoryName}"]`);
                rows.forEach(row => row.remove());
                goalsInProgress = data.total_goals - data.completed_goals;
                $('h1#total-goals-count').text(data.total_goals);
                $('h1#completed-goals-count').text(data.completed_goals);
                $('h1#goals-in-progress-count').text(goalsInProgress);
                fetchAndPopulateGoals('/upcoming_goals', '#upcomingGoalsTable tbody');
                closePrompt('customPromptConfirmation');
            })
            .catch(error => {
                console.error('Error deleting category:', error);
                showAlert('Failed to delete category. Please try again.');
            });
        }).catch(error => {
            console.error('Error fetching category name:', error);
            showAlert('Failed to fetch category name. Please try again.');
        });
    });
}

// Function to get the user ID
function getUserId() {
    return fetch('/get_user_id')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user ID.');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            return data.user_id;
        })
        .catch(error => {
            console.error('Error fetching user ID:', error);
            showAlert('Failed to fetch user ID. Please try again.');
        });
}

// Ajax request to update dashboard information upon page reload
$(document).ready(function() {
    getUserId().then(userId => {
        if (!userId) {
            return;
        }

        $.ajax({
            url: `/get_total_and_completed_goals/${userId}`,
            type: 'GET',
            success: function(response) {
                if (response.success) {
                    const totalGoals = response.total_goals;
                    $('h1#total-goals-count').text(totalGoals);
                    const completedGoals = response.completed_goals;
                    $('h1#completed-goals-count').text(completedGoals);
                    const goalsInProgress = totalGoals - completedGoals;
                    $('h1#goals-in-progress-count').text(goalsInProgress);
                } else {
                    console.error('Error fetching total goals:', response.message);
                }
            },
            error: function(error) {
                console.error('Error fetching total goals:', error);
            }
        });
    });
});

// Function to handle category click
function handleCategoryClick(event) {
    const clickedCategory = event.target;
    const categories = document.querySelectorAll('.goals-categories-container .category');

    // Remove category-active class from all categories
    categories.forEach(category => {
        category.classList.remove('category-active');
    });

    // Add category-active class to the clicked category
    clickedCategory.classList.add('category-active');

    // Get the category name
    const category = clickedCategory.getAttribute('data-category');

    // Filter goals based on the selected category
    filterGoalsByCategory(category);
}

// Add an "All" category to show all goals
function addAllCategory() {
    const allCategory = document.createElement('div');
    allCategory.className = 'category category-active';
    allCategory.setAttribute('data-category', 'all');
    allCategory.textContent = 'All';
    allCategory.addEventListener('click', handleCategoryClick);
    document.querySelector('.goals-categories-container').prepend(allCategory);
}

// Function to update the goals table based on selected category
function filterGoalsByCategory(category) {
    const goalsTable = document.getElementById('goalsTable');
    const rows = goalsTable.getElementsByTagName('tr');

    for (let row of rows) {
        const rowCategory = row.getAttribute('data-category');

        if (!rowCategory || category === 'all' || rowCategory.toLowerCase() === category.toLowerCase()) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

// Function to bind click events to categories
function bindCategoryClickEvents() {
    const categories = document.querySelectorAll('.goals-categories-container .category');
    categories.forEach(category => {
        category.removeEventListener('click', handleCategoryClick); // Remove any previous event listeners
        category.addEventListener('click', handleCategoryClick);
    });
}

// Function to add goal
function addGoal(data, goalCategory, goalName, dueDate, priorityLevel) {
    // Create a new table row
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-goal-id', data.goalId);
    newRow.setAttribute('data-category', goalCategory);

    // Create cells for each detail
    const nameCell = document.createElement('td');
    nameCell.textContent = goalName;
    nameCell.classList.add('goal-name-cell'); 
    newRow.appendChild(nameCell);

    const dueDateCell = document.createElement('td');
    dueDateCell.textContent = dueDate;
    newRow.appendChild(dueDateCell);

    const priorityCell = document.createElement('td');
    priorityCell.textContent = priorityLevel;
    newRow.appendChild(priorityCell);

    // Calculate and update the progress percentage
    const progressCell = document.createElement('td');
    progressCell.textContent = '0.0%';
    progressCell.classList.add('progress-cell');
    newRow.appendChild(progressCell);

    const actionCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.setAttribute('data-goal-id', data.goalId);
    editButton.classList.add('edit-goal-button'); 
    actionCell.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-goal-id', data.goalId);
    deleteButton.classList.add('delete-goal-button'); 
    actionCell.appendChild(deleteButton);

    newRow.appendChild(actionCell);

    // Append the new row to the goals table
    document.getElementById('goalsTable').appendChild(newRow);

    resetModal(newGoalModal);
    bindCategoryClickEvents();
}

// Function for selecting tree to plant in garden
function selectTree(frameNumber) {
    getUserId()
        .then(userId => {
            const treeTypes = ['Pine Tree', 'Spruce Tree', 'Birch Tree', 'Cedar Tree'];

            // Display the custom modal for tree selection
            showPrompt('customPromptTree', 'treeSelection');

            const submitButton = document.getElementById('promptSubmitButtonTree');
            const treeSelection = document.getElementById('treeSelection');

            // Remove any existing event listeners on the submit button to avoid multiple triggers
            submitButton.replaceWith(submitButton.cloneNode(true));
            const newSubmitButton = document.getElementById('promptSubmitButtonTree');

            newSubmitButton.addEventListener('click', function() {
                const selectedTreeIndex = parseInt(treeSelection.value);

                if (!isNaN(selectedTreeIndex) && selectedTreeIndex >= 1 && selectedTreeIndex <= 4) {
                    const selectedTreeType = treeTypes[selectedTreeIndex - 1];

                    fetch(`/check_tree_availability/${userId}/${selectedTreeType}`)
                        .then(response => response.json())
                        .then(data => {

                            if (data.available) {
                                const treeFrame = document.getElementById(`tree${frameNumber}Frame`);
                                const imageName = `${selectedTreeType.toLowerCase().replace(' ', '-')}-stage-3`;
                                treeFrame.style.backgroundImage = `url('/static/img/${imageName}.png')`;

                                // Hide the add-tree-button after a tree is added
                                const addTreeButton = document.getElementById(`addTreeButton${frameNumber}`);
                                if (addTreeButton) {
                                    addTreeButton.classList.add('add-tree-button-active');
                                }

                                checkFramesAndIncreasePrestige();

                                // Update the tree type in the database
                                fetch(`/update_tree_type/${userId}/${frameNumber}`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ tree_type: selectedTreeType })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    if (!data.success) {
                                        console.error('Failed to update tree type:', data.message);
                                    }
                                    performActionThatUpdatesUserInfo();
                                })
                                .catch(error => {
                                    console.error('Error updating tree type:', error);
                                });

                                // Close the custom modal after submission
                                closePrompt('customPromptTree');

                            } else {
                                showAlert(`You don't have a ${selectedTreeType}.`);
                                closePrompt('customPromptTree');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                } else {
                    showAlert('Please select a valid tree.');
                }
            });

        })
        .catch(error => {
            console.error('Error fetching user ID:', error);
            showAlert('Failed to fetch user ID. Please try again.');
        });
}

// Function for checking whether frames are full and increasing prestige dynamically
function checkFramesAndIncreasePrestige() {
    getUserId()
        .then(userId => {
            fetch(`/check_frames_and_increase_prestige/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('Prestige level increased and frames reset!');
                    // Reset the frames in the UI
                    for (let i = 1; i <= 3; i++) {
                        const treeFrame = document.getElementById(`tree${i}Frame`);
                        treeFrame.style.backgroundImage = '';

                        const addTreeButton = document.getElementById(`addTreeButton${i}`);
                        if (addTreeButton) {
                            addTreeButton.classList.remove('add-tree-button-active');
                        }
                    }
                } else {
                    return;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('An error occurred. Please try again.');
            });
        })
        .catch(error => {
            console.error('Error fetching user ID:', error);
            showAlert('Failed to fetch user ID. Please try again.');
        });
}

// Function for showing custom alert
function showAlert(message) {
    const alertMessageElement = document.getElementById('alertMessage-custom');
    if (alertMessageElement) {
        alertMessageElement.textContent = message;
        document.getElementById('customAlert').style.display = 'block';
    } else {
        console.error('Element with ID "alertMessage-custom" not found.');
    }
}

// Function for closing custom alert
function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

// Function for showing custom prompt
function showPrompt(modalId, inputId) {
    const modal = document.getElementById(modalId);
    const promptInput = document.getElementById(inputId);
    // Check if the element is an input before setting its value
    if (promptInput.tagName.toLowerCase() === 'input') {
        promptInput.value = '';
    }
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error(`Modal with ID "${modalId}" not found.`);
    }
}

// Function for closing custom prompt
function closePrompt(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error(`Modal with ID "${modalId}" not found.`);
    }
}

// Dom listener gor graphical analysis. Functions defined within to identify instances of chart
document.addEventListener("DOMContentLoaded", () => {
    var modal = document.getElementById("graphicalAnalysisModal");
    var btn = document.getElementById("graphicalAnalysisButton");
    var span = document.getElementsByClassName("close-button")[0];
    var goalCompletionChart;

    // Fetch goal completion data and generate chart when graphical analysis button is clicked
    btn.onclick = function () {
        getUserId()
            .then(user_id => {
                if (!user_id) {
                    throw new Error('User ID is undefined or null.');
                }
                return fetchGoalCompletionData(user_id);
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0 || !data[0].hasOwnProperty('category')) {
                    throw new Error('Invalid data structure received. Data received:', data);
                }

                const categories = data.map(item => item.category);
                const completed_goals = data.map(item => item.completed_goals);
                const total_goals = data.map(item => item.total_goals);
                const goals_in_progress = data.map(item => item.goals_in_progress);

                generateChart(categories, completed_goals, total_goals, goals_in_progress);
                modal.style.display = "block";
            })
            .catch(error => {
                console.error('Error in graphical analysis:', error);
                showAlert('Failed to perform graphical analysis. Please try again.');
            });
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // Function for fetching goal completion data, including total goals, completed goals and goals in progress
    function fetchGoalCompletionData(user_id) {
        return fetch(`/get_goal_completion_data/${user_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch goal completion data.');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }

                return data;
            })
            .catch(error => {
                console.error('Error fetching goal completion data:', error);
                throw error;
            });
    }

    // Function for generating chart 
    function generateChart(categories, completedGoals, totalGoals, goalsInProgress) {
        if (goalCompletionChart instanceof Chart) {
            goalCompletionChart.destroy();
        }

        const ctx = document.getElementById('goalCompletionChart').getContext('2d');

        goalCompletionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                        label: 'Total Goals',
                        data: totalGoals,
                        backgroundColor: 'rgba(76, 175, 80, 0.2)', /* Softer green */
                        borderColor: 'rgba(76, 175, 80, 1)', /* Softer green */
                        borderWidth: 1
                    },
                    {
                        label: 'Completed Goals',
                        data: completedGoals,
                        backgroundColor: 'rgba(244, 67, 54, 0.2)', /* Softer red */
                        borderColor: 'rgba(244, 67, 54, 1)', /* Softer red */
                        borderWidth: 1
                    },
                    
                    {
                        label: 'Goals In Progress',
                        data: goalsInProgress,
                        backgroundColor: 'rgba(33, 150, 243, 0.2)', /* Softer blue */
                        borderColor: 'rgba(33, 150, 243, 1)', /* Softer blue */
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});

// Function for updating upcoming goals table 
function fetchAndPopulateGoals(url, tableBodySelector) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const tableBody = document.querySelector(tableBodySelector);
        tableBody.innerHTML = '';  // Clear existing table rows
        
        data.upcoming_goals.forEach(goal => {
          const progress = goal.total_tasks > 0 ? ((goal.completed_tasks / goal.total_tasks) * 100).toFixed(2) + '%' : '0%';
          const row = `
            <tr data-category="${goal.goal_category}" data-goal-id="${goal.id}">
              <td class="goal-name-cell">${goal.goal_name}</td>
              <td>${goal.due_date}</td>
              <td>${goal.priority_level}</td>
              <td class="progress-cell">${progress}</td>
            </tr>
          `;
          tableBody.innerHTML += row;  // Append each row to the table body
        });
      })
      .catch(error => console.error('Error fetching goals:', error));
}

// Function for toggling password visibility in profile page
function togglePasswordVisibility() {
    const togglePasswordButton = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('user-password');

    togglePasswordButton.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon class
        if (type === 'password') {
            togglePasswordButton.classList.remove('ri-eye-line');
            togglePasswordButton.classList.add('ri-eye-off-line');
        } else {
            togglePasswordButton.classList.remove('ri-eye-off-line');
            togglePasswordButton.classList.add('ri-eye-line');
        }
    });
}

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

    // Code to update profile image
    document.getElementById('input-file').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            getUserId().then(user_id => {
                if (!user_id) {
                    console.error('User ID is not available.');
                    return;
                }
    
                const reader = new FileReader();
                reader.onload = function(e) {
                    const defaultProfilePicElement = document.getElementById('profile-pic-default');
                    const profilePicElement = document.getElementById('profile-pic');
    
                    if (defaultProfilePicElement) {
                        defaultProfilePicElement.src = e.target.result; // Update default image src
                    }
    
                    if (profilePicElement) {
                        profilePicElement.src = e.target.result; // Update profile image src
                    }
    
                    // Create a FormData object
                    const formData = new FormData();
                    formData.append('profile_image', file);
                    formData.append('user_id', user_id);
    
                    // Send the file data to the server
                    fetch('/upload_profile_image', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            const profilePicDashboardElement = document.getElementById('profile-pic-dashboard');
                            if (profilePicDashboardElement) {
                                profilePicDashboardElement.src = data.profile_image_url;
                            }
                            const profilePicDashboardDefaultElement = document.getElementById('profile-pic-dashboard-default');
                            if (profilePicDashboardDefaultElement) {
                                profilePicDashboardDefaultElement.src = data.profile_image_url;
                            }
                        } else {
                            console.error('Failed to update profile image:', data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
                reader.readAsDataURL(file);
            }).catch(error => {
                console.error('Error fetching user ID:', error);
            });
        }
    });

    getUserId().then(userId => {
        if (userId) {
            fetch(`/user_info?user_id=${userId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const user = data.user_data;
                        document.getElementById('user-email').textContent = user.email;
                        document.getElementById('user-password').value = user.password;
                        updateUserInfo(user);
                        // Initial setup for password visibility toggle
                        togglePasswordVisibility(); // Call function to set initial state
                    } else {
                        console.error('Failed to fetch user data:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }).catch(error => {
        console.error('Error fetching user ID:', error);
    });

    $('#logout-button').on('click', function() {
        $.ajax({
            type: 'GET',
            url: '/logout',
            success: function(response) {
                // Handle successful logout
                window.location.href = '/'; // Redirect to login page
            },
            error: function(error) {
                // Handle error
                console.error('Logout error:', error.responseJSON.message);
            }
        });
    });
  
  

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
    const addCategoryButton = document.querySelector('.add-category-button');
    
    // custom calendar 
    flatpickr("#dueDate", {
        dateFormat: "Y-m-d",
        minDate: "today" // Disallow dates in the past
    });

    fetchAndPopulateGoals('/upcoming_goals', '#upcomingGoalsTable tbody');
    updateCategoryDropdown('goalCategory');
    updateCategoriesContainer();
    addAllCategory();
    getUserId()
        .then(userId => {
            fetch(`/get_tree_types/${userId}`)
                .then(response => response.json())
                .then(data => {
                    for (let i = 1; i <= 3; i++) {
                        const treeType = data[`frame${i}_type`];
                        if (treeType) {
                            const treeFrame = document.getElementById(`tree${i}Frame`);
                            const imageName = `${treeType.toLowerCase().replace(' ', '-')}-stage-3`;
                            treeFrame.style.backgroundImage = `url('/static/img/${imageName}.png')`;
                            const addTreeButton = document.getElementById(`addTreeButton${i}`);
                            if (addTreeButton) {
                                addTreeButton.classList.add('add-tree-button-active');
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching tree types:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching user ID:', error);
            showAlert('Failed to fetch user ID. Please try again.');
        });

    // Add Category button click handler
    addCategoryButton.addEventListener("click", () => {
        const promptInput = document.getElementById('promptInputCategory');
        const submitButton = document.getElementById('promptSubmitButtonCategory');

        showPrompt('customPromptCategory', 'promptInputCategory');

        // Remove any existing event listeners on the submit button to avoid multiple triggers
        submitButton.replaceWith(submitButton.cloneNode(true));
        const newSubmitButton = document.getElementById('promptSubmitButtonCategory');

            // Handle submission of the custom prompt form
        newSubmitButton.addEventListener('click', () => {
            const category_name = promptInput.value.trim();
            if (category_name !== "") {
                addCategory(category_name);
                closePrompt('customPromptCategory');
            }
        })
    });
    
    // Add goal button click to open add goal modal
    document.getElementById("addGoalButton").onclick = function() {
        document.body.appendChild(newGoalModal);  // Move the modal to the body
        newGoalModal.style.display = "block";
        document.querySelector(".container").classList.add("blurred");
    }
    
    document.getElementById("close-button-newgoal").onclick = function() {
        resetModal(newGoalModal);
    }
    
    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == newGoalModal) {
            resetModal(newGoalModal);
        }
    });

    // After clicking continue button
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
                        text: task.querySelector('.task-text').textContent.trim(),
                        completed: task.classList.contains('completed')
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
                        $('h1#total-goals-count').text(data.total_goals);
                        const goalsInProgress = data.total_goals - data.completed_goals;
                        $('h1#goals-in-progress-count').text(goalsInProgress);
                        showAlert('Goal saved successfully!'); 
                        // Append the new goal to the table using the refreshGoals function
                        addGoal(data, goalCategory, goalName, dueDate, priorityLevel);
                        fetchAndPopulateGoals('/upcoming_goals', '#upcomingGoalsTable tbody');

                    } else {
                        showAlert('Failed to save goal: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
    
    // Back button for moving back to first seciton of add goal container
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

    updateCategoryDropdown('editGoalCategory');

    // Custom calendar for edit goal modal
    flatpickr("#editDueDate", {
        dateFormat: "Y-m-d",
        minDate: "today"
    });

    // Check to see if edit goal button is clicked, and determine which goal it has been clicked for 
    document.getElementById("goalsTable").addEventListener("click", function(event) {
        if (event.target && event.target.classList.contains('edit-goal-button')) {
            const button = event.target;
            const goalId = button.getAttribute('data-goal-id');
            editGoalModal.setAttribute('data-goal-id', goalId);
            document.body.appendChild(editGoalModal);  // Move the modal to the body
            document.querySelector(".container").classList.add("blurred");
            editGoalModal.style.display = 'block';
            openEditModal(goalId);
        }
    });

    // Function for opening edit goal modal
    function openEditModal(goalId) {
        fetch(`/get_goal/${goalId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear previous sub-tasks
                const taskContainer = document.getElementById('task-container-edit');
                const tasks = taskContainer.querySelectorAll('.task-content');
                
                if (taskContainer) {

                    // Clear existing task contents
                    tasks.forEach(task => {
                        task.remove();
                    });

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
                    data.goal.tasks.forEach(task => {
                        const taskContent = createTaskContent(data.goal.id, task.id, task.label, task.text, task.completed); // Create task content with label and text
                        endButton = taskContainer.querySelector('.end-line');

                        // Append task content to task container
                        taskContainer.insertBefore(taskContent, endButton);
                    });

                    // Fetch tree info
                    const treeName = data.goal.treeSelected;
                    fetchTreeInfo(treeName, data.goal.total_tasks, data.goal.completed_tasks);

                } else {
                    console.error('Task container not found in DOM');
                }
            } else {
                showAlert('Failed to load goal data: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Close button
    closeEditButton.onclick = function() {
        resetModal(editGoalModal);
    }

    // Close when clicking outside modal
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

    // Finalise button for edits
    saveEditButton.onclick = function() {
        const goalId = editGoalModal.getAttribute('data-goal-id');
        const goalName = document.getElementById('editGoalName').value.trim();
        const dueDate = document.getElementById('editDueDate').value.trim();
        const priorityLevel = document.getElementById('editPriorityLevel').value.trim();
        const goalCategory = document.getElementById('editGoalCategory').value.trim();
        const description = document.getElementById('editDescription').value.trim();
        
        const tasks = [];
        let completedTasks = 0;
        
        document.querySelectorAll('#task-container-edit .task-content').forEach(task => {
            const completed = task.classList.contains('completed');
            if (completed) {
                completedTasks++; // Increment completed tasks
            }
            tasks.push({
                id: task.getAttribute('data-task-id'), 
                label: task.querySelector('.task-label').textContent.trim(),
                text: task.querySelector('.task-text').textContent.trim(),
                completed: completed
            });
        });
        
        const totalTasks = tasks.length;
        const allTasksCompleted = (completedTasks === totalTasks);
        
        if (allTasksCompleted) {
            // Send a POST request to complete the goal if all tasks are completed
            fetch(`/complete_goal/${goalId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('Goal completed successfully!');
                    const row = document.querySelector(`#goalsTable tr[data-goal-id="${goalId}"]`);
                    if (row) {
                        row.remove(); // Remove goal from table
                    }
                    document.querySelector('h1#completed-goals-count').innerText = data.completed_goals;
                    goalsInProgress = data.total_goals - data.completed_goals;
                    document.querySelector('h1#goals-in-progress-count').innerText = goalsInProgress;
                    fetchAndPopulateGoals('/upcoming_goals', '#upcomingGoalsTable tbody');
                    resetModal(editGoalModal);
                    performActionThatUpdatesUserInfo();
                } else {
                    showAlert('Failed to complete goal: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            // Send a PUT request to update the goal
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
                    showAlert('Goal updated successfully!');
                    const row = document.querySelector(`#goalsTable tr[data-goal-id="${goalId}"]`);
                    if (row) {
                        row.querySelector('td:nth-child(1)').textContent = goalName;
                        row.querySelector('td:nth-child(2)').textContent = dueDate;
                        row.querySelector('td:nth-child(3)').textContent = priorityLevel;
                        
                        // Update the category attribute of the row
                        row.setAttribute('data-category', goalCategory);
                        
                        // Calculate and update the progress percentage
                        const progressCell = row.querySelector('.progress-cell');
                        if (progressCell) {
                            const progressPercentage = (totalTasks > 0) ? ((completedTasks / totalTasks) * 100).toFixed(2) : '0';
                            progressCell.textContent = `${progressPercentage}%`;
                        } else {
                            console.error('Progress cell not found for goal:', goalId);
                        }
                        // Reapply the category filter to ensure the row is displayed in the correct category
                        const activeCategory = document.querySelector('.goals-categories-container .category-active').getAttribute('data-category');
                        filterGoalsByCategory(activeCategory);
                        fetchAndPopulateGoals('/upcoming_goals', '#upcomingGoalsTable tbody'); // Ensure that progress is dynamically updated for goals when save button is clicked

                    }
                    resetModal(editGoalModal);
                } else {
                    showAlert('Failed to update goal: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };
});

// Attach event listener to the goals table for delete button and edit button clicks
document.getElementById('goalsTable').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-goal-button')) {
        const button = event.target;
        const goalId = button.getAttribute('data-goal-id');
        showPrompt('customPromptConfirmationGoal', 'promptSubmitButtonConfirmationGoal');

        // Remove any existing event listeners on the OK button to avoid multiple triggers
        const submitButton = document.getElementById("promptSubmitButtonConfirmationGoal");
        submitButton.replaceWith(submitButton.cloneNode(true));

        // Handle OK button click
        document.getElementById("promptSubmitButtonConfirmationGoal").addEventListener("click", function() {
            // Send a DELETE request if all tasks are completed
            fetch(`/delete_goal/${goalId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const row = document.querySelector(`#goalsTable tr[data-goal-id="${goalId}"]`);
                    if (row) {
                        row.remove(); // Remove goal from table
                    }
                    // Update the total goals count
                    document.querySelector('h1#total-goals-count').innerText = data.total_goals;
                    goalsInProgress = data.total_goals - data.completed_goals;
                    document.querySelector('h1#goals-in-progress-count').innerText = goalsInProgress;
                    fetchAndPopulateGoals('/upcoming_goals', '#upcomingGoalsTable tbody');
                    resetModal(editGoalModal);
                    closePrompt('customPromptConfirmationGoal');
                } else {
                    showAlert('Failed to delete goal: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });    
        });
    }
});



// Apply click event listener and initial visibility for existing task
document.addEventListener("DOMContentLoaded", function() {
    const tasks = document.querySelectorAll('#task-container .task-content');
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

// When previous arrow is clicked, go back one element in the list
document.getElementById('prev').addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? trees.length - 1 : currentIndex - 1;
    updateTree();
});

// When next arrow is clicked, go forward one element in the list
document.getElementById('next').addEventListener('click', () => {
    currentIndex = (currentIndex === trees.length - 1) ? 0 : currentIndex + 1;
    updateTree();
});

// Change tree image
function updateTree() {
    const currentTree = trees[currentIndex];
    treeImage.src = currentTree.image;
    treeName.textContent = currentTree.name;
    treeImage.className = currentTree.className;
}

const treeStages = {
    'Pine Tree': [
        { image: '/static/img/seed-image.png', className: 'tree-seed' },
        { image: '/static/img/pine-tree.png', className: 'pine-tree' },
        { image: '/static/img/pine-tree-stage-3.png', className: 'pine-tree' }
    ],
    'Birch Tree': [
        { image: '/static/img/seed-image.png', className: 'tree-seed' },
        { image: '/static/img/birch-tree.png', className: 'birch-tree' },
        { image: '/static/img/birch-tree-stage-3.png', className: 'birch-tree' }
    ],
    'Spruce Tree': [
        { image: '/static/img/seed-image.png', className: 'tree-seed' },
        { image: '/static/img/spruce-tree.png', className: 'spruce-tree' },
        { image: '/static/img/spruce-tree-stage-3.png', className: 'spruce-tree' }
    ],
    'Cedar Tree': [
        { image: '/static/img/seed-image.png', className: 'tree-seed' },
        { image: '/static/img/cedar-tree.png', className: 'cedar-tree' },
        { image: '/static/img/cedar-tree-stage-3.png', className: 'cedar-tree' }
    ]
};

// Function to update tree stage (grow the tree)
function updateTreeStage(goalId) {
    fetchGoal(goalId)
    .then(data => {
        if (data.success) {
            const treeClassName = data.goal.treeSelected;
            const totalTasks = data.goal.tasks.length;

            // Calculate the number of completed tasks from the DOM
            const completedTasks = Array.from(document.querySelectorAll('.task-content'))
                                        .filter(task => task.classList.contains('completed')).length;


            const completionRatio = completedTasks / totalTasks;
            // Determine the tree stage based on the completion ratio
            let treeStage;
            if (completionRatio === 1) {
                treeStage = 3;
            } else if (completionRatio >= 0.67) {
                treeStage = 2;
            } else if (completionRatio >= 0.33) {
                treeStage = 2;  // you can change this to treeStage = 2 if you prefer it to transition later
            } else {
                treeStage = 1; 
            }

            const treeImageEdit = document.getElementById('tree-image-edit');
            const stageImages = treeStages[treeClassName];

            // Update tree image if valid stage is found
            if (stageImages && stageImages[treeStage - 1]) {
                const stageInfo = stageImages[treeStage - 1];
                treeImageEdit.src = stageInfo.image; 
                treeImageEdit.className = stageInfo.className;

                // Add growth animation class
                treeImageEdit.classList.add('tree-grow');

                // Remove the growth animation class after the animation ends
                treeImageEdit.addEventListener('animationend', () => {
                    treeImageEdit.classList.remove('tree-grow');
                }, { once: true });
            } else {
                console.error('Invalid tree stage:', treeStage);
            }
        } else {
            showAlert('Failed to fetch goal data: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to fetch tree info (tree name, tree stage) when opening edit modal
function fetchTreeInfo(treeName, totalTasks, completedTasks) {
    const treeImage = document.getElementById('tree-image-edit'); 
    const treeNameElement = document.getElementById('tree-name-edit');

    // Calculate the completion ratio
    const completionRatio = completedTasks / totalTasks;

    // Determine the tree stage based on the completion ratio
    let treeStage;
    if (completionRatio === 1) {
        treeStage = 3;
    } else if (completionRatio >= 0.67) {
        treeStage = 2;
    } else if (completionRatio >= 0.33) {
        treeStage = 2; 
    } else {
        treeStage = 1;
    }

    // Find the tree stages by its name
    const stages = treeStages[treeName];

    if (stages && stages[treeStage - 1]) {
        const stageInfo = stages[treeStage - 1];
        treeImage.src = stageInfo.image;
        treeImage.className = stageInfo.className;
        treeNameElement.textContent = treeName;
    } else {
        console.error('Invalid tree name or stage:', treeName, treeStage);
    }
}
