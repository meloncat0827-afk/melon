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
// 新增遊戲狀態變數
let isMatching = false;
let botLumen = 2; // 機器人的光芒

// 1. 切換配對模式
function toggleMatch() {
    isMatching = !isMatching;
    const btn = document.getElementById('match-btn');
    if (isMatching) {
        btn.innerText = "尋找對手 (配對中: ON)";
        btn.style.boxShadow = "0 0 10px var(--lumen-blue)";
        // 這裡可以加入配對動畫
    } else {
        btn.innerText = "尋找對手 (配對中: OFF)";
        btn.style.boxShadow = "none";
    }
}

// 2. 機器人 AI 出牌邏輯
function botTurn() {
    // 機器人只會出 Defense 或 Evasion
    const botPool = ['Defense', 'Evasion'];
    const randomType = botPool[Math.floor(Math.random() * botPool.length)];
    
    const botCard = {
        stars: Math.floor(Math.random() * 2) + 1, // 機器人出牌較保守 1~2星
        power: Math.floor(Math.random() * 3) + 1,
        type: randomType
    };

    // 渲染機器人出的牌到對手槽
    const oppSlot = document.getElementById('opp-slot');
    oppSlot.innerHTML = `
        <div class="card" style="border-color: var(--clash-red); transform: scale(1);">
            <div style="padding:10px">
                <div style="font-size:12px">${botCard.type}</div>
                <div style="color:silver">${'★'.repeat(botCard.stars)}</div>
                <div style="font-size:20px; text-align:center; margin-top:20px">P:${botCard.power}</div>
            </div>
        </div>
    `;

    return botCard;
}

// 3. 修改原有的 playCard 函數，加入對戰邏輯
async function playCard(cardData, cardElement) {
    const cost = cardData.stars;
    if (playerLumen < cost) {
        alert("光芒不足！");
        return;
    }

    // 玩家出牌
    playerLumen -= cost;
    updateUI();
    
    // 移動玩家卡牌動畫 (沿用之前的邏輯)
    moveCardToSlot(cardElement, 'player-slot');

    // 檢查是否為機器人對戰模式
    if (!isMatching) {
        document.getElementById('clash-message').innerText = "機器人思考中...";
        
        // 延遲 1 秒模擬機器人出牌
        setTimeout(() => {
            const botCard = botTurn();
            processClash(cardData, botCard);
        }, 1000);
    } else {
        document.getElementById('clash-message').innerText = "等待對手出牌...";
        // 這裡未來接 Socket.io 實作真人對戰
    }
}

// 4. 拼點判定 (Clash Judgment)
function processClash(pCard, bCard) {
    // 基礎點數 = 星數 * 強度
    const pPoint = (pCard.stars * pCard.power) + (Math.floor(Math.random() * 3));
    const bPoint = (bCard.stars * bCard.power) + (Math.floor(Math.random() * 3));
    
    let resultMsg = "";
    if (pPoint > bPoint) {
        resultMsg = `贏了！ ${pPoint} vs ${bPoint}`;
        document.getElementById('clash-message').style.color = "var(--lumen-blue)";
    } else if (pPoint < bPoint) {
        resultMsg = `輸了！ ${pPoint} vs ${bPoint} (卡牌失效)`;
        document.getElementById('clash-message').style.color = "var(--clash-red)";
    } else {
        resultMsg = "平手！點數相同";
        document.getElementById('clash-message').style.color = "white";
    }
    
    document.getElementById('clash-message').innerText = resultMsg;
}

// 輔助函數：移動動畫
function moveCardToSlot(el, slotId) {
    const slot = document.getElementById(slotId);
    const slotRect = slot.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    el.style.transform = `translate(${slotRect.left - rect.left}px, ${slotRect.top - rect.top}px) scale(1.1)`;
    el.style.zIndex = "100";
    el.style.pointerEvents = "none";
}

// 重置遊戲
function resetGame() {
    playerLumen = 2;
    updateUI();
    document.getElementById('player-slot').innerHTML = '';
    document.getElementById('opp-slot').innerHTML = '';
    document.getElementById('clash-message').innerText = "WAITING FOR CLASH...";
    renderHand();
}
