document.addEventListener('DOMContentLoaded', () => {
  // Check if registration data exists
  const titlePrefix = localStorage.getItem('stress_titlePrefix');
  const firstName = localStorage.getItem('stress_firstName');
  const lastName = localStorage.getItem('stress_lastName');
  const citizenId = localStorage.getItem('stress_citizenId');
  const phone = localStorage.getItem('stress_phone');
  const address = localStorage.getItem('stress_address');

  if (!titlePrefix || !firstName || !lastName || !citizenId || !phone || !address) {
    alert('กรุณาลงทะเบียนข้อมูลผู้ประเมินก่อนทำแบบประเมิน');
    window.location.href = 'index.html';
    return;
  }

  const form = document.getElementById('evaluationForm');
  const loadingOverlay = document.getElementById('loadingOverlay');

  // Calculate stress level helper
  function getStressResultText(score) {
    if (score <= 4) return 'ความเครียดระดับน้อย';
    if (score <= 7) return 'ความเครียดระดับปานกลาง';
    if (score <= 9) return 'ความเครียดระดับสูง';
    return 'ความเครียดระดับสูงมาก';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Read ST-5 questions (Stress)
    let totalScore = 0;
    const answers = {};
    let allAnswered = true;

    for (let i = 1; i <= 5; i++) {
      const selected = form.querySelector(`input[name="st5_q${i}"]:checked`);
      if (selected) {
        const val = parseInt(selected.value, 10);
        answers[`st5_q${i}`] = val;
        totalScore += val;
      } else {
        allAnswered = false;
      }
    }

    // 2. Read 2Q questions (Depression)
    const dep1 = form.querySelector('input[name="dep_q1"]:checked');
    const dep2 = form.querySelector('input[name="dep_q2"]:checked');
    
    if (!dep1 || !dep2) {
      allAnswered = false;
    } else {
      answers['dep_q1'] = dep1.value;
      answers['dep_q2'] = dep2.value;
    }

    // 3. Read 1Q question (Suicide Risk)
    const suicide1 = form.querySelector('input[name="suicide_q1"]:checked');
    if (!suicide1) {
      allAnswered = false;
    } else {
      answers['suicide_q1'] = suicide1.value;
    }

    if (!allAnswered) {
      alert('กรุณาตอบคำถามให้ครบทุกข้อ');
      return;
    }

    // Calculate diagnostic outcomes
    const stressResultText = getStressResultText(totalScore);
    
    const isDepressedRisk = (dep1.value === 'yes' || dep2.value === 'yes');
    const depResultText = isDepressedRisk ? 'มีความเสี่ยงซึมเศร้า' : 'ปกติ (ไม่มีความเสี่ยง)';
    
    const isSuicideRisk = (suicide1.value === 'yes');
    const suicideResultText = isSuicideRisk ? 'มีความเสี่ยงทำร้ายตนเอง' : 'ปกติ (ไม่มีความเสี่ยง)';

    // Combined result summary for Google Sheet Column F
    const combinedResultText = `${stressResultText} | ซึมเศร้า: ${depResultText} | ทำร้ายตัวเอง: ${suicideResultText}`;

    // Save results in localStorage to display on result page
    localStorage.setItem('stress_score', totalScore);
    localStorage.setItem('stress_resultText', stressResultText);
    localStorage.setItem('stress_depResult', depResultText);
    localStorage.setItem('stress_suicideResult', suicideResultText);
    localStorage.setItem('stress_answers', JSON.stringify(answers));

    // Show loading overlay spinner
    loadingOverlay.style.display = 'flex';

    // Prepare payload for submission
    const payload = {
      fullName: `${titlePrefix}${firstName} ${lastName}`,
      citizenId,
      phone,
      address,
      score: totalScore,
      resultText: combinedResultText, // Sends complete health screening summary to Column F
      answers
    };

    const submitPromises = [];

    // 1. Submit to Google Sheets
    if (CONFIG.GOOGLE_SCRIPT_URL && CONFIG.GOOGLE_SCRIPT_URL !== '') {
      submitPromises.push(
        fetch(CONFIG.GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Bypass CORS redirect blocks in simple setups
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(() => console.log('Successfully submitted to Google Sheet.'))
        .catch(err => console.error('Error submitting to Google Sheet:', err))
      );
    } else {
      console.log('Google Sheets URL not configured.');
    }

    // 2. Submit to local server backup endpoint (if not file:// protocol)
    if (window.location.protocol !== 'file:') {
      submitPromises.push(
        fetch('/api/submit-local', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => console.log('Saved to local DB:', data))
        .catch(err => console.log('Local backup server not available:', err))
      );
    }

    // Wait for network requests (or timeout after 1.5 seconds)
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1500));
    await Promise.race([
      Promise.all(submitPromises),
      timeoutPromise
    ]);

    // Go to result dashboard
    loadingOverlay.style.display = 'none';
    window.location.href = 'result.html';
  });
});
