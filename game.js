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
