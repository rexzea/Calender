document.addEventListener('DOMContentLoaded', () => {
    const monthDisplay = document.getElementById('monthDisplay');
    const datesContainer = document.getElementById('datesContainer');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const eventDateInput = document.getElementById('eventDate');
    const eventNoteInput = document.getElementById('eventNote');
    const saveEventBtn = document.getElementById('saveEvent');
    const eventModal = document.getElementById('eventModal');
    const closeModalBtn = document.querySelector('.close-btn');
    const modalDate = document.getElementById('modalDate');
    const modalEventNote = document.getElementById('modalEventNote');
    const updateEventBtn = document.getElementById('updateEvent');
    const deleteEventBtn = document.getElementById('deleteEvent');
    const eventColorSelect = document.getElementById('eventColor');
    const eventPrioritySelect = document.getElementById('eventPriority');
    const statsContainer = document.getElementById('statsContainer');
    const weatherContainer = document.getElementById('weatherContainer');
    const countdownContainer = document.getElementById('countdownContainer');

    let currentDate = new Date(2025, 0, 1);
    let selectedDate = null;
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
    let holidays = {
        '2025-01-01': '🎉 Tahun Baru',
        '2025-02-14': '❤️ Hari Valentine',
        '2025-08-17': '🇮🇩 Hari Kemerdekaan RI',
    };

    // Fitur Cuaca Sederhana (Mock)
    function fetchWeather() {
        const weatherData = [
            { day: 'Senin', temp: 28, icon: '☀️' },
            { day: 'Selasa', temp: 26, icon: '🌤️' },
            { day: 'Rabu', temp: 30, icon: '🌞' }
        ];
        

    }

    // Fitur Countdown Event
    function updateCountdowns() {
        const countdowns = [
            { 
                name: '🚀 Tahun Baru', 
                date: new Date('2025-01-01'),
                emoji: '🎉'
            },
            { 
                name: '🌍 Hari Bumi', 
                date: new Date('2025-04-22'),
                emoji: '🌎'
            }
        ];

        countdownContainer.innerHTML = countdowns.map(event => {
            const now = new Date();
            const diff = event.date - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            return `
                <div class="countdown-item">
                    <span>${event.emoji} ${event.name}</span>
                    <span><strong>${days} hari lagi</strong></span>
                </div>
            `;
        }).join('');
    }

    // Statistik Kalender
    function updateCalendarStats() {
        const currentMonthEvents = Object.keys(events).filter(date => 
            new Date(date).getMonth() === currentDate.getMonth() &&
            new Date(date).getFullYear() === currentDate.getFullYear()
        );

        statsContainer.innerHTML = `
            <div class="stat-item">
                <span>📅 Total Event Bulan Ini</span>
                <span>${currentMonthEvents.length}</span>
            </div>
            <div class="stat-item">
                <span>🌟 Event Akan Datang</span>
                <span>${Object.keys(events).filter(date => new Date(date) > new Date()).length}</span>
            </div>
        `;
    }

    function renderCalendar() {
        datesContainer.innerHTML = '';
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startingDayIndex = firstDayOfMonth.getDay();
        const totalDays = lastDayOfMonth.getDate();

        monthDisplay.textContent = `${firstDayOfMonth.toLocaleString('id-ID', { month: 'long' })} ${currentDate.getFullYear()}`;

        // Tambah sel kosong
        for (let i = 0; i < startingDayIndex; i++) {
            const emptyCell = document.createElement('div');
            datesContainer.appendChild(emptyCell);
        }

        // Render tanggal
        for (let day = 1; day <= totalDays; day++) {
            const dateCell = document.createElement('div');
            dateCell.textContent = day;
            dateCell.classList.add('date');

            const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const todayDate = new Date();
            const dateKey = currentDay.toISOString().split('T')[0];

            // Highlight hari ini
            if (currentDay.toDateString() === todayDate.toDateString()) {
                dateCell.classList.add('today');
            }

            // Tandai hari libur
            if (holidays[dateKey]) {
                dateCell.classList.add('holiday');
                dateCell.setAttribute('title', holidays[dateKey]);
            }

            // Tandai event
            if (events[dateKey]) {
                dateCell.classList.add('event-date');
                dateCell.setAttribute('title', events[dateKey].note);
            }

            dateCell.addEventListener('click', () => openEventModal(currentDay));
            datesContainer.appendChild(dateCell);
        }

        // Update statistik dan widget
        updateCalendarStats();
        fetchWeather();
        updateCountdowns();
    }

    function openEventModal(date) {
        selectedDate = date;
        const dateKey = date.toISOString().split('T')[0];
        const eventData = events[dateKey] || {};

        modalDate.textContent = date.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        modalEventNote.value = eventData.note || '';
        eventColorSelect.value = eventData.color || '#4a90e2';
        eventPrioritySelect.value = eventData.priority || 'normal';

        eventModal.style.display = 'flex';
    }

    function saveEvent() {
        const dateKey = selectedDate.toISOString().split('T')[0];
        const note = eventNoteInput.value.trim();
        const color = eventColorSelect.value;
        const priority = eventPrioritySelect.value;

        if (note) {
            events[dateKey] = { 
                note, 
                color, 
                priority,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            eventNoteInput.value = '';
            renderCalendar();
        }
    }

    function updateEvent() {
        const dateKey = selectedDate.toISOString().split('T')[0];
        const note = modalEventNote.value.trim();
        const color = eventColorSelect.value;
        const priority = eventPrioritySelect.value;

        if (note) {
            events[dateKey] = { 
                note, 
                color, 
                priority,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            eventModal.style.display = 'none';
            renderCalendar();
        }
    }

    function deleteEvent() {
        const dateKey = selectedDate.toISOString().split('T')[0];
        delete events[dateKey];
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        eventModal.style.display = 'none';
        renderCalendar();
    }

    // Event listeners
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    saveEventBtn.addEventListener('click', saveEvent);
    updateEventBtn.addEventListener('click', updateEvent);
    deleteEventBtn.addEventListener('click', deleteEvent);
    closeModalBtn.addEventListener('click', () => {
        eventModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === eventModal) {
            eventModal.style.display = 'none';
        }
    });

    renderCalendar();
});


    // Mendapatkan elemen tombol dengan id "saveEvent"
    const saveEventButton = document.getElementById("saveEvent");

    // Menambahkan event listener untuk menangani klik tombol
    saveEventButton.addEventListener("click", function() {
        // Mengarahkan ke URL yang diinginkan
        window.location.href = "https://www.example.com"; // Ganti dengan URL tujuan yang diinginkan
    });