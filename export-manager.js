/**
 * Export Manager - CSV/Excel export
 * v1.0 - 28.12.2022
 */

function generateCSV(data) {
    if (!data || data.length === 0) {
        return '';
    }
    
    const headers = ['firstName', 'lastName', 'birthDate', 'sex', 'height', 'weight', 
                     'sj', 'cmj', 'sprint5', 'sprint10', 'sprint20', 'sprint30', 'codat'];
    
    const headerRow = headers.join(',');
    
    const dataRows = data.map(record => {
        return headers.map(header => {
            const value = record[header] || '';
            // Escape commas and quotes
            return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',');
    });
    
    return [headerRow, ...dataRows].join('\n');
}

function generateExcel(data) {
    if (!data || data.length === 0) {
        return new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
    
    // Prepare data for Excel
    const headers = ['Imię', 'Nazwisko', 'Data urodzenia', 'Płeć', 'Wzrost (cm)', 'Masa (kg)', 
                     'SJ (cm)', 'CMJ (cm)', 'Sprint 5m (s)', 'Sprint 10m (s)', 
                     'Sprint 20m (s)', 'Sprint 30m (s)', 'CODAT (s)'];
    
    const fields = ['firstName', 'lastName', 'birthDate', 'sex', 'height', 'weight', 
                    'sj', 'cmj', 'sprint5', 'sprint10', 'sprint20', 'sprint30', 'codat'];
    
    const wsData = [headers];
    
    data.forEach(record => {
        const row = fields.map(field => record[field] || '');
        wsData.push(row);
    });
    
    // Create workbook
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'STP Data');
    
    // Generate Excel file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return wbout;
}
