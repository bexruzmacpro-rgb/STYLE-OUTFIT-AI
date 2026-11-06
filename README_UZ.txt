STYLE — haqiqiy AI kiyim tahlili uchun boshlang‘ich loyiha

NIMA QILADI?
- Rasm yuklanganda AI kiyim turi, rangi va uslubini aniqlaydi.
- Tahlil natijasi brauzerdagi garderob ro‘yxatiga qo‘shiladi.
- Kamida 2 ta kiyim bo‘lsa, AI tanlangan vaziyat uchun obraz taklif qiladi.

MUHIM
- Bu loyiha hozircha internetga joylangan ommaviy sayt emas. Avval Mac kompyuterda sinab ko‘riladi.
- AI ishlashi uchun API kaliti va internet kerak.
- API kalitni hech qachon menga yoki boshqa odamga yubormang. Uni faqat serverdagi .env faylida saqlang.
- API ishlatilishi xarajat keltirishi mumkin. Hisob va to‘lov masalasini ota-ona/vasiy bilan birga tekshiring.
- Rasm AI xizmatiga yuboriladi. Faqat o‘zingiz yuklashga ruxsatli bo‘lgan kiyim rasmlaridan foydalaning.
- Ushbu namuna rasmlarni serverda doimiy saqlamaydi. Brauzer yangilansa garderob ro‘yxati yo‘qoladi.

MAC’DA ISHGA TUSHIRISH
1. Node.js LTS o‘rnatilgan bo‘lishi kerak: https://nodejs.org/
2. ZIP faylni oching.
3. Terminal oching va loyiha papkasiga kiring. Masalan:
   cd ~/Downloads/STYLE_AI_SERVER
   (Papkangiz boshqa joyda bo‘lsa, shu manzilni moslang.)
4. Kutubxonalarni o‘rnating:
   npm install
5. .env.example faylidan nusxa olib, nomini .env qiling.
   Finder’da faylni nusxalash mumkin yoki Terminal’da:
   cp .env.example .env
6. .env faylini matn muharririda oching. Rasmiy API hisobida yaratilgan maxfiy kalitni OPENAI_API_KEY= dan keyin kiriting.
   Kalitni qo‘shtirnoqqa olmang va hech kimga yubormang.
7. Serverni ishga tushiring:
   npm start
8. Brauzerda oching:
   http://localhost:3000
9. To‘xtatish uchun Terminal oynasida Ctrl + C bosing.

AGAR XATOLIK CHIQSA
- "API kaliti sozlanmagan": .env nomi va kalitni tekshiring.
- "npm: command not found": Node.js o‘rnatilmagan yoki Terminal qayta ochilmagan.
- AI xatosi: internet, API hisobidagi ruxsat va sarf limitlarini kattalar bilan tekshiring.

KEYINGI BOSQICH
Saytni hamma internetdan ochishi uchun HTTPS hosting va domen kerak bo‘ladi. API kalit hostingning maxfiy environment variables bo‘limiga joylanadi; ommaviy HTML faylga emas.


INTERNETGA JOYLASH (RENDER UCHUN TAYYORLASH)
1. Loyiha papkasini GitHub'ga yuklash kerak. .env faylini va API kalitni GitHub'ga aslo yuklamang.
2. Render kabi hostingda yangi Web Service yaratiladi va GitHub repozitoriy ulanadi.
3. Build command: npm install
4. Start command: npm start
5. Hosting sozlamalaridagi Environment Variables bo‘limiga OPENAI_API_KEY nomi bilan maxfiy API kalit kiritiladi.
6. Deploy tugagach, hosting sayt uchun HTTPS manzil beradi.
7. Domen ulash va Google qidiruviga qo‘shish keyingi bosqichda bajariladi.

Eslatma: hosting tariflari va bepul rejalar shartlari o‘zgarishi mumkin. Hisob ochish, API kalit va ehtimoliy to‘lovlarni ota-ona/vasiy bilan birga bajaring. Sayt ommaga ochilgach, foydalanuvchi rasmlari tashqi AI xizmatiga yuborilishi haqida maxfiylik sahifasida aniq yozish kerak.
