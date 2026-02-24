/**
 * Data Store - Operation log
 * v1.0 - 28.12.2022
 */

function loadDataFromStore() {
    // Load from sessionStorage if available
    const stored = sessionStorage.getItem('stp_digitizer_data');
    if (stored) {
        try {
            appData = JSON.parse(stored);
            console.log('Loaded', appData.length, 'records from session');
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }
}

function saveDataToStore() {
    // Save to sessionStorage
    try {
        sessionStorage.setItem('stp_digitizer_data', JSON.stringify(appData));
        console.log('Saved', appData.length, 'records to session');
    } catch (e) {
        console.error('Error saving data:', e);
    }
}

// Auto-save on data changes
setInterval(() => {
    if (appData && appData.length > 0) {
        saveDataToStore();
    }
}, 30000); // Every 30 seconds
