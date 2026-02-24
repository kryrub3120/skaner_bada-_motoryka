/**
 * STP Data Digitizer - Main Application
 * v1.0 - 28.12.2022
 * © Sportpredictor Sp. z o.o.
 */

let currentStep = 1;
let uploadedFile = null;
let ocrText = '';
let appData = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('STP Data Digitizer v1.0 - 28.12.2022');
    setupFileUpload();
    loadDataFromStore();
});

// Setup file upload
function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    
    fileInput.addEventListener('change', handleFileSelect);
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect({ target: fileInput });
        }
    });
}

// Handle file selection
async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    uploadedFile = file;
    
    // Show file info
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('fileInfo').style.display = 'block';
    
    // Proceed to next step automatically
    setTimeout(() => {
        nextStep();
        processFile(file);
    }, 500);
}

// Remove file
function removeFile() {
    uploadedFile = null;
    document.getElementById('fileInput').value = '';
    document.getElementById('fileInfo').style.display = 'none';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Process file
async function processFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'pdf'].includes(ext)) {
        await processImageOrPDF(file);
    } else if (['xls', 'xlsx', 'csv'].includes(ext)) {
        await processSpreadsheet(file);
    }
}

// Process image/PDF
async function processImageOrPDF(file) {
    showOCRProgress();
    
    try {
        if (file.type === 'application/pdf') {
            await processPDF(file);
        } else {
            await processImage(file);
        }
    } catch (error) {
        console.error('Processing error:', error);
        alert('Błąd przetwarzania pliku: ' + error.message);
    }
}

// Process spreadsheet
async function processSpreadsheet(file) {
    showOCRProgress();
    
    try {
        const data = await parseSpreadsheet(file);
        appData = data;
        hideOCRProgress();
        nextStep();
        renderDataTable();
    } catch (error) {
        console.error('Spreadsheet error:', error);
        alert('Błąd parsowania pliku: ' + error.message);
    }
}

// Show OCR progress
function showOCRProgress() {
    document.getElementById('ocrProgress').style.display = 'block';
    document.getElementById('ocrContainer').style.display = 'none';
    document.getElementById('ocrButtons').style.display = 'none';
}

// Hide OCR progress
function hideOCRProgress() {
    document.getElementById('ocrProgress').style.display = 'none';
    document.getElementById('ocrContainer').style.display = 'grid';
    document.getElementById('ocrButtons').style.display = 'flex';
}

// Update progress
function updateProgress(percent, text) {
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressText').textContent = text;
}

// Parse to table
function parseToTable() {
    const text = document.getElementById('ocrText').value;
    if (!text) {
        alert('Brak tekstu do parsowania!');
        return;
    }
    
    appData = parseTextToData(text);
    nextStep();
    renderDataTable();
}

// Render data table
function renderDataTable() {
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = '';
    
    appData.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><input type="text" value="${row.firstName || ''}" onchange="updateCell(${index}, 'firstName', this.value)"></td>
            <td><input type="text" value="${row.lastName || ''}" onchange="updateCell(${index}, 'lastName', this.value)"></td>
            <td><input type="date" value="${row.birthDate || ''}" onchange="updateCell(${index}, 'birthDate', this.value)"></td>
            <td><select onchange="updateCell(${index}, 'sex', this.value)">
                <option value="">-</option>
                <option value="M" ${row.sex === 'M' ? 'selected' : ''}>M</option>
                <option value="K" ${row.sex === 'K' ? 'selected' : ''}>K</option>
            </select></td>
            <td><input type="number" value="${row.height || ''}" onchange="updateCell(${index}, 'height', this.value)"></td>
            <td><input type="number" value="${row.weight || ''}" onchange="updateCell(${index}, 'weight', this.value)"></td>
            <td><input type="number" value="${row.sj || ''}" onchange="updateCell(${index}, 'sj', this.value)"></td>
            <td><input type="number" value="${row.cmj || ''}" onchange="updateCell(${index}, 'cmj', this.value)"></td>
            <td><input type="number" step="0.01" value="${row.sprint5 || ''}" onchange="updateCell(${index}, 'sprint5', this.value)"></td>
            <td><input type="number" step="0.01" value="${row.sprint10 || ''}" onchange="updateCell(${index}, 'sprint10', this.value)"></td>
            <td><input type="number" step="0.01" value="${row.sprint20 || ''}" onchange="updateCell(${index}, 'sprint20', this.value)"></td>
            <td><input type="number" step="0.01" value="${row.sprint30 || ''}" onchange="updateCell(${index}, 'sprint30', this.value)"></td>
            <td><input type="number" step="0.01" value="${row.codat || ''}" onchange="updateCell(${index}, 'codat', this.value)"></td>
            <td><button class="btn-icon" onclick="deleteRow(${index})"><span class="material-icons">delete</span></button></td>
        `;
        tbody.appendChild(tr);
    });
    
    document.getElementById('validationSummary').style.display = 'flex';
    validateAll();
}

// Update cell
function updateCell(index, field, value) {
    appData[index][field] = value;
    appData[index].modified = new Date().toISOString();
    validateAll();
}

// Add row
function addRow() {
    appData.push(createEmptyRecord());
    renderDataTable();
}

// Delete row
function deleteRow(index) {
    if (confirm('Usunąć ten wiersz?')) {
        appData.splice(index, 1);
        renderDataTable();
    }
}

// Validate all
function validateAll() {
    const results = validateData(appData);
    
    document.getElementById('validCount').textContent = results.valid;
    document.getElementById('warningCount').textContent = results.warnings;
    document.getElementById('errorCount').textContent = results.errors;
    document.getElementById('completenessScore').textContent = results.completeness + '%';
    
    // Apply validation styles
    applyValidationStyles(results.validationDetails);
}

// Apply validation styles
function applyValidationStyles(details) {
    const inputs = document.querySelectorAll('.data-table input');
    inputs.forEach(input => {
        input.classList.remove('error', 'warning', 'valid');
    });
    
    // Would apply specific styling based on validation details
}

// Navigation
function nextStep() {
    if (currentStep < 4) {
        currentStep++;
        updateStepDisplay();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Update stepper
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else if (index + 1 < currentStep) {
            step.classList.add('completed');
        }
    });
    
    // Update content
    document.querySelectorAll('.step-content').forEach((content, index) => {
        content.classList.remove('active');
        if (index + 1 === currentStep) {
            content.classList.add('active');
        }
    });
    
    // Update export summary
    if (currentStep === 4) {
        updateExportSummary();
    }
}

// Update export summary
function updateExportSummary() {
    document.getElementById('exportRecordCount').textContent = appData.length;
    const avgCompleteness = calculateAverageCompleteness(appData);
    document.getElementById('exportCompleteness').textContent = avgCompleteness + '%';
    document.getElementById('exportDate').textContent = new Date().toLocaleDateString('pl-PL');
}

// Reset app
function resetApp() {
    if (confirm('Rozpocząć od nowa? Niezapisane dane zostaną utracone.')) {
        currentStep = 1;
        uploadedFile = null;
        ocrText = '';
        appData = [];
        document.getElementById('fileInput').value = '';
        document.getElementById('fileInfo').style.display = 'none';
        updateStepDisplay();
    }
}

// Export functions
function exportToCSV() {
    const csv = generateCSV(appData);
    downloadFile(csv, 'STP_Data_Export_' + new Date().toISOString().split('T')[0] + '.csv', 'text/csv');
}

function exportToExcel() {
    const excel = generateExcel(appData);
    downloadFile(excel, 'STP_Data_Export_' + new Date().toISOString().split('T')[0] + '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

// Download file helper
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

console.log('App initialized');
