/**
 * File Parser - XLS/CSV parsing
 * v1.0 - 28.12.2022
 */

async function parseSpreadsheet(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (ext === 'csv') {
        return await parseCSV(file);
    } else if (ext === 'xls' || ext === 'xlsx') {
        return await parseExcel(file);
    }
}

async function parseCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const mapped = results.data.map(row => mapRowToStandard(row));
                updateProgress(100, 'CSV załadowany!');
                resolve(mapped);
            },
            error: (error) => reject(error)
        });
    });
}

async function parseExcel(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                
                const mapped = jsonData.map(row => mapRowToStandard(row));
                updateProgress(100, 'Excel załadowany!');
                resolve(mapped);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error('Błąd odczytu pliku'));
        reader.readAsArrayBuffer(file);
    });
}

function mapRowToStandard(row) {
    const mapping = {
        'imie': 'firstName',
        'imię': 'firstName',
        'name': 'firstName',
        'nazwisko': 'lastName',
        'surname': 'lastName',
        'data_urodzenia': 'birthDate',
        'birth_date': 'birthDate',
        'plec': 'sex',
        'płeć': 'sex',
        'sex': 'sex',
        'wzrost': 'height',
        'height': 'height',
        'masa': 'weight',
        'weight': 'weight',
        'sj': 'sj',
        'cmj': 'cmj',
        'sprint_5': 'sprint5',
        'sprint_10': 'sprint10',
        'sprint_20': 'sprint20',
        'sprint_30': 'sprint30',
        'codat': 'codat'
    };
    
    const mapped = {
        imported: new Date().toISOString()
    };
    
    for (const [key, value] of Object.entries(row)) {
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
        const mappedKey = mapping[normalizedKey];
        
        if (mappedKey) {
            mapped[mappedKey] = value;
        }
    }
    
    // Normalize date
    if (mapped.birthDate) {
        mapped.birthDate = normalizeDateToYYYYMMDD(mapped.birthDate);
    }
    
    return mapped;
}

function parseTextToData(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const data = [];
    
    // Simple parsing - look for patterns
    lines.forEach(line => {
        const words = line.split(/\s+/);
        if (words.length >= 2) {
            const record = {
                firstName: words[0] || '',
                lastName: words[1] || '',
                imported: new Date().toISOString()
            };
            data.push(record);
        }
    });
    
    return data.length > 0 ? data : [createEmptyRecord()];
}
