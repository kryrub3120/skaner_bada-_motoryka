/**
 * Data Validator - Walidacja i normalizacja
 * v1.0 - 28.12.2022
 */

const validationRules = {
    height: { min: 100, max: 220, unit: 'cm' },
    weight: { min: 20, max: 150, unit: 'kg' },
    sj: { min: 5, max: 80, unit: 'cm' },
    cmj: { min: 10, max: 80, unit: 'cm' },
    sprint5: { min: 0.5, max: 3.0, unit: 's' },
    sprint10: { min: 1.0, max: 4.0, unit: 's' },
    sprint20: { min: 2.0, max: 6.0, unit: 's' },
    sprint30: { min: 3.0, max: 8.0, unit: 's' },
    codat: { min: 4.0, max: 12.0, unit: 's' }
};

function validateData(data) {
    let valid = 0;
    let warnings = 0;
    let errors = 0;
    const validationDetails = [];
    
    data.forEach((record, index) => {
        const recordValidation = validateRecord(record);
        validationDetails.push(recordValidation);
        
        if (recordValidation.isValid) valid++;
        if (recordValidation.hasWarnings) warnings++;
        if (recordValidation.hasErrors) errors++;
    });
    
    const completeness = calculateAverageCompleteness(data);
    
    return {
        valid,
        warnings,
        errors,
        completeness,
        validationDetails
    };
}

function validateRecord(record) {
    const issues = {
        errors: [],
        warnings: [],
        isValid: true,
        hasErrors: false,
        hasWarnings: false
    };
    
    // Check required fields
    if (!record.firstName || !record.lastName) {
        issues.errors.push('Brak imienia lub nazwiska');
        issues.hasErrors = true;
        issues.isValid = false;
    }
    
    // Validate ranges
    for (const [field, rules] of Object.entries(validationRules)) {
        if (record[field]) {
            const value = parseFloat(record[field]);
            if (value < rules.min || value > rules.max) {
                issues.errors.push(`${field}: wartość poza zakresem (${rules.min}-${rules.max} ${rules.unit})`);
                issues.hasErrors = true;
                issues.isValid = false;
            }
        }
    }
    
    // Check for missing optional fields
    const optionalFields = ['height', 'weight', 'sj', 'cmj'];
    const missing = optionalFields.filter(f => !record[f]);
    if (missing.length > 0) {
        issues.warnings.push('Niekompletne dane: ' + missing.join(', '));
        issues.hasWarnings = true;
    }
    
    return issues;
}

function normalizeDateToYYYYMMDD(dateStr) {
    if (!dateStr) return '';
    
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    } catch {
        return dateStr;
    }
}

function detectDuplicates(data) {
    const seen = new Map();
    const duplicates = [];
    
    data.forEach((record, index) => {
        const key = `${record.firstName}_${record.lastName}_${record.birthDate}`.toLowerCase();
        
        if (seen.has(key)) {
            duplicates.push({
                index1: seen.get(key),
                index2: index,
                record
            });
        } else {
            seen.set(key, index);
        }
    });
    
    return duplicates;
}

function calculateCompleteness(record) {
    const allFields = ['firstName', 'lastName', 'birthDate', 'sex', 'height', 'weight', 
                       'sj', 'cmj', 'sprint5', 'sprint10', 'sprint20', 'sprint30', 'codat'];
    
    const filled = allFields.filter(f => record[f] && record[f] !== '').length;
    return Math.round((filled / allFields.length) * 100);
}

function calculateAverageCompleteness(data) {
    if (data.length === 0) return 0;
    
    const total = data.reduce((sum, record) => sum + calculateCompleteness(record), 0);
    return Math.round(total / data.length);
}

function createEmptyRecord() {
    return {
        firstName: '',
        lastName: '',
        birthDate: '',
        sex: '',
        height: '',
        weight: '',
        sj: '',
        cmj: '',
        sprint5: '',
        sprint10: '',
        sprint20: '',
        sprint30: '',
        codat: '',
        imported: new Date().toISOString()
    };
}
