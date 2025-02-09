import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, onValue } from 'firebase/database';

const firebaseConfig = {
    // Your Firebase config here
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Edit button click handler
document.querySelector('.edit-btn').addEventListener('click', () => {
    const infoItems = document.querySelectorAll('.info-item p');
    
    // Convert text to input fields
    infoItems.forEach(item => {
        const currentValue = item.textContent;
        const input = document.createElement('input');
        input.value = currentValue;
        input.className = 'edit-input';
        item.parentNode.replaceChild(input, item);
    });

    // Change edit button to save button
    const editBtn = document.querySelector('.edit-btn');
    editBtn.textContent = 'Save Changes';
    editBtn.classList.add('save-btn');
    
    // Add save functionality
    editBtn.onclick = saveChanges;
});

function saveChanges() {
    const inputs = document.querySelectorAll('.edit-input');
    const updatedData = {};
    
    inputs.forEach(input => {
        const label = input.parentNode.querySelector('label').textContent.toLowerCase();
        updatedData[label] = input.value;
    });

    // Update Firebase
    const supplierRef = ref(db, 'suppliers/supplier1');
    update(supplierRef, updatedData);
    
    // Reset UI
    location.reload();
}

// Listen for real-time updates
const supplierRef = ref(db, 'suppliers/supplier1');
onValue(supplierRef, (snapshot) => {
    const data = snapshot.val();
    updateUI(data);
});

function updateUI(data) {
    Object.entries(data).forEach(([key, value]) => {
        const element = document.querySelector(`[data-field="${key}"]`);
        if (element) {
            element.textContent = value;
        }
    });
}
