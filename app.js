// Application state
let guests = [];
let pendingGuests = [];
let arrivedGuests = [];
let currentView = 'pending';
let searchTerm = '';

// DOM elements
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const guestFileInput = document.getElementById('guestFile');
const pendingTab = document.getElementById('pendingTab');
const arrivedTab = document.getElementById('arrivedTab');
const pendingList = document.getElementById('pendingList');
const arrivedList = document.getElementById('arrivedList');
const pendingCount = document.getElementById('pendingCount');
const arrivedCount = document.getElementById('arrivedCount');

// Initialize app
function init() {
    // Load from localStorage if available
    loadFromLocalStorage();
    
    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);
    guestFileInput.addEventListener('change', handleFileUpload);
    pendingTab.addEventListener('click', () => switchView('pending'));
    arrivedTab.addEventListener('click', () => switchView('arrived'));
    
    // Initial render
    renderGuests();
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (!data.guests || !Array.isArray(data.guests)) {
                alert('Invalid file format. Please use the template format.');
                return;
            }
            
            // Load guests
            guests = data.guests.map(guest => ({
                ...guest,
                id: guest.id || generateId(),
                arrived: false,
                arrivalTime: null
            }));
            
            pendingGuests = guests.filter(g => !g.arrived);
            arrivedGuests = guests.filter(g => g.arrived);
            
            saveToLocalStorage();
            renderGuests();
            
            alert(`Successfully loaded ${guests.length} guests!`);
        } catch (error) {
            alert('Error reading file. Please check the file format.');
            console.error(error);
        }
    };
    
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
}

// Handle search
function handleSearch(event) {
    searchTerm = event.target.value.toLowerCase();
    renderGuests();
}

// Clear search
function clearSearch() {
    searchInput.value = '';
    searchTerm = '';
    renderGuests();
}

// Switch between pending and arrived views
function switchView(view) {
    currentView = view;
    
    if (view === 'pending') {
        pendingTab.classList.add('active');
        arrivedTab.classList.remove('active');
        pendingList.classList.add('active');
        arrivedList.classList.remove('active');
    } else {
        pendingTab.classList.remove('active');
        arrivedTab.classList.add('active');
        pendingList.classList.remove('active');
        arrivedList.classList.add('active');
    }
}

// Check in a guest
function checkInGuest(guestId) {
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return;
    
    guest.arrived = true;
    guest.arrivalTime = new Date().toISOString();
    
    // Update lists
    pendingGuests = guests.filter(g => !g.arrived);
    arrivedGuests = guests.filter(g => g.arrived);
    
    saveToLocalStorage();
    renderGuests();
}

// Filter guests based on search term
function filterGuests(guestList) {
    if (!searchTerm) return guestList;
    
    return guestList.filter(guest => {
        const name = guest.name.toLowerCase();
        const email = (guest.email || '').toLowerCase();
        const company = (guest.company || '').toLowerCase();
        
        return name.includes(searchTerm) || 
               email.includes(searchTerm) || 
               company.includes(searchTerm);
    });
}

// Render guests
function renderGuests() {
    // Update counts
    pendingCount.textContent = pendingGuests.length;
    arrivedCount.textContent = arrivedGuests.length;
    
    // Render pending list
    const filteredPending = filterGuests(pendingGuests);
    if (filteredPending.length === 0) {
        pendingList.innerHTML = `
            <div class="empty-state">
                <p>${searchTerm ? 'No guests found' : 'No guests pending check-in'}</p>
                ${!searchTerm ? '<p class="hint">Load a guest list to get started</p>' : ''}
            </div>
        `;
    } else {
        pendingList.innerHTML = filteredPending
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(guest => createGuestCard(guest, false))
            .join('');
    }
    
    // Render arrived list
    const filteredArrived = filterGuests(arrivedGuests);
    if (filteredArrived.length === 0) {
        arrivedList.innerHTML = `
            <div class="empty-state">
                <p>${searchTerm ? 'No guests found' : 'No guests have arrived yet'}</p>
            </div>
        `;
    } else {
        arrivedList.innerHTML = filteredArrived
            .sort((a, b) => new Date(b.arrivalTime) - new Date(a.arrivalTime))
            .map(guest => createGuestCard(guest, true))
            .join('');
    }
    
    // Attach event listeners
    attachEventListeners();
}

// Create guest card HTML
function createGuestCard(guest, isArrived) {
    const partySize = guest.partySize || 1;
    const email = guest.email || '';
    const company = guest.company || '';
    
    let detailsHtml = '';
    if (email) {
        detailsHtml += `<span class="guest-email">${email}</span>`;
    }
    if (company) {
        detailsHtml += `<span class="guest-email">${company}</span>`;
    }
    
    if (isArrived) {
        const arrivalTime = new Date(guest.arrivalTime);
        const timeStr = arrivalTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return `
            <div class="guest-card" data-guest-id="${guest.id}">
                <div class="guest-info">
                    <div class="guest-name">${guest.name}</div>
                    <div class="guest-details">
                        ${detailsHtml}
                        ${partySize > 1 ? `<span class="guest-party">Party of ${partySize}</span>` : ''}
                    </div>
                    <div class="arrived-time">Checked in at ${timeStr}</div>
                </div>
                <div class="guest-actions">
                    <div class="arrived-badge">
                        <span>✓</span> Arrived
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="guest-card" data-guest-id="${guest.id}">
                <div class="guest-info">
                    <div class="guest-name">${guest.name}</div>
                    <div class="guest-details">
                        ${detailsHtml}
                        ${partySize > 1 ? `<span class="guest-party">Party of ${partySize}</span>` : ''}
                    </div>
                </div>
                <div class="guest-actions">
                    <button class="btn btn-success check-in-btn" data-guest-id="${guest.id}">
                        Check In
                    </button>
                </div>
            </div>
        `;
    }
}

// Attach event listeners to dynamically created elements
function attachEventListeners() {
    const checkInBtns = document.querySelectorAll('.check-in-btn');
    checkInBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const guestId = e.target.getAttribute('data-guest-id');
            checkInGuest(guestId);
        });
    });
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Save to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('canaryFilmsGuests', JSON.stringify(guests));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Load from localStorage
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('canaryFilmsGuests');
        if (saved) {
            guests = JSON.parse(saved);
            pendingGuests = guests.filter(g => !g.arrived);
            arrivedGuests = guests.filter(g => g.arrived);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
