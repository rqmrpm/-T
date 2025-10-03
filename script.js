// انتظر حتى يتم تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    
    const productGrid = document.getElementById('product-grid');
    const categoriesBar = document.getElementById('categories-bar');
    let allProducts = [];

    // --- الجزء الخاص برقم الواتساب ---
    // هذا هو اسم متغير البيئة الذي سنضيفه في Cloudflare
    // في بيئة التطوير المحلية، سيستخدم الرقم الموجود بعد "||"
    // **مهم:** استبدل الرقم التالي برقمك عند الاختبار على جهازك
    const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || '963912345678'; 

    // 1. جلب المنتجات من ملف JSON
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            displayProducts(allProducts);
            createCategoryFilters(allProducts);
        })
        .catch(error => {
            console.error('خطأ في جلب المنتجات:', error);
            productGrid.innerHTML = '<p>عفواً، حدث خطأ أثناء تحميل المنتجات.</p>';
        });

    // 2. دالة عرض المنتجات (مع التعديلات الجديدة)
    function displayProducts(products) {
        productGrid.innerHTML = ''; // إفراغ الشبكة قبل عرض المنتجات الجديدة
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // تم تعديل هذا الجزء ليحتوي على السعر بالليرة السورية وزر الطلب
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description}</p>
                    <div class="card-footer">
                        <p class="price">${product.price.toLocaleString()} ل.س</p> 
                        <button class="order-button" data-product-name="${product.name}">اطلب عبر واتساب</button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });

        // بعد عرض المنتجات، نقوم بتفعيل أزرار الطلب
        addOrderButtonListeners();
    }

    // 3. دالة إنشاء أزرار الفئات (تبقى كما هي)
    function createCategoryFilters(products) {
        const categories = ['الكل', ...new Set(products.map(p => p.category))];
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-button';
            button.innerText = category;
            if (category === 'الكل') button.classList.add('active');
            button.addEventListener('click', (e) => {
                document.querySelector('.category-button.active').classList.remove('active');
                e.target.classList.add('active');
                const filtered = category === 'الكل' ? allProducts : allProducts.filter(p => p.category === category);
                displayProducts(filtered);
            });
            categoriesBar.appendChild(button);
        });
    }

    // 4. دالة جديدة لتفعيل أزرار الطلب وتنفيذ عملية الواتساب
    function addOrderButtonListeners() {
        const orderButtons = document.querySelectorAll('.order-button');
        orderButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productName = button.dataset.productName;

                // الخطوة 1: طلب الاسم
                const customerName = prompt(`لطلب المنتج "${productName}"\n\nالخطوة 1 من 3: الرجاء إدخال الاسم الكريم:`);
                if (!customerName) { // إذا ضغط المستخدم "Cancel" أو ترك الحقل فارغًا
                    alert("تم إلغاء الطلب.");
                    return; 
                }

                // الخطوة 2: طلب الكمية
                const quantity = prompt(`أهلاً بك ${customerName}!\n\nالخطوة 2 من 3: الرجاء إدخال الكمية المطلوبة:`);
                if (!quantity) {
                    alert("تم إلغاء الطلب.");
                    return;
                }

                // الخطوة 3: طلب طريقة الدفع
                const paymentChoice = prompt(`الخطوة 3 من 3: اختر طريقة الدفع:\n\n1- عند التسليم`);
                if (!paymentChoice) {
                    alert("تم إلغاء الطلب.");
                    return;
                }
                const paymentMethod = 'عند التسليم';

                // رسالة التأكيد قبل التحويل
                alert("رائع! طلبك جاهز للإرسال. سيتم الآن تحويلك إلى واتساب.");

                // إنشاء رسالة الواتساب
                const message = `
*طلب جديد من المتجر*
-----------------
*الاسم:* ${customerName}
*المنتج:* ${productName}
*الكمية:* ${quantity}
*طريقة الدفع:* ${paymentMethod}
-----------------
الرجاء تأكيد الطلب.
                `;

                // تحويل الرسالة لتكون صالحة للاستخدام في رابط
                const encodedMessage = encodeURIComponent(message.trim());

                // إنشاء رابط الواتساب النهائي باستخدام الرقم من أعلى الكود
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

                // فتح الرابط في نافذة جديدة
                window.open(whatsappUrl, '_blank');
            });
        });
    }
});
