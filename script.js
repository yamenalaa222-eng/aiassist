// المتغيرات العامة
let uploadedFiles = [];
let extractedText = '';
let translatedText = '';

// عناصر DOM
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const previewSection = document.getElementById('previewSection');
const filesList = document.getElementById('filesList');
const resultsSection = document.getElementById('resultsSection');
const extractedTextElement = document.getElementById('extractedText');
const translatedTextElement = document.getElementById('translatedText');
const loadingScreen = document.getElementById('loadingScreen');
const modal = document.getElementById('modal');
const notification = document.getElementById('notification');

// الأحداث
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // رفع الملفات
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // السحب والإفلات
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    dropZone.addEventListener('drop', handleDrop, false);
    
    // أزرار النتائج
    document.getElementById('copyBtn').addEventListener('click', copyText);
    document.getElementById('downloadWordBtn').addEventListener('click', downloadWord);
    document.getElementById('translateBtn').addEventListener('click', translateText);
    
    // زر الإغلاق في النافذة المنبثقة
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// وظائف المساعدة
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dropZone.style.borderColor = '#4361ee';
    dropZone.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
}

function unhighlight() {
    dropZone.style.borderColor = '#ddd';
    dropZone.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    [...files].forEach(file => {
        if (file.type === 'application/pdf') {
            processPDF(file);
        } else {
            showNotification('يرجى اختيار ملف PDF فقط', 'error');
        }
    });
}

// معالجة ملف PDF
async function processPDF(file) {
    showLoading(true);
    
    try {
        // محاكاة معالجة PDF وتحويله إلى نص
        // في التطبيق الحقيقي، ستستخدم مكتبة مثل pdf.js أو تواصل مع API
        
        // محاكاة استرجاع النص من PDF
        setTimeout(() => {
            const mockText = `هذا نص تجريبي مستخرج من ملف PDF.
            
النص يمكن أن يحتوي على:
- فقرات متعددة
- قوائم نقطية
- عناوين وأقسام مختلفة

يمكنك الآن ترجمة هذا النص أو تحويله إلى ملف Word.`;
            
            extractedText = mockText;
            extractedTextElement.value = extractedText;
            
            previewSection.style.display = 'block';
            resultsSection.style.display = 'block';
            
            addFileToList(file);
            showLoading(false);
            showNotification('تم معالجة الملف بنجاح', 'success');
        }, 2000);
        
    } catch (error) {
        showLoading(false);
        showNotification('حدث خطأ أثناء معالجة الملف', 'error');
        console.error('خطأ في معالجة PDF:', error);
    }
}

function addFileToList(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <div class="file-info">
            <i class="fas fa-file-pdf file-icon"></i>
            <div class="file-details">
                <h4>${file.name}</h4>
                <p>${formatFileSize(file.size)} • ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
        </div>
        <div class="file-actions">
            <button class="btn-secondary" onclick="removeFile(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    filesList.appendChild(fileItem);
}

function removeFile(button) {
    button.closest('.file-item').remove();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// وظائف النص والترجمة
function copyText() {
    const textToCopy = translatedText || extractedText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('تم نسخ النص إلى الحافظة', 'success');
    });
}

function downloadWord() {
    const text = extractedText;
    const blob = new Blob([text], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'مستند_محول.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('تم تنزيل ملف Word', 'success');
}

async function translateText() {
    const sourceLang = document.getElementById('sourceLang').value;
    const targetLang = document.getElementById('targetLang').value;
    const textToTranslate = extractedText;
    
    if (!textToTranslate.trim()) {
        showNotification('لا يوجد نص للترجمة', 'warning');
        return;
    }
    
    showLoading(true);
    
    try {
        // محاكاة الترجمة
        // في التطبيق الحقيقي، ستتصل بـ DeepL API أو Google Translate API
        setTimeout(() => {
            const mockTranslation = `This is a sample translation of the Arabic text.
            
The text can contain:
- Multiple paragraphs
- Bullet points
- Different headings and sections

You can now translate this text or convert it to a Word file.`;
            
            translatedText = mockTranslation;
            translatedTextElement.value = translatedText;
            showLoading(false);
            showNotification('تمت الترجمة بنجاح', 'success');
        }, 1500);
        
    } catch (error) {
        showLoading(false);
        showNotification('حدث خطأ أثناء الترجمة', 'error');
        console.error('خطأ في الترجمة:', error);
    }
}

// وظائف العرض
function showLoading(show) {
    loadingScreen.style.display = show ? 'flex' : 'none';
}

function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.style.background = 
        type === 'success' ? '#4CAF50' :
        type === 'error' ? '#f44336' :
        type === 'warning' ? '#ff9800' : '#2196F3';
    
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function openModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

// وظائف إضافية للإعدادات والسجل
document.getElementById('settingsBtn').addEventListener('click', () => {
    openModal('الإعدادات', `
        <div class="settings-form">
            <h3>تفضيلات اللغة</h3>
            <label>
                <input type="checkbox" checked> تلقائي اكتشاف اللغة المصدر
            </label>
            <label>
                <input type="checkbox"> حفظ الترجمات تلقائياً
            </label>
            
            <h3>تفضيلات التنزيل</h3>
            <label>
                <input type="radio" name="wordFormat" checked> تنسيق Word (.docx)
            </label>
            <label>
                <input type="radio" name="wordFormat"> تنسيق نص عادي (.txt)
            </label>
        </div>
    `);
});

document.getElementById('historyBtn').addEventListener('click', () => {
    openModal('سجل الملفات', `
        <div class="history-list">
            <div class="history-item">
                <div>
                    <h4>وثيقة البحث.pdf</h4>
                    <p>تمت المعالجة قبل 2 ساعة</p>
                </div>
                <button class="btn-secondary">فتح</button>
            </div>
            <div class="history-item">
                <div>
                    <h4>التقرير النهائي.pdf</h4>
                    <p>تمت المعالجة قبل يوم واحد</p>
                </div>
                <button class="btn-secondary">فتح</button>
            </div>
        </div>
    `);
});
