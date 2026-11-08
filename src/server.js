const express = require('express');
const path = require('path');
const helmet = require('helmet');
const nodemailer = require('nodemailer'); // 1. جبنا المكتبة ديال الإيميل
require('dotenv').config();

const db = require('./database'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../PUBLIC')));

// 2. إعدادات "البوسطاجي" لي غيصيفط لينا الإيميلات (مربوط بـ Gmail ديالك)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// طريق التيست
app.get('/api/health', (req, res) => {
    res.json({ status: 'success', message: 'السيرفر ديال كيان خدام مزيان! 🚀' });
});

// الطريق ديال الفورم
app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'عفاك عمر كاع الخانات الضرورية.' });
    }

    try {
        // أ. كنسجلو الميساج فـ قاعدة البيانات (SQLite)
        const stmt = db.prepare('INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)');
        stmt.run(name, email, phone, message);
        
        // ب. كنوجدو الرسالة لي غتوصلك للـ Gmail ديالك
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email, // <--- هادا هو السطر السحري لي زدنا
            subject: `📩 رسالة جديدة من كيان ديجيتال ستوديو: ${name}`,
            text: `وصلاتك رسالة جديدة من السيت ديالك!\n\nالسمية: ${name}\nالإيميل: ${email}\nالتليفون: ${phone || 'ماكاينش'}\n\nالميساج:\n${message}`
        };

        // ت. كنصيفطو الإيميل
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('مشكل فإرسال الإيميل:', error);
            } else {
                console.log('✅ الإيميل تصيفط بنجاح:', info.response);
            }
        });

        app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'عفاك عمر كاع الخانات الضرورية.' });
    }

    try {
        // 1. كنسجلو فـ SQLite
        const stmt = db.prepare('INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)');
        stmt.run(name, email, phone, message);
        
        // 2. كنصيفطو الإيميل
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `📩 رسالة جديدة من كيان ديجيتال ستوديو: ${name}`,
            text: `وصلاتك رسالة جديدة من السيت ديالك!\n\nالسمية: ${name}\nالإيميل: ${email}\nالتليفون: ${phone || 'ماكاينش'}\n\nالميساج:\n${message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error('مشكل فإرسال الإيميل:', error);
            else console.log('✅ الإيميل تصيفط بنجاح!');
        });

        // ==========================================
        // 3. كنزيدو الإرسال فـ WhatsApp
        // ==========================================
        const whatsappPhone = process.env.WHATSAPP_PHONE;
        const whatsappApiKey = process.env.WHATSAPP_APIKEY;

        if (whatsappPhone && whatsappApiKey) {
            // كنقادو الميساج باش يفهمو الواتساب (encodeURIComponent)
            const waMessage = encodeURIComponent(`📩 رسالة جديدة من كليان فـ KAYAN!\n\n👤 السمية: ${name}\n✉️ الإيميل: ${email}\n📞 التليفون: ${phone || 'ماكاينش'}\n💬 الميساج: ${message}`);
            const whatsappUrl = `https://api.callmebot.com/whatsapp.php?phone=${whatsappPhone}&text=${waMessage}&apikey=${whatsappApiKey}`;
            
            // كنعيطو لـ CallMeBot باش يصيفط الميساج
            fetch(whatsappUrl)
                .then(response => console.log('✅ ميساج الواتساب داز بنجاح!'))
                .catch(error => console.error('مشكل فإرسال الواتساب:', error));
        }
        // ==========================================

        res.json({ success: true, message: 'تم الإرسال بنجاح! شكرا لتواصلك معنا.' });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ success: false, message: 'وقع شي مشكل فالسيرفر، عاود جرب من بعد.' });
    }
});

        // ث. كنردّو الجواب للكليان فالواجهة (بلي راه تم الإرسال)
        res.json({ success: true, message: 'تم الإرسال بنجاح! شكرا لتواصلك معنا.' });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ success: false, message: 'وقع شي مشكل فالسيرفر، عاود جرب من بعد.' });
    }
});

// طريق باش تشوف الداتا بيز فالبراوزر
app.get('/api/messages', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC');
        const messages = stmt.all();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'مقدرناش نجبدو الميساجات' });
    }
});

// كنشعلو السيرفر
app.listen(PORT, () => {
    console.log(`🚀 KAYAN Server is running on http://localhost:${PORT}`);
});