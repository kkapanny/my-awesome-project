const dlg = document.getElementById('contactDialog');
	const openBtn = document.getElementById('openDialog');
	const closeBtn = document.getElementById('closeDialog');
	const form = document.getElementById('contactForm');
	let lastActive = null;
	openBtn.addEventListener('click', () => {
		lastActive = document.activeElement;
		dlg.showModal(); // модальный режим + затемнение
		dlg.querySelector('input,select,textarea,button')?.focus();
	});
	closeBtn.addEventListener('click', () => dlg.close('cancel'));
	form?.addEventListener('submit', (e) => {
	// валидация см. 1.4.2; при успехе закрываем окно
		const form = document.getElementById('contactForm');
		form?.addEventListener('submit', (e) => {
			// 1) Сброс кастомных сообщений
			[...form.elements].forEach(el => el.setCustomValidity?.(''));

			// 2) Проверка встроенных ограничений
			if (!form.checkValidity()) {
				e.preventDefault();

			// Пример: таргетированное сообщение
			const email = form.elements.email;
			if (email?.validity.typeMismatch) {
				email.setCustomValidity('Введите корректный e-mail, например, name@example.com');
			}

			form.reportValidity(); // показать браузерные подсказки

			// A11y: подсветка проблемных полей
			[...form.elements].forEach(el => {
				if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
			});
			return;
		}

		// 3) Успешная «отправка» (без сервера)
		e.preventDefault();
		// Если форма внутри <dialog>, закрываем окно:
		document.getElementById('contactDialog')?.close('success');
		showSuccessMessage();
		form.reset();
		});
	});
	dlg.addEventListener('close', () => { lastActive?.focus(); });
	// Esc по умолчанию вызывает событие 'cancel' и закрывает <dialog>

// Функция для показа сообщения об успехе
function showSuccessMessage() {
    const successDialog = document.createElement('dialog');
    successDialog.innerHTML = `
        <h2>Успешно!</h2>
        <p>Ваше сообщение успешно отправлено.</p>
        <button id="closeSuccessDialog">OK</button>
    `;
    
    document.body.appendChild(successDialog);
    
    successDialog.showModal();
    
    successDialog.querySelector('#closeSuccessDialog').addEventListener('click', () => {
        successDialog.close();
        successDialog.remove();
    });
    
    // Закрытие по клику вне диалога
    successDialog.addEventListener('click', (e) => {
        if (e.target === successDialog) {
            successDialog.close();
            successDialog.remove();
		}
    });
}

// Подсветка активного пункта меню
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// Вызвать при загрузке и навигации
document.addEventListener('DOMContentLoaded', setActiveNavLink);
window.addEventListener('popstate', setActiveNavLink);

// Переключение темы
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Проверяем сохранённую тему или системные настройки
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('theme-dark');
    }
}

// Переключаем тему
function toggleTheme() {
    const isDark = document.body.classList.toggle('theme-dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Инициализация темы при загрузке
document.addEventListener('DOMContentLoaded', initTheme);

// Обработчик клика по кнопке
themeToggle.addEventListener('click', toggleTheme);

// Следим за изменением системных настроек (опционально)
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        document.body.classList.toggle('theme-dark', e.matches);
    }
});
