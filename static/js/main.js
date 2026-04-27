/* ========================================
   MAIN.JS - HOSPITAL GEOSALUD AVANCE_1
   Completo | Funcional | Interactivo
   Con asignación corregida para perfil
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. HEADER SCROLL EFFECT
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 10px 40px rgba(0, 50, 100, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 8px 32px rgba(0, 50, 100, 0.1)';
            }
        });
    }

    // 2. SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. TOGGLE PASSWORD (Login)
    const togglePassword = document.querySelector('#togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.querySelector('#password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // 4. TOGGLE PASSWORD (Registro - múltiples)
    document.querySelectorAll('.toggle-pwd').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input && input.classList.contains('pwd-input')) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            }
        });
    });

    // 5. VALIDACIÓN BOTÓN REGISTRO
    const terms = document.getElementById('terms');
    const privacy = document.getElementById('privacy');
    const btnSubmit = document.getElementById('btnSubmit');

    if (terms && privacy && btnSubmit) {
        function validateTerms() {
            if (terms.checked && privacy.checked) {
                btnSubmit.disabled = false;
                btnSubmit.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                btnSubmit.style.color = 'white';
                btnSubmit.style.cursor = 'pointer';
            } else {
                btnSubmit.disabled = true;
                btnSubmit.style.background = '#bdc3c7';
                btnSubmit.style.color = '#7f8c8d';
                btnSubmit.style.cursor = 'not-allowed';
            }
        }

        terms.addEventListener('change', validateTerms);
        privacy.addEventListener('change', validateTerms);
    }

    // 6. GUARDAR DATOS DEL REGISTRO
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const tipoDocumento = this.querySelector('select').value || 'DNI';
            const numeroDocumento = this.querySelector('input[placeholder="Ej. 70654321"]').value || '';
            const fechaNacimiento = this.querySelector('input[type="date"]').value || '';
            const email = this.querySelector('input[type="email"]').value || '';
            const celular = this.querySelector('input[type="tel"]').value || '';
            
            const formData = {
                tipoDocumento,
                numeroDocumento,
                fechaNacimiento,
                email,
                celular,
                nombre: email.split('@')[0] || 'Usuario'
            };
            
            localStorage.setItem('geoSaludUser', JSON.stringify(formData));
            alert('¡Registro exitoso! Bienvenido a GeoSalud.');
            window.location.href = 'perfil.html';
        });
    }

    // 7. CARGAR DATOS EN PERFIL - ASIGNACIÓN CORREGIDA
    const userData = JSON.parse(localStorage.getItem('geoSaludUser')) || {};

    if (Object.keys(userData).length > 0) {
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.nombre)}&background=0076BE&color=fff&size=128`;
        }

        const userFullName = document.getElementById('userFullName');
        if (userFullName) userFullName.textContent = userData.nombre || 'Usuario';

        const userRole = document.getElementById('userRole');
        if (userRole) {
            userRole.textContent = 'Paciente Verificado';
            userRole.style.color = '#10b981';
        }

        const setText = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val || 'Sin datos';
        };

        setText('profileFullName', userData.nombre);

        if(userData.fechaNacimiento) {
            const d = new Date(userData.fechaNacimiento);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            setText('profileBirthDate', d.toLocaleDateString('es-PE', options));
        } else {
            setText('profileBirthDate', 'Sin datos');
        }

        const tipoDocUpper = userData.tipoDocumento ? userData.tipoDocumento.toUpperCase() : 'DNI';
        setText('profileDocument', `${tipoDocUpper} ${userData.numeroDocumento || ''}`);
        setText('profileEmail', userData.email);
        setText('profilePhone', userData.celular);
        setText('profileDocType', tipoDocUpper);
    }

    // 8. LOGOUT
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('geoSaludUser');
            window.location.href = 'login.html';
        });
    }

    // 9. INICIALIZAR MAPA (Solo si existe el contenedor)
    if (document.getElementById('location-map')) {
        initHospitalMap();
    }

    // 10. ACTUALIZAR BOTÓN LOGIN EN INDEX
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && Object.keys(userData).length > 0) {
        loginBtn.innerHTML = '<i class="fas fa-user-circle"></i> Mi Perfil';
        loginBtn.href = 'perfil.html';
    }

});

// FUNCIONES GLOBALES

function initHospitalMap() {
    if(typeof L === 'undefined') return;

    const map = L.map('location-map').setView([-12.0464, -77.0428], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const hospitalIcon = L.divIcon({
        html: '<div style="background: linear-gradient(135deg, #3b82f6,#1d4ed8); width:50px; height:50px; border-radius:50%; border:4px solid white; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:1.2rem; box-shadow:0 8px 25px rgba(59,130,246,0.4);">H</div>',
        className: 'custom-div-icon',
        iconSize: [50, 50],
        iconAnchor: [25, 25]
    });

    L.marker([-12.0464, -77.0428], {icon: hospitalIcon}).addTo(map)
        .bindPopup('<b>Hospital Clínico GeoSalud</b><br>Av. Javier Prado Este 1234<br>San Isidro, Lima')
        .openPopup();
}