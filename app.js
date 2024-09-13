const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ipaSigner = require('node-ipa-sign'); // مكتبة لتوقيع ملفات IPA

const app = express();
const port = 3000;

// إعداد Multer لتحميل الملفات (IPA, P12, Provisioning Profile)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './');  // حفظ الملفات في نفس المجلد
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// عرض الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// تقديم ملفات CSS و JS
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/scripts.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'scripts.js'));
});

// رفع ملفات IPA, P12, و Provisioning Profile وتوقيع التطبيق
app.post('/upload', upload.fields([
    { name: 'ipaFile', maxCount: 1 },
    { name: 'p12File', maxCount: 1 },
    { name: 'provisioningFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const ipaPath = req.files['ipaFile'][0].path;
        const p12Path = req.files['p12File'][0].path;
        const provisioningPath = req.files['provisioningFile'][0].path;
        const certificatePassword = req.body.certificatePassword;
        const outputPath = `signed-${req.files['ipaFile'][0].originalname}`;

        // استدعاء مكتبة توقيع IPA
        await ipaSigner.sign({
            ipa: ipaPath,
            certificates: {
                provisioningProfile: provisioningPath,
                certificate: p12Path,
                certificatePassword: certificatePassword
            },
            output: outputPath
        });

        res.json({
            success: true,
            downloadUrl: `/${outputPath}`
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

// بدء تشغيل الخادم
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});