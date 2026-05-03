const data = {
    times: ["在凌晨三點時", "當鐘聲敲響十二次後", "在雨停之前的瞬間", "於日落之時", "在看見第一道光後"],
    verbs: ["殺死", "吃掉", "埋葬", "記錄下", "獻祭", "燒毀"],
    senses: ["所看見的", "所聽見的", "所畫出的", "所觸碰到的", "記憶中的"],
    names: ["路人", "代理人", "指點者", "傳令員", "罪人", "後巷的野狗"]
};

function generatePrescript() {
    const t = getRandom(data.times);
    const v = getRandom(data.verbs);
    const s = getRandom(data.senses);
    const n = getRandom(data.names);

    // 格式化指令：[時間] + [動作] + 你所 [感官] + 的 [對象]
    const fullText = `${t}，${v}你${s}${n}。`;

    const box = document.getElementById('prescript-box');
    
    // 加上動畫重置
    box.innerHTML = `<p class="prescript-text">${fullText}</p>`;
    
    // 觸發印章效果 (可選)
    applySealEffect();
}

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}
