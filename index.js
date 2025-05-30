
        // Хранилище пользователей
        let users = JSON.parse(localStorage.getItem('marketplace_users')) || [];
        let currentUser = JSON.parse(localStorage.getItem('marketplace_current_user')) || null;

        // DOM элементы
        const authContainer = document.getElementById('auth-container');
        const loginBtn = document.getElementById('login-btn');
        const registerHeroBtn = document.getElementById('register-hero-btn');
        const loginModal = document.getElementById('login-modal');
        const registerModal = document.getElementById('register-modal');
        const showRegisterBtn = document.getElementById('show-register');
        const showLoginBtn = document.getElementById('show-login');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const loginError = document.getElementById('login-error');
        const registerError = document.getElementById('register-error');
        const registerSuccess = document.getElementById('register-success');

        // Проверяем, есть ли авторизованный пользователь
        if (currentUser) {
            showUserProfile(currentUser);
        }

        // Показать модальное окно входа
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) return;
            loginModal.style.display = 'flex';
            registerModal.style.display = 'none';
        });

        // Показать модальное окно регистрации из хедера
        registerHeroBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) return;
            registerModal.style.display = 'flex';
            loginModal.style.display = 'none';
        });

        // Переключение между окнами входа и регистрации
        showRegisterBtn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
            registerSuccess.classList.add('hidden');
            registerError.classList.add('hidden');
        });

        showLoginBtn.addEventListener('click', () => {
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
            loginError.classList.add('hidden');
        });

        // Закрытие модальных окон при клике вне их
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
            }
            if (e.target === registerModal) {
                registerModal.style.display = 'none';
            }
        });

        // Обработка входа
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Проверяем пользователя
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Успешный вход
                currentUser = {
                    name: user.name,
                    email: user.email
                };
                localStorage.setItem('marketplace_current_user', JSON.stringify(currentUser));
                showUserProfile(currentUser);
                loginModal.style.display = 'none';
                loginError.classList.add('hidden');
            } else {
                // Ошибка входа
                loginError.textContent = 'Неверный email или пароль';
                loginError.classList.remove('hidden');
            }
        });

        // Обработка регистрации
        // Обработка регистрации
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Валидация
    if (password !== confirmPassword) {
        registerError.textContent = 'Пароли не совпадают';
        registerError.classList.remove('hidden');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        registerError.textContent = 'Пользователь с таким email уже существует';
        registerError.classList.remove('hidden');
        return;
    }
    
    // Регистрируем пользователя
    users.push({
        name,
        email,
        password
    });
    
    try {
        // Сохраняем в localStorage с проверкой
        localStorage.setItem('marketplace_users', JSON.stringify(users));
        
        // Проверяем, что данные сохранились
        const savedUsers = JSON.parse(localStorage.getItem('marketplace_users'));
        if (!savedUsers || !savedUsers.length) {
            throw new Error('Ошибка сохранения данных');
        }
        
        // Показываем сообщение об успехе
        registerError.classList.add('hidden');
        registerSuccess.classList.remove('hidden');
        
        // Очищаем форму
        registerForm.reset();
        
        // Переключаем на форму входа через 2 секунды
        setTimeout(() => {
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
            registerSuccess.classList.add('hidden');
        }, 2000);
    } catch (error) {
        registerError.textContent = 'Произошла ошибка при сохранении данных';
        registerError.classList.remove('hidden');
        console.error('Ошибка при сохранении:', error);
    }
});

        // Показать профиль пользователя
        function showUserProfile(user) {
            authContainer.innerHTML = `
                <div class="user-profile">
                    <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                    <span>${user.name}</span>
                    <div class="user-menu">
                        <a href="#">Мой профиль</a>
                        <a href="#">Мои заказы</a>
                        <a href="#" id="logout-btn">Выйти</a>
                    </div>
                </div>
            `;
            
            // Обработка выхода
            document.getElementById('logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }

        // Выход из системы
        function logout() {
            currentUser = null;
            localStorage.removeItem('marketplace_current_user');
            authContainer.innerHTML = '<a href="#" class="auth-btn" id="login-btn">Войти</a>';
            document.getElementById('login-btn').addEventListener('click', (e) => {
                e.preventDefault();
                loginModal.style.display = 'flex';
            });
        }
