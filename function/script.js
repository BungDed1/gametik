document.addEventListener("DOMContentLoaded", function () {

    // 1. ELEMEN DOM & NAVIGASI
    const home = document.getElementById('scr-home');
    const present = document.getElementById('scr-present');
    const stages = document.querySelectorAll('.stage-unit');
    const popLayer = document.getElementById('pop-nav-layer');

    // 2. FUNGSI MULAI & PINDAH LEVEL
    window.launchApp = function () {
        if (home) home.classList.add('d-none');
        if (present) present.classList.remove('d-none');
        navToBab(1);
    };

    window.navToBab = function (n) {
        stages.forEach(s => s.classList.add('d-none'));

        const activeBab = document.getElementById('bab-' + n);
        if (activeBab) activeBab.classList.remove('d-none');

        document.querySelectorAll('.mini-cloud').forEach(m => m.classList.remove('active'));
        const indicator = document.getElementById('st' + n);
        if (indicator) {
            indicator.classList.remove('locked');
            indicator.classList.add('active');
        }

        hidePop();
        const wrapper = document.getElementById('app-content-wrapper');
        if (wrapper) wrapper.scrollTo(0, 0);
        window.scrollTo(0, 0);
    };

    // 3. FUNGSI POPUP BERHASIL
    window.showPop = function (currentN) {
        if (!popLayer) return;
        popLayer.classList.remove('d-none');
        const nextBtn = document.getElementById('p-next');
        const prevBtn = document.getElementById('p-prev');

        if (currentN < 5) {
            nextBtn.style.display = "block";
            nextBtn.onclick = () => navToBab(currentN + 1);
        } else {
            nextBtn.style.display = "none";
        }

        if (currentN > 1) {
            prevBtn.style.display = "block";
            prevBtn.onclick = () => navToBab(currentN - 1);
        } else {
            prevBtn.style.display = "none";
        }
    };

    window.hidePop = function () {
        if (popLayer) popLayer.classList.add('d-none');
    };

    // 4. LEVEL 1 & 2: KUIS PILIHAN GANDA
    window.answerLogic = function (stage, isCorrect, btn) {
        const siblings = btn.parentElement.querySelectorAll('button');
        siblings.forEach(s => { s.disabled = true; s.style.opacity = '0.6'; });

        if (isCorrect) {
            btn.classList.add('correct-mark');
            btn.style.opacity = '1';
            setTimeout(() => showPop(stage), 1000);
        } else {
            btn.classList.add('salah');
            btn.style.opacity = '1';
            setTimeout(() => {
                siblings.forEach(s => {
                    s.disabled = false;
                    s.style.opacity = '1';
                    s.classList.remove('salah');
                });
            }, 1000);
        }
    };

    // 5. LEVEL 3: KARTU BOLAK BALIK (FLIP CARDS)
    let flipCount = 0;
    let flipTrack = { 1: false, 2: false, 3: false };
    window.flipCard = function (el, id) {
        el.classList.add('flipped');
        if (!flipTrack[id]) {
            flipTrack[id] = true;
            flipCount++;
            if (flipCount === 3) {
                setTimeout(() => showPop(3), 1500);
            }
        }
    };

    // 6. LEVEL 4: DRAG AND DROP (DIPERBAIKI)
    const pills = document.querySelectorAll('.pill-arcade');
    const hubZone = document.getElementById('hub-drop');
    const hubGrid = document.getElementById('hub-grid-success');
    let pillsIn = 0;

    if (hubZone && hubGrid) {
        pills.forEach(p => {
            p.addEventListener('dragstart', () => p.classList.add('dragging'));
            p.addEventListener('dragend', () => p.classList.remove('dragging'));
        });

        hubZone.addEventListener('dragover', e => {
            e.preventDefault();
            hubZone.style.borderColor = "var(--blue)";
            hubZone.style.backgroundColor = "#F0F9FF";
        });

        hubZone.addEventListener('dragleave', () => {
            hubZone.style.borderColor = "#CBD5E1";
            hubZone.style.backgroundColor = "#F8FAFC";
        });

        hubZone.addEventListener('drop', () => {
            const draggingPill = document.querySelector('.dragging');

            if (draggingPill && draggingPill.parentElement !== hubGrid) {

                hubGrid.classList.remove('d-none');
                document.getElementById('hub-placeholder').style.display = 'none';

                hubGrid.appendChild(draggingPill);
                pillsIn++;

                hubZone.style.borderColor = "#CBD5E1";
                hubZone.style.backgroundColor = "#F8FAFC";

                // Saat semua pilar sudah dipindah
                if (pillsIn === 5) {

                    // Sembunyikan total kotak kiri (Sumber)
                    const colSource = document.getElementById('col-source');
                    if (colSource) colSource.classList.add('d-none');

                    // Lebarkan kontainer kanan jadi full width
                    const colTarget = document.getElementById('col-target');
                    if (colTarget) {
                        colTarget.classList.remove('col-lg-8');
                        colTarget.classList.add('col-lg-12');
                    }

                    // Lebarkan zona server dan beri warna hijau sukses
                    hubZone.classList.add('full-width-center');
                    hubZone.style.borderColor = "var(--green)";
                    hubZone.style.backgroundColor = "#E6FFFA";

                    const msg = document.createElement('h3');
                    msg.className = "fw-bold text-success font-kids mt-4 animate-popIn w-100 text-center";
                    msg.innerHTML = "✅ SERVER AKTIF!";
                    hubZone.appendChild(msg);

                    setTimeout(() => showPop(4), 1500);
                }
            }
        });
    }

    // 7. LEVEL 5: KUMPULKAN BINTANG (VICTORY)
    let finalStars = 0;
    window.collectStar = function (el, id) {
        if (!el.classList.contains('active')) {
            el.classList.add('active');

            const conclusionBubble = document.getElementById(id);
            if (conclusionBubble) conclusionBubble.classList.remove('d-none');

            finalStars++;
            if (finalStars === 3) {
                setTimeout(() => {
                    const victoryScreen = document.getElementById('victory-universe');
                    if (victoryScreen) victoryScreen.classList.remove('d-none');
                    launchVictoryConfetti();
                }, 2000);
            }
        }
    };

    function launchVictoryConfetti() {
        const holder = document.getElementById('v-confetti-burst');
        if (!holder) return;

        const colors = ['#00C2FF', '#FFD700', '#00E676', '#FF7F50', '#B266FF'];

        for (let i = 0; i < 150; i++) {
            const c = document.createElement('div');
            c.className = 'confetti-unit';
            c.style.left = Math.random() * 100 + '%';
            c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            c.style.animationDuration = (Math.random() * 3 + 2) + 's';
            c.style.animationDelay = Math.random() * 1.5 + 's';
            holder.appendChild(c);
        }
    }
});