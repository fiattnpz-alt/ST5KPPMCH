document.addEventListener('DOMContentLoaded', () => {
  const titlePrefix = localStorage.getItem('stress_titlePrefix');
  const firstName = localStorage.getItem('stress_firstName');
  const lastName = localStorage.getItem('stress_lastName');
  const citizenId = localStorage.getItem('stress_citizenId');
  const phone = localStorage.getItem('stress_phone');
  const address = localStorage.getItem('stress_address');
  const scoreStr = localStorage.getItem('stress_score');
  const resultText = localStorage.getItem('stress_resultText');
  const depResult = localStorage.getItem('stress_depResult');
  const suicideResult = localStorage.getItem('stress_suicideResult');

  if (!titlePrefix || !firstName || !lastName || !citizenId || !phone || !address || scoreStr === null) {
    alert('ไม่พบผลการประเมิน กรุณาลงทะเบียนและทำแบบประเมินก่อน');
    window.location.href = 'index.html';
    return;
  }

  const score = parseInt(scoreStr, 10);

  // Bind score values to the new score ring
  document.getElementById('scoreNumber').innerText = score;

  const badge = document.getElementById('resultBadge');
  badge.innerText = resultText;

  // Set badge class and advice based on score
  const adviceBox = document.getElementById('resultAdvice');
  const scoreRing = document.getElementById('scoreRing');

  if (score <= 4) {
    badge.className = 'result-badge-new badge-low';
    scoreRing.style.borderColor = 'var(--success)';
    adviceBox.style.borderLeftColor = 'var(--success)';
    adviceBox.innerHTML = `
      <strong>✅ ความเครียดระดับน้อย (ปกติ)</strong><br>
      ยินดีด้วย ความเครียดระดับนี้เป็นความเครียดในชีวิตประจำวันที่ทุกคนต้องเจออยู่แล้ว ซึ่งแต่ละคนสามารถปรับตัวได้เอง โดยไม่ก่อให้เกิดปัญหาสุขภาพ และที่สำคัญคุณยังสามารถช่วยดูแลคนอื่นๆ ได้อีกด้วย
    `;
  } else if (score <= 7) {
    badge.className = 'result-badge-new badge-medium';
    scoreRing.style.borderColor = 'var(--warning)';
    document.getElementById('scoreNumber').style.color = 'var(--warning)';
    adviceBox.style.borderLeftColor = 'var(--warning)';
    adviceBox.innerHTML = `
      <strong>🟡 ความเครียดระดับปานกลาง</strong><br>
      ความเครียดระดับบนี้ เป็นความเครียดที่เกิดจากการต้องเตรียมพร้อมในการจัดการปัญหาต่างๆ จึงทำให้เกิดความเครียดเพิ่มขึ้นในระดับปานกลาง ซึ่งถือว่ายังปกติ เพราะความเครียดระดับนี้ทำให้เราเกิดความกระตือรือร้นในการเผชิญกับปัญหาที่เข้ามา
    `;
  } else if (score <= 9) {
    badge.className = 'result-badge-new badge-high';
    scoreRing.style.borderColor = 'var(--danger)';
    document.getElementById('scoreNumber').style.color = 'var(--danger)';
    adviceBox.style.borderLeftColor = 'var(--danger)';
    adviceBox.innerHTML = `
      <strong>🔴 ความเครียดระดับสูง</strong><br>
      ความเครียดระดับนี้อาจทำให้เกิดการตอบสนองเหตุการณ์รุนแรงขึ้นชั่วคราวได้ แต่ก็มักจะลดลงมาเป็นปกติเมื่อเหตุการณ์สิ้นสุดหรือจบลง เครียดแบบนี้เรามีวิธีจัดการอย่างง่ายๆ <br>
      - หายใจเข้าลึกๆ หายใจออกยาวๆอย่างต่อเนื่องไปจนรู้สึกผ่อนคลาย<br>
      - ควรนอนหลับพักผ่อนอย่างเพียงพอ<br>
      - พูดคุยกันคนใกล้ชิด <br>
      - ใช้หลักศาสนาทำให้คลายกังวล <br>
      - ให้กำลังใจตัวเองว่าเราจะฝ่าฟันอุปสรรค์หรือปัญหาครั้งนี้ไปได้และมองด้านบวก <br>
      - ภายใน 2 สัปดาห์ ถ้าคุณยังรู้สึกไม่ดีขึ้น แสดงว่าความเครียดยังไม่ลดลง คุณควรไปพบแพทย์เพื่อประเมินซ้ำ เพราะความเครียดที่มากและต่อเนื่องอาจจะนำไปสู่โรควิตกกังวล ภาวะซึมเศร้า และเสี่ยงต่อการฆ่าตัวตายได้
    `;
  } else {
    badge.className = 'result-badge-new badge-critical';
    scoreRing.style.borderColor = 'var(--critical)';
    document.getElementById('scoreNumber').style.color = 'var(--critical)';
    adviceBox.style.borderLeftColor = 'var(--critical)';
    adviceBox.innerHTML = `
      <strong>🆘 ความเครียดระดับสูงมาก (วิกฤต)</strong><br>
      <span style="color: var(--critical); font-weight: bold;">สภาวะจิตใจกำลังรับแรงกดดันหรือความเครียดสูงมาก</span> ความเครียดระดับที่รุนแรง ซึ่งส่งผลต่อสุขภาพร่างกาย ร่างกายจะอ่อนแอ เจ็บปวดง่าย และมีผลต่อภาวะจิตใจจนอาจเกิดโรควิตกกังวล ภาวะซึมเศร้า และเสี่ยงต่อการฆ่าตัวตายได้ คุณควรเข้ารับการรักษาจากแพทย์ทันที เพื่อรับการดูแลต่อเนื่องอย่างใกล้ชิดไปอีก 3-6 เดือน
    `;
  }

  // Set user summary card values
  document.getElementById('summaryName').innerText = `${titlePrefix}${firstName} ${lastName}`;
  document.getElementById('summaryCitizenId').innerText = citizenId;
  document.getElementById('summaryPhone').innerText = phone;
  document.getElementById('summaryAddress').innerText = address;

  // Set screening result pills (2Q and 1Q) with class-based styling
  const depEl = document.getElementById('summaryDepression');
  if (depResult && depResult.includes('เสี่ยง')) {
    depEl.innerText = '⚠ ' + depResult;
    depEl.className = 'screen-result risk';
  } else {
    depEl.innerText = '✓ ' + (depResult || 'ปกติ');
    depEl.className = 'screen-result safe';
  }

  const suicideEl = document.getElementById('summarySuicide');
  if (suicideResult && suicideResult.includes('เสี่ยง')) {
    suicideEl.innerText = '⚠ ' + suicideResult;
    suicideEl.className = 'screen-result risk';
  } else {
    suicideEl.innerText = '✓ ' + (suicideResult || 'ปกติ');
    suicideEl.className = 'screen-result safe';
  }

  // Restart handler
  document.getElementById('restartBtn').addEventListener('click', () => {
    localStorage.removeItem('stress_titlePrefix');
    localStorage.removeItem('stress_firstName');
    localStorage.removeItem('stress_lastName');
    localStorage.removeItem('stress_citizenId');
    localStorage.removeItem('stress_phone');
    localStorage.removeItem('stress_address');
    localStorage.removeItem('stress_score');
    localStorage.removeItem('stress_resultText');
    localStorage.removeItem('stress_depResult');
    localStorage.removeItem('stress_suicideResult');
    localStorage.removeItem('stress_answers');
    window.location.href = 'index.html';
  });
});
