document.addEventListener('DOMContentLoaded', () => {
    const SHOP_ITEMS = [
      { id: 'premium_food', name: 'Премиум корм', description: 'Повышает сытость на 20%', price: 100, image: 'assets/images/shop/premium-food.png', category: 'food' },
      { id: 'bed', name: 'Мягкая кровать', description: 'Уютная кровать для Мэшика', price: 500, image: 'assets/images/shop/pillow.png', category: 'furniture' },
      { id: 'toy', name: 'Игрушка', description: 'Кажется, ей можно положить сервера!', price: 100, image: 'assets/images/shop/toy.png', category: 'toy' }
    ];
    
    const COINS_KEY = 'meshikCoins';
    const INVENTORY_KEY = 'meshikInventory';
    
    function getCoins() {
        let coins = localStorage.getItem(COINS_KEY);
        return coins ? parseInt(coins) : 2000;
    }
    
    function setCoins(value) {
        localStorage.setItem(COINS_KEY, value);
        updateCoinDisplay();
    }
    
    function updateCoinDisplay() {
        document.getElementById('coinCount').textContent = getCoins();
    }
    
    function getInventory() {
        let inv = localStorage.getItem(INVENTORY_KEY);
        return inv ? JSON.parse(inv) : [];
    }
    
    function setInventory(inventory) {
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
        displayInventory();
    }
    
    function displayShopItems() {
        const shopItemsContainer = document.querySelector('.shop-items');
        shopItemsContainer.innerHTML = '';
        SHOP_ITEMS.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'shop-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <p>Цена: <span class="item-price">${item.price} монет</span></p>
                <button class="shop-buy-btn" data-item="${item.id}">
                Купить
                <svg class="buyIcon" viewBox="0 0 576 512"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
                </button>
            `;
            shopItemsContainer.appendChild(itemDiv);
        });
      }      
    
      function displayInventory() {
        const inventoryContainer = document.querySelector('.inventory');
        inventoryContainer.innerHTML = '';
        const inventory = getInventory();
        inventory.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item purchased';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
            `;
            inventoryContainer.appendChild(itemDiv);
        });
      }      
    
    function buyItem(itemId) {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return;
        let coins = getCoins();
        if (coins >= item.price) {
            coins -= item.price;
            setCoins(coins);
            let inventory = getInventory();
            inventory.push(item);
            setInventory(inventory);
            if (item.category === 'furniture') {
                addFurniture(item);
            }
            alert(`Вы купили ${item.name}!`);
        } else {
            alert('Недостаточно монет');
        }
    }
    
    function addFurniture(item) {
        const furnitureContainer = document.getElementById('furnitureContainer');
        const furnitureImg = document.createElement('img');
        furnitureImg.src = item.image;
        furnitureImg.alt = item.name;
        furnitureImg.className = 'furniture-item';
        furnitureContainer.appendChild(furnitureImg);
    }
    
    // Обработчики для открытия и закрытия магазина
    const shopBtn = document.getElementById('shopBtn');
    const shopModal = document.getElementById('shopModal');
    const closeShopBtn = document.getElementById('closeShopBtn');
    
    shopBtn.addEventListener('click', () => {
      updateCoinDisplay();
      displayShopItems();
      displayInventory();
      shopModal.classList.add('active');
    });
    
    closeShopBtn.addEventListener('click', () => {
      shopModal.classList.remove('active');
    });
    
    // Обработчик для покупки товара
    document.querySelector('.shop-items').addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            const itemId = e.target.getAttribute('data-item');
            buyItem(itemId);
        }
    });
  });  