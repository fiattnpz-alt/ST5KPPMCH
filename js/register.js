document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  
  // Clean localStorage from any previous run before starting a new registration
  localStorage.removeItem('stress_titlePrefix');
  localStorage.removeItem('stress_firstName');
  localStorage.removeItem('stress_lastName');
  localStorage.removeItem('stress_citizenId');
  localStorage.removeItem('stress_phone');
  localStorage.removeItem('stress_address');
  localStorage.removeItem('stress_score');
  localStorage.removeItem('stress_resultText');
  localStorage.removeItem('stress_answers');

  const fields = ['titlePrefix', 'firstName', 'lastName', 'citizenId', 'phone', 'address'];

  // Input validation on blur/input/change
  fields.forEach(fieldId => {
    const input = document.getElementById(fieldId);
    const errorDiv = document.getElementById(`${fieldId}Error`);
    
    const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(eventType, () => {
      validateField(input, errorDiv);
    });
  });

  function validateField(input, errorDiv) {
    let isValid = true;
    
    if (input.required && (!input.value || !input.value.trim())) {
      isValid = false;
      const labelText = input.previousElementSibling ? input.previousElementSibling.textContent.replace(' *', '') : 'ข้อมูล';
      errorDiv.textContent = `กรุณากรอก${labelText}`;
    } else if (input.id === 'titlePrefix') {
      if (!input.value) {
        isValid = false;
        errorDiv.textContent = 'กรุณาเลือกคำนำหน้า';
      }
    } else if (input.id === 'citizenId') {
      const idRegex = /^[0-9]{13}$/;
      const sanitizedId = input.value.replace(/[- ]/g, ''); // strip dashes/spaces
      if (!idRegex.test(sanitizedId)) {
        isValid = false;
        errorDiv.textContent = 'กรุณากรอกเลขบัตรประชาชน 13 หลักให้ถูกต้อง';
      }
    } else if (input.type === 'tel') {
      const phoneRegex = /^0[0-9]{8,9}$/; // simple Thai phone format: 9-10 digits starting with 0
      const sanitizedPhone = input.value.replace(/[- ]/g, ''); // strip dashes/spaces
      if (!phoneRegex.test(sanitizedPhone)) {
        isValid = false;
        errorDiv.textContent = 'กรุณากรอกเบอร์โทรศัพท์ 9-10 หลักให้ถูกต้อง (เช่น 08xxxxxxxx)';
      }
    }

    if (isValid) {
      errorDiv.style.display = 'none';
      input.style.borderColor = 'var(--border-color)';
    } else {
      errorDiv.style.display = 'block';
      input.style.borderColor = 'var(--danger-color)';
    }
    
    return isValid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    fields.forEach(fieldId => {
      const input = document.getElementById(fieldId);
      const errorDiv = document.getElementById(`${fieldId}Error`);
      if (!validateField(input, errorDiv)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Save data to localStorage
      localStorage.setItem('stress_titlePrefix', document.getElementById('titlePrefix').value);
      localStorage.setItem('stress_firstName', document.getElementById('firstName').value.trim());
      localStorage.setItem('stress_lastName', document.getElementById('lastName').value.trim());
      localStorage.setItem('stress_citizenId', document.getElementById('citizenId').value.trim().replace(/[- ]/g, ''));
      localStorage.setItem('stress_phone', document.getElementById('phone').value.trim().replace(/[- ]/g, ''));
      localStorage.setItem('stress_address', document.getElementById('address').value.trim());

      // Redirect to evaluation page
      window.location.href = 'evaluate.html';
    }
  });
});
