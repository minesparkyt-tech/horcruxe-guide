/* ==========================================================================
   THE DEATHLY HALLOWS PROTOCOL — INTERACTIVE APPLICATION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. AMBIENT MAGICAL PARTICLE CANVAS
       ---------------------------------------------------------------------- */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.6 + 0.2;
            
            // Random color palette (Purple, Gold, Crimson)
            const colors = ['168, 85, 247', '251, 191, 36', '239, 68, 68', '16, 185, 129'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            if (this.y < -10) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    /* ----------------------------------------------------------------------
       2. NAVIGATION & MOBILE DRAWER
       ---------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }


    /* ----------------------------------------------------------------------
       3. INTERACTIVE DEATHLY HALLOWS SVG SYMBOL
       ---------------------------------------------------------------------- */
    const symCloak = document.getElementById('sym-cloak');
    const symStone = document.getElementById('sym-stone');
    const symSword = document.getElementById('sym-sword');

    const symbolTargets = {
        'cloak': document.getElementById('card-cloak'),
        'stone': document.getElementById('card-stone'),
        'sword': document.getElementById('card-sword')
    };

    function scrollToElement(el) {
        if (el) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Flash card highlight effect
            el.style.boxShadow = '0 0 30px var(--purple-glow)';
            setTimeout(() => {
                el.style.boxShadow = '';
            }, 1500);
        }
    }

    if (symCloak) symCloak.addEventListener('click', () => scrollToElement(symbolTargets.cloak));
    if (symStone) symStone.addEventListener('click', () => scrollToElement(symbolTargets.stone));
    if (symSword) symSword.addEventListener('click', () => scrollToElement(symbolTargets.sword));

    document.querySelectorAll('.symbol-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetKey = e.currentTarget.getAttribute('data-target');
            scrollToElement(symbolTargets[targetKey]);
        });
    });


    /* ----------------------------------------------------------------------
       4. ELDER SWORD COOLDOWN SIMULATOR (60s)
       ---------------------------------------------------------------------- */
    const btnTestSword = document.getElementById('btn-test-sword');
    const swordDisplay = document.getElementById('sword-cooldown-display');
    let swordTimer = null;

    if (btnTestSword && swordDisplay) {
        btnTestSword.addEventListener('click', () => {
            if (swordTimer) return;

            let secondsLeft = 60;
            btnTestSword.disabled = true;
            btnTestSword.style.opacity = '0.6';

            swordDisplay.innerHTML = `<span class="cd-active">⚡ One-Hit Kill Triggered! Cooldown: ${secondsLeft}s</span>`;

            swordTimer = setInterval(() => {
                secondsLeft--;
                if (secondsLeft > 0) {
                    swordDisplay.innerHTML = `<span class="cd-active">⏳ Sword Cooldown Active: ${secondsLeft}s</span>`;
                } else {
                    clearInterval(swordTimer);
                    swordTimer = null;
                    btnTestSword.disabled = false;
                    btnTestSword.style.opacity = '1';
                    swordDisplay.innerHTML = `<span class="cd-status">Status: Ready to Swing</span>`;
                }
            }, 1000);
        });
    }


    /* ----------------------------------------------------------------------
       5. INVISIBILITY CLOAK ARMOR SLOT CHECKER
       ---------------------------------------------------------------------- */
    const slotHelmet = document.getElementById('slot-helmet');
    const slotChest = document.getElementById('slot-chest');
    const slotLegs = document.getElementById('slot-legs');
    const slotBoots = document.getElementById('slot-boots');
    const cloakStatus = document.getElementById('cloak-status');

    function checkCloakEligibility() {
        if (!cloakStatus) return;

        const isChestWorn = slotChest ? slotChest.checked : false;
        const otherArmorWorn = (slotHelmet && slotHelmet.checked) ||
                               (slotLegs && slotLegs.checked) ||
                               (slotBoots && slotBoots.checked);

        if (isChestWorn && !otherArmorWorn) {
            cloakStatus.className = 'cloak-status-box green-status';
            cloakStatus.innerHTML = '✨ Invisibility Active! (Chest equipped, all other slots empty)';
        } else if (!isChestWorn) {
            cloakStatus.className = 'cloak-status-box red-status';
            cloakStatus.innerHTML = '❌ Cloak Not Equipped (Chest slot empty)';
        } else {
            cloakStatus.className = 'cloak-status-box red-status';
            cloakStatus.innerHTML = '⚠️ Invisibility Voided! (Armor detected in helmet/legs/boots)';
        }
    }

    [slotHelmet, slotChest, slotLegs, slotBoots].forEach(slot => {
        if (slot) slot.addEventListener('change', checkCloakEligibility);
    });


    /* ----------------------------------------------------------------------
       6. RESURRECTION STONE SAVE SIMULATOR (20s Cooldown)
       ---------------------------------------------------------------------- */
    const btnTestStone = document.getElementById('btn-test-stone');
    const stoneInHand = document.getElementById('stone-in-hand');
    const stoneChatOutput = document.getElementById('stone-chat-output');
    let stoneTimer = null;

    if (btnTestStone && stoneChatOutput) {
        btnTestStone.addEventListener('click', () => {
            if (stoneTimer) return;

            const isHeld = stoneInHand ? stoneInHand.checked : false;

            if (isHeld) {
                let secondsLeft = 20;
                btnTestStone.disabled = true;
                btnTestStone.style.opacity = '0.6';

                stoneChatOutput.innerHTML = `<span class="chat-saved">[Server] Player was saved from death by the Resurrection Stone!</span>`;

                stoneTimer = setInterval(() => {
                    secondsLeft--;
                    if (secondsLeft > 0) {
                        stoneChatOutput.innerHTML = `<span class="chat-saved">[Server] Saved! Stone Recharging (${secondsLeft}s)</span>`;
                    } else {
                        clearInterval(stoneTimer);
                        stoneTimer = null;
                        btnTestStone.disabled = false;
                        btnTestStone.style.opacity = '1';
                        stoneChatOutput.innerHTML = `<span class="chat-muted">[Server] Resurrection Stone ready in hand</span>`;
                    }
                }, 1000);
            } else {
                stoneChatOutput.innerHTML = `<span class="chat-dead">[Server] Player was slain! (Stone was not held in main hand)</span>`;
            }
        });
    }


    /* ----------------------------------------------------------------------
       7. COMPASS RADAR SIMULATOR (10s Scan + 30s Cooldown)
       ---------------------------------------------------------------------- */
    const btnUseCompass = document.getElementById('btn-use-compass');
    const compassNeedle = document.getElementById('compass-needle');
    const radarSweep = document.getElementById('radar-sweep');
    const artifactPing = document.getElementById('artifact-ping');
    const activeWinVal = document.getElementById('active-window-val');
    const cooldownVal = document.getElementById('cooldown-val');
    const compassStatusText = document.getElementById('compass-status-text');

    let compassState = 'idle'; // 'idle', 'active', 'cooldown'

    if (btnUseCompass && compassNeedle && radarSweep) {
        btnUseCompass.addEventListener('click', () => {
            if (compassState !== 'idle') return;

            compassState = 'active';
            btnUseCompass.disabled = true;
            btnUseCompass.style.opacity = '0.6';

            // Start radar sweep
            radarSweep.classList.add('scanning');
            
            // Random needle angle (pointing towards artifact)
            const randomAngle = Math.floor(Math.random() * 240) - 120;
            compassNeedle.style.transform = `rotate(${randomAngle}deg)`;

            // Position artifact ping on radar
            if (artifactPing) {
                artifactPing.classList.add('active');
                artifactPing.style.top = '35px';
                artifactPing.style.right = '45px';
            }

            let activeLeft = 10;
            compassStatusText.innerHTML = `📡 Active Tracking Window: ${activeLeft}s`;
            compassStatusText.style.color = 'var(--purple-primary)';

            const activeInterval = setInterval(() => {
                activeLeft--;
                if (activeLeft > 0) {
                    activeWinVal.innerText = `${activeLeft} Seconds`;
                    compassStatusText.innerHTML = `📡 Active Tracking Window: ${activeLeft}s`;
                } else {
                    clearInterval(activeInterval);
                    activeWinVal.innerText = `0 Seconds (Expired)`;
                    
                    // Transition to Cooldown State
                    compassState = 'cooldown';
                    radarSweep.classList.remove('scanning');
                    if (artifactPing) artifactPing.classList.remove('active');
                    compassNeedle.style.transform = `rotate(0deg)`;

                    let cdLeft = 30;
                    compassStatusText.innerHTML = `⏳ Cooldown Recharge: ${cdLeft}s`;
                    compassStatusText.style.color = 'var(--red-primary)';

                    const cdInterval = setInterval(() => {
                        cdLeft--;
                        if (cdLeft > 0) {
                            cooldownVal.innerText = `${cdLeft} Seconds`;
                            compassStatusText.innerHTML = `⏳ Cooldown Recharge: ${cdLeft}s`;
                        } else {
                            clearInterval(cdInterval);
                            compassState = 'idle';
                            btnUseCompass.disabled = false;
                            btnUseCompass.style.opacity = '1';
                            activeWinVal.innerText = `10 Seconds`;
                            cooldownVal.innerText = `30 Seconds`;
                            compassStatusText.innerHTML = `Idle — Ready to Use`;
                            compassStatusText.style.color = 'var(--text-muted)';
                        }
                    }, 1000);
                }
            }, 1000);
        });
    }


    /* ----------------------------------------------------------------------
       8. HORCRUX RISK & OUTCOME CALCULATOR
       ---------------------------------------------------------------------- */
    const inputPlaytime = document.getElementById('calc-playtime');
    const inputCarried = document.getElementById('calc-carried');
    const inputCarryTime = document.getElementById('calc-carry-time');
    const inputPlaced = document.getElementById('calc-placed');

    const outcomeTitle = document.getElementById('outcome-title');
    const outcomeDesc = document.getElementById('outcome-desc');
    const autoPlaceTimer = document.getElementById('auto-place-timer');
    const qualifyingStatus = document.getElementById('qualifying-status');
    const btnSimulateDeath = document.getElementById('btn-simulate-death');

    function updateCalculator() {
        if (!inputPlaytime) return;

        const playtime = parseInt(inputPlaytime.value) || 0;
        const carried = parseInt(inputCarried.value) || 0;
        const carryTime = parseInt(inputCarryTime.value) || 0;
        const placed = parseInt(inputPlaced.value) || 0;

        // Qualifying kill status
        if (playtime >= 30) {
            qualifyingStatus.innerText = 'YES (Playtime ≥ 30m)';
            qualifyingStatus.className = 'text-green';
        } else {
            qualifyingStatus.innerText = 'NO (Playtime < 30m)';
            qualifyingStatus.className = 'text-red';
        }

        // Auto-place timer
        if (carried > 0) {
            const timeRemaining = 30 - carryTime;
            if (timeRemaining <= 0) {
                autoPlaceTimer.innerText = 'AUTO-PLACED AT FEET!';
                autoPlaceTimer.className = 'text-red';
            } else {
                autoPlaceTimer.innerText = `${timeRemaining} mins remaining`;
                autoPlaceTimer.className = 'text-green';
            }
        } else {
            autoPlaceTimer.innerText = 'N/A (No carried Horcrux)';
            autoPlaceTimer.className = '';
        }

        // Protection status
        if (placed >= 1) {
            outcomeTitle.innerText = 'SAFE & PROTECTED';
            outcomeTitle.style.color = 'var(--green-primary)';
            outcomeDesc.innerText = `You have ${placed} placed Horcrux block(s) active in the world. Death will not result in a ban or inventory wipe.`;
        } else {
            outcomeTitle.innerText = 'UNPROTECTED & HIGH RISK';
            outcomeTitle.style.color = 'var(--red-primary)';
            outcomeDesc.innerText = `You have 0 placed Horcrux blocks! Dying now results in a 3-day ban and complete wipe of inventory, armor, ender chest, and XP.`;
        }
    }

    [inputPlaytime, inputCarried, inputCarryTime, inputPlaced].forEach(input => {
        if (input) input.addEventListener('input', updateCalculator);
    });
    updateCalculator();


    /* ----------------------------------------------------------------------
       9. DEATH MODAL SIMULATION (7s Smoke vs 3-Day Ban Notice)
       ---------------------------------------------------------------------- */
    const deathModal = document.getElementById('death-modal');
    const modalContentBox = document.getElementById('modal-content-box');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    if (btnSimulateDeath && deathModal && modalBody) {
        btnSimulateDeath.addEventListener('click', () => {
            const placed = parseInt(inputPlaced.value) || 0;

            deathModal.classList.add('active');

            if (placed >= 1) {
                // Safe Respawn Simulation (7s dark smoke visual effect)
                modalContentBox.style.borderColor = 'var(--green-primary)';
                modalBody.innerHTML = `
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">💨</div>
                    <h2 style="color: var(--green-primary); margin-bottom: 0.5rem;">HORCRUX PROTECTION ACTIVE</h2>
                    <p style="margin-bottom: 1rem;">You died, but your placed Horcrux absorbed the penalty!</p>
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid var(--green-primary); margin-bottom: 1rem;">
                        <strong>Visual Effect Playing:</strong> 7-second cosmetic dark smoke effect (visual only). No items or XP lost.
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Horcrux Charge Count: Untouched</p>
                `;
            } else {
                // 3-Day Ban Simulation
                modalContentBox.style.borderColor = 'var(--red-primary)';
                modalBody.innerHTML = `
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">☠️</div>
                    <h2 style="color: var(--red-primary); margin-bottom: 0.5rem;">YOU HAVE BEEN BANNED</h2>
                    <p style="margin-bottom: 1rem;">Reason: Died with <strong>0 placed Horcruxes</strong>.</p>
                    <div style="background: rgba(239, 68, 68, 0.15); padding: 1rem; border-radius: 8px; border: 1px solid var(--red-primary); margin-bottom: 1rem; text-align: left; font-size: 0.9rem;">
                        <div style="font-weight: 700; color: #fca5a5; margin-bottom: 0.5rem;">Wipe Consequences Executed:</div>
                        • Duration: 3-Day Temporary Server Ban<br>
                        • Inventory Wiped: 100% Cleared<br>
                        • Armor Slots: Cleared<br>
                        • Ender Chest: Cleared<br>
                        • Experience Points: Reduced to 0
                    </div>
                `;
            }
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                deathModal.classList.remove('active');
            });
        }

        deathModal.addEventListener('click', (e) => {
            if (e.target === deathModal) {
                deathModal.classList.remove('active');
            }
        });
    }


    /* ----------------------------------------------------------------------
       10. 1-CLICK COPY COMMANDS WITH TOAST POPUP
       ---------------------------------------------------------------------- */
    const toastMsg = document.getElementById('toast-msg');

    function showToast(text) {
        if (!toastMsg) return;
        toastMsg.innerText = text;
        toastMsg.classList.add('show');
        setTimeout(() => {
            toastMsg.classList.remove('show');
        }, 2500);
    }

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cmd = e.currentTarget.getAttribute('data-cmd');
            if (cmd) {
                navigator.clipboard.writeText(cmd).then(() => {
                    showToast(`Copied ${cmd} to clipboard!`);
                }).catch(() => {
                    showToast(`Copied ${cmd}`);
                });
            }
        });
    });

});
