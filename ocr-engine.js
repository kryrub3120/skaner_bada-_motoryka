/**
 * OCR Engine - Tesseract.js wrapper
 * v1.0 - 28.12.2022
 */

async function processImage(file) {
    updateProgress(10, 'Ładowanie obrazu...');
    
    const imageUrl = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = imageUrl;
    
    document.getElementById('documentPreview').innerHTML = '';
    document.getElementById('documentPreview').appendChild(img);
    
    updateProgress(30, 'Rozpoznawanie tekstu...');
    
    try {
        const { data: { text } } = await Tesseract.recognize(file, 'pol', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    updateProgress(30 + (m.progress * 60), 'Rozpoznawanie tekstu... ' + Math.round(m.progress * 100) + '%');
                }
            }
        });
        
        document.getElementById('ocrText').value = text;
        ocrText = text;
        
        updateProgress(100, 'Gotowe!');
        hideOCRProgress();
        
    } catch (error) {
        console.error('OCR error:', error);
        alert('Błąd OCR: ' + error.message);
    }
}

async function processPDF(file) {
    updateProgress(10, 'Ładowanie PDF...');
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    updateProgress(20, 'Renderowanie strony...');
    
    const page = await pdf.getPage(1);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
        canvasContext: context,
        viewport: viewport
    }).promise;
    
    document.getElementById('documentPreview').innerHTML = '';
    document.getElementById('documentPreview').appendChild(canvas);
    
    updateProgress(40, 'Rozpoznawanie tekstu...');
    
    try {
        const { data: { text } } = await Tesseract.recognize(canvas, 'pol', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    updateProgress(40 + (m.progress * 50), 'Rozpoznawanie... ' + Math.round(m.progress * 100) + '%');
                }
            }
        });
        
        document.getElementById('ocrText').value = text;
        ocrText = text;
        
        updateProgress(100, 'Gotowe!');
        hideOCRProgress();
        
    } catch (error) {
        console.error('OCR error:', error);
        alert('Błąd OCR: ' + error.message);
    }
}
