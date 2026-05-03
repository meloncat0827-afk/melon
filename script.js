const data = {
    times: ["在空無一物的時刻", "當第十三聲蟬鳴響起時", "在血液凝固的溫度下", "當影子長過本體之時", "在被遺忘的夢境邊緣", "於尚未命名的色彩中"],
    verbs: ["編織", "抹除", "親吻", "拆解", "凝視", "咀嚼", "雕刻", "縫補"],
    senses: ["未曾存在的", "正在腐爛的", "不可直視的", "被奪走名字的", "散發鐵鏽味的", "透明的"],
    names: ["虛無", "螺旋", "線條的末端", "昨日的餘溫", "所有人的沈默", "齒輪的喘息", "褪色的誓言"],
    abstract_prefix: ["為了證明服從，你必須", "以都市之名，准許你", "在苦難的盡頭，請務必", "這是不容置疑的意志："],
    requirements: ["保持呼吸的韻律與時鐘同步", "將眼球轉向不存在的方位", "用指尖感受重力的重量", "在心中默唸不存在的數字"]
};

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generatePrescript() {
    const box = document.getElementById('prescript-box');
    
    // 隨機決定指令結構
    const structureType = Math.random();
    let fullHTML = '';

    if (structureType > 0.5) {
        // 結構 A：經典分格式 (時間 + 動作 + 感官 + 對象)
        fullHTML = `
            <p class="prescript-text">
                <span class="highlight">${getRandom(data.times)}</span>，
                <span class="highlight">${getRandom(data.verbs)}</span>你
                <span class="highlight">${getRandom(data.senses)}</span>的
                <span class="highlight">${getRandom(data.names)}</span>。
            </p>
        `;
    } else {
        // 結構 B：抽象要求式 (前綴 + 具體要求的抽象化)
        fullHTML = `
            <p class="prescript-text">
                <span class="highlight">${getRandom(data.abstract_prefix)}</span>
                <span class="highlight">${getRandom(data.requirements)}</span>，並
                <span class="highlight">${getRandom(data.verbs)}</span>
                <span class="highlight">${getRandom(data.names)}</span>。
            </p>
        `;
    }

    box.innerHTML = fullHTML;
    
    // 視覺回饋：背景隨機閃爍紅光
    triggerEmergencyEffect();
}

function triggerEmergencyEffect() {
    const container = document.querySelector('.index-container');
    container.style.borderColor = '#8b0000';
    setTimeout(() => {
        container.style.borderColor = '#333';
    }, 100);
}
