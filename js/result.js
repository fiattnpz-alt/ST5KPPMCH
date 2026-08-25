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

  // Bind values
  document.getElementById('scoreDisplay').innerHTML = `${score} <span class="score-total">/ 15 คะแนน</span>`;
  
  const badge = document.getElementById('resultBadge');
  badge.innerText = resultText;
  
  // Set badge color and advice based on score
  const adviceBox = document.getElementById('resultAdvice');
  
  if (score <= 4) {
    badge.className = 'result-badge low';
    adviceBox.style.borderLeftColor = 'var(--success-color)';
    adviceBox.innerHTML = `
      <strong>คำแนะนำ: ความเครียดระดับน้อย (ปกติ)</strong><br>
      สุขภาพจิตของคุณอยู่ในเกณฑ์ดีทั่วไป สามารถจัดการกับความเครียดในชีวิตประจำวันได้ดี แนะนำให้ทำกิจกรรมนันทนาการที่คุณชื่นชอบ ออกกำลังกายอย่างสม่ำเสมอ และดูแลสุขอนามัยการนอนหลับที่ดี เพื่อรักษาสมดุลจิตใจที่ผ่อนคลายนี้ต่อไป
    `;
  } else if (score <= 7) {
    badge.className = 'result-badge medium';
    adviceBox.style.borderLeftColor = 'var(--warning-color)';
    adviceBox.innerHTML = `
      <strong>คำแนะนำ: ความเครียดระดับปานกลาง</strong><br>
      คุณอาจมีความกังวลหรือความตึงเครียดจากชีวิตประจำวัน การทำงาน หรือสิ่งแวดล้อมสะสมอยู่บ้าง แนะนำให้หาเวลาพักผ่อนระหว่างวัน ฝึกการหายใจลึกๆ ทำสมาธิ พูดคุยปรึกษากับเพื่อนฝูงหรือครอบครัวเพื่อระบาย และหากิจกรรมที่สร้างสรรค์เพื่อผ่อนคลายความตึงเครียด
    `;
  } else if (score <= 9) {
    badge.className = 'result-badge high';
    adviceBox.style.borderLeftColor = 'var(--danger-color)';
    adviceBox.innerHTML = `
      <strong>คำแนะนำ: ความเครียดระดับสูง</strong><br>
      ร่างกายและจิตใจของคุณเริ่มมีภาวะตึงเครียดสะสมในระดับที่อาจส่งผลกระทบต่อกิจกรรมในชีวิตประจำวันหรือการนอนหลับได้ ควรปรับลดภาระงานลงชั่วคราว นอนหลับพักผ่อนให้เพียงพอ หลีกเลี่ยงเครื่องดื่มแอลกอฮอล์และคาเฟอีน หากลองปรับเปลี่ยนพฤติกรรมแล้วยังรู้สึกตึงเครียดหรือนอนไม่หลับเกิน 2 สัปดาห์ แนะนำให้ปรึกษานักจิตวิทยาหรือจิตแพทย์เพื่อรับคำแนะนำที่เหมาะสม
    `;
  } else {
    badge.className = 'result-badge high'; // Shared class style
    badge.style.backgroundColor = '#991b1b'; // Darker red for critical
    adviceBox.style.borderLeftColor = '#991b1b';
    adviceBox.innerHTML = `
      <strong>คำแนะนำ: ความเครียดระดับสูงมาก (วิกฤต)</strong><br>
      <span style="color: #991b1b; font-weight: bold;">สภาวะจิตใจกำลังรับแรงกดดันหรือความเครียดสูงมาก</span> อาจส่งผลต่อสุขภาพกาย เช่น ใจสั่น ปวดหัว นอนไม่หลับรุนแรง แนะนำให้ขอความช่วยเหลือจากบุคคลรอบข้างทันที และควรเข้ารับการคำปรึกษาจากสายด่วนสุขภาพจิตโทร 1323 (ฟรี 24 ชม.) หรือเดินทางเข้าพบนักจิตวิทยา/จิตแพทย์ที่โรงพยาบาลใกล้บ้านเพื่อการประเมินและช่วยเหลืออย่างมีประสิทธิภาพ
    `;
  }

  // Set user summary card values
  document.getElementById('summaryName').innerText = `${titlePrefix}${firstName} ${lastName}`;
  document.getElementById('summaryCitizenId').innerText = citizenId;
  document.getElementById('summaryPhone').innerText = phone;
  document.getElementById('summaryAddress').innerText = address;

  // Set mental health screening summary values (2Q and 1Q)
  const depEl = document.getElementById('summaryDepression');
  depEl.innerText = depResult || '-';
  if (depResult && depResult.includes('เสี่ยง')) {
    depEl.style.color = 'var(--danger-color)';
  } else {
    depEl.style.color = 'var(--success-color)';
  }

  const suicideEl = document.getElementById('summarySuicide');
  suicideEl.innerText = suicideResult || '-';
  if (suicideResult && suicideResult.includes('เสี่ยง')) {
    suicideEl.style.color = 'var(--danger-color)';
  } else {
    suicideEl.style.color = 'var(--success-color)';
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
