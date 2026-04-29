// ==========================================
// 1. AUTHENTICATION (Login & Logout Logic)
// ==========================================
const loginForm = document.getElementById('login-form');
const loginPage = document.getElementById('login-page');
const appContainer = document.getElementById('app-container');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// Mock Credentials
const VALID_EMAIL = "intern@syntecxhub.com";
const VALID_PASSWORD = "admin123";

let chartsInitialized = false; 

loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); 

    const emailInput = document.getElementById('login-email').value;
    const passwordInput = document.getElementById('login-password').value;

    if (emailInput === VALID_EMAIL && passwordInput === VALID_PASSWORD) {
        // Success: Hide login, show app
        loginPage.classList.add('hidden');
        appContainer.classList.remove('hidden');
        loginError.style.display = 'none';

        // Initialize charts only after dashboard is visible
        if(!chartsInitialized) {
            initCharts();
            chartsInitialized = true;
        }
    } else {
        // Fail: Show error message
        loginError.style.display = 'block';
    }
});

logoutBtn.addEventListener('click', function() {
    // Hide app, show login
    appContainer.classList.add('hidden');
    loginPage.classList.remove('hidden');
    
    // Clear inputs
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
});


// ==========================================
// 2. MOCK DATABASE
// ==========================================
const dashboardData = {
    all: {
        earnings: "$34,565.00", users: "12,431", conversion: "4.2%", bounce: "32.1%",
        barData: [12000, 19000, 15000, 22000, 18000, 25000],
        lineData: [400, 800, 600, 1200]
    },
    organic: {
        earnings: "$18,200.00", users: "7,100", conversion: "5.8%", bounce: "28.4%",
        barData: [8000, 11000, 9000, 13000, 10000, 14000],
        lineData: [200, 500, 300, 700]
    },
    social: {
        earnings: "$16,365.00", users: "5,331", conversion: "3.1%", bounce: "38.7%",
        barData: [4000, 8000, 6000, 9000, 8000, 11000],
        lineData: [200, 300, 300, 500]
    }
};

// ==========================================
// 3. CHART INITIALIZATION FUNCTION
// ==========================================
let myBarChart, myLineChart, myDoughnutChart;

function initCharts() {
    const ctxBar = document.getElementById('barChart').getContext('2d');
    myBarChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{ label: 'Revenue ($)', data: dashboardData.all.barData, backgroundColor: '#4318FF', borderRadius: 5 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    const ctxLine = document.getElementById('lineChart').getContext('2d');
    myLineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{ label: 'New Users', data: dashboardData.all.lineData, borderColor: '#00B5D8', tension: 0.4, fill: false, borderWidth: 3 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
    myDoughnutChart = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: ['Mobile', 'Desktop', 'Tablet'],
            datasets: [{ data: [55, 35, 10], backgroundColor: ['#4318FF', '#00B5D8', '#E2E8F0'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%' }
    });
}

// ==========================================
// 4. INTERACTIVE LOGIC: DATA FILTERING
// ==========================================
const channelFilter = document.getElementById('channel-filter');
channelFilter.addEventListener('change', function(e) {
    const newData = dashboardData[e.target.value];
    document.getElementById('kpi-earnings').textContent = newData.earnings;
    document.getElementById('kpi-users').textContent = newData.users;
    document.getElementById('kpi-conversion').textContent = newData.conversion;
    document.getElementById('kpi-bounce').textContent = newData.bounce;

    myBarChart.data.datasets[0].data = newData.barData;
    myBarChart.update();
    myLineChart.data.datasets[0].data = newData.lineData;
    myLineChart.update();
});

const startDateInput = document.querySelector('input[title="Start Date"]');
const endDateInput = document.querySelector('input[title="End Date"]');

function simulateDateFetch() {
    if(!startDateInput.value && !endDateInput.value) return;

    const randomBarData = Array.from({length: 6}, () => Math.floor(Math.random() * 25000 + 5000));
    const randomLineData = Array.from({length: 4}, () => Math.floor(Math.random() * 1500 + 200));

    document.getElementById('kpi-earnings').textContent = "$" + (Math.random() * 40000 + 10000).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('kpi-users').textContent = Math.floor(Math.random() * 15000 + 5000).toLocaleString();
    document.getElementById('kpi-conversion').textContent = (Math.random() * 6 + 1).toFixed(1) + "%";
    document.getElementById('kpi-bounce').textContent = (Math.random() * 30 + 15).toFixed(1) + "%";

    myBarChart.data.datasets[0].data = randomBarData;
    myBarChart.update();
    myLineChart.data.datasets[0].data = randomLineData;
    myLineChart.update();
}

startDateInput.addEventListener('change', simulateDateFetch);
endDateInput.addEventListener('change', simulateDateFetch);

// ==========================================
// 5. INTERACTIVE LOGIC: NAVIGATION ROUTING
// ==========================================
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view-section');
const pageTitle = document.getElementById('page-title');
const mainHeading = document.getElementById('main-heading');
const dashboardFilters = document.getElementById('dashboard-filters');

navItems.forEach(item => {
    item.addEventListener('click', function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');

        const targetViewId = this.getAttribute('data-target');
        
        views.forEach(view => {
            view.classList.add('hidden');
            view.classList.remove('active-view');
        });
        
        document.getElementById(targetViewId).classList.remove('hidden');
        document.getElementById(targetViewId).classList.add('active-view');

        const cleanTitle = this.innerText.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim(); 
        pageTitle.textContent = cleanTitle;
        mainHeading.textContent = cleanTitle === 'Dashboard' ? 'Main Dashboard' : cleanTitle;

        if (targetViewId === 'dashboard-view') {
            dashboardFilters.classList.remove('hidden');
        } else {
            dashboardFilters.classList.add('hidden');
        }
    });
});

// ==========================================
// 6. SETTINGS FORM SUBMISSION
// ==========================================
const settingsForm = document.getElementById('settings-form');
settingsForm.addEventListener('submit', function(e) {
    e.preventDefault(); 
    alert('Settings saved successfully!');
});