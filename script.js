// انتظر حتى يتم تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    
    const productGrid = document.getElementById('product-grid');
    const categoriesBar = document.getElementById('categories-bar');
    let allProducts = [];

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

    // 2. دالة لعرض بطاقات المنتجات
    function displayProducts(products) {
        productGrid.innerHTML = ''; // إفراغ الشبكة أولاً
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description}</p>
                    <p class="price">${product.price} ريال</p>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    // 3. دالة لإنشاء أزرار الفئات
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

                const filteredProducts = category === 'الكل' 
                    ? allProducts 
                    : allProducts.filter(p => p.category === category);
                
                displayProducts(filteredProducts);
            });
            categoriesBar.appendChild(button);
        });
    }
});
