const playerHandEl = document.getElementById('player-hand');

// 模擬卡牌數據
function generateCard() {
    return {
        stars: Math.floor(Math.random() * 3) + 1, // 1~3 星
        power: Math.floor(Math.random() * 3) + 1, // 1~3 強
        type: ['Attack', 'Defense', 'Evasion'][Math.floor(Math.random() * 3)],
        isRevealed: false
    };
}

let myHand = Array.from({ length: 7 }, generateCard);

// 隨機選 3 張牌讓對手可見
let revealIndices = [];
while(revealIndices.length < 3) {
    let r = Math.floor(Math.random() * 7);
    if(!revealIndices.includes(r)) revealIndices.push(r);
}
revealIndices.forEach(idx => myHand[idx].isRevealed = true);

// 渲染到頁面
function renderHand() {
    playerHandEl.innerHTML = '';
    myHand.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.isRevealed ? 'revealed' : ''}`;
        cardDiv.innerHTML = `
            <div style="padding:10px">
                <div style="font-size:12px">${card.type}</div>
                <div style="color:gold">${'★'.repeat(card.stars)}</div>
                <div style="font-size:20px; text-align:center; margin-top:20px">P:${card.power}</div>
            </div>
        `;
        playerHandEl.appendChild(cardDiv);
    });
}

renderHand();
// 核心變數
let playerLumen = 2; // 起始光芒
let isStoreOpen = false;

// 更新 UI 顯示
function updateUI() {
    document.getElementById('player-lumen').innerText = playerLumen;
}

// 1. 卡牌點擊事件與移動
function playCard(cardData, cardElement) {
    // 光芒消耗計算：星數 = 消耗 (你可以自定義公式)
    const cost = cardData.stars;

    if (playerLumen < cost) {
        alert("光芒不足！需要 " + cost + " 點，目前僅有 " + playerLumen);
        return;
    }

    // 扣除光芒
    playerLumen -= cost;
    updateUI();

    // 移動動畫：獲取目標位置 (拼點區)
    const slot = document.getElementById('player-slot');
    const slotRect = slot.getBoundingClientRect();
    const cardRect = cardElement.getBoundingClientRect();

    const deltaX = slotRect.left - cardRect.left;
    const deltaY = slotRect.top - cardRect.top;

    // 套用移動樣式
    cardElement.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
    cardElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.1)`;
    cardElement.style.zIndex = "1000";
    cardElement.style.pointerEvents = "none"; // 防止重複點擊

    // 模擬拼點訊息
    setTimeout(() => {
        document.getElementById('clash-message').innerText = "CLASHING...";
        document.getElementById('clash-message').style.color = "var(--clash-red)";
    }, 600);
}

// 2. 修改渲染函數，加入點擊監聽
function renderHand() {
    playerHandEl.innerHTML = '';
    myHand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.isRevealed ? 'revealed' : ''}`;
        cardDiv.innerHTML = `
            <div style="padding:10px">
                <div style="font-size:12px">${card.type}</div>
                <div style="color:gold">${'★'.repeat(card.stars)}</div>
                <div style="font-size:20px; text-align:center; margin-top:20px">P:${card.power}</div>
                <div style="font-size:10px; text-align:right; margin-top:10px">Cost: ${card.stars}</div>
            </div>
        `;
        
        // 點擊事件
        cardDiv.onclick = () => playCard(card, cardDiv);
        
        playerHandEl.appendChild(cardDiv);
    });
}

// 3. 商城頁面切換
function toggleStore() {
    const gameUI = document.getElementById('game-container');
    const storeUI = document.getElementById('store-container');
    
    isStoreOpen = !isStoreOpen;
    
    if (isStoreOpen) {
        gameUI.style.display = 'none';
        storeUI.style.display = 'block';
    } else {
        gameUI.style.display = 'flex';
        storeUI.style.display = 'none';
    }
}

// 初始化
updateUI();
renderHand();
