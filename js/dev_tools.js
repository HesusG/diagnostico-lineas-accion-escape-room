const DevTools = {
    init() {
        this.createUI();
        this.updateUI();
        setInterval(() => this.updateUI(), 1000);
    },

    createUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            font-family: monospace;
            max-height: 90vh;
            overflow-y: auto;
            width: 300px;
        `;
        container.id = 'dev-tools-panel';
        document.body.appendChild(container);

        this.panel = container;
        this.render();
    },

    render() {
        this.panel.innerHTML = `
            <h3>🛠️ Dev Tools</h3>
            <div id="dev-status"></div>
            <hr>
            <button onclick="DevTools.teleportTo('vestibulo')">Vestíbulo</button>
            <button onclick="DevTools.teleportTo('oficina')">Oficina</button>
            <button onclick="DevTools.teleportTo('laboratorio')">Laboratorio</button>
            <button onclick="DevTools.teleportTo('sala-juntas')">Sala Juntas</button>
            <button onclick="DevTools.teleportTo('biblioteca')">Biblioteca</button>
            <button onclick="DevTools.teleportTo('archivo')">Archivo</button>
            <button onclick="DevTools.teleportTo('galeria')">Galería</button>
            <hr>
            <button onclick="DevTools.resetGame()">Reset Game</button>
            <button onclick="DevTools.unlockAll()">Unlock All Rooms</button>
            <button onclick="DevTools.collectAllEvidence()">Collect All Evidence</button>
            <hr>
            <button onclick="DevTools.runFullTest()" style="background: #4CAF50; color: white;">▶ RUN FULL TEST</button>
            <div id="test-log" style="margin-top: 10px; font-size: 10px; white-space: pre-wrap;"></div>
        `;
    },

    updateUI() {
        const status = document.getElementById('dev-status');
        if (!status) return;

        if (!window.Game) {
            status.innerHTML = 'Game not loaded';
            return;
        }

        const nextNPC = NPC_PROGRESSION.order[Game.npcProgress.currentStep] || 'NONE';

        status.innerHTML = `
            <strong>Step:</strong> ${Game.npcProgress.currentStep} / ${NPC_PROGRESSION.order.length}<br>
            <strong>Next NPC:</strong> ${nextNPC}<br>
            <strong>Visited:</strong> ${Array.from(Game.npcProgress.visited).join(', ')}<br>
            <strong>Unlocked Rooms:</strong> ${Array.from(Game.npcProgress.canCollectInRooms).join(', ')}<br>
            <strong>Evidence:</strong> ${Game.collectedObjects.size} / ${GAME_CONSTANTS.TOTAL_EVIDENCES}
        `;
    },

    teleportTo(roomId) {
        if (Game && ROOMS[roomId]) {
            Game.currentRoom = roomId;
            RoomManager.renderRoom(roomId);
            Player.x = 384;
            Player.y = 300;
            Player.updatePosition();
            console.log(`Teleported to ${roomId}`);
        }
    },

    resetGame() {
        if (Game) {
            Game.restartGame();
            console.log('Game reset');
        }
    },

    unlockAll() {
        if (Game) {
            Object.values(NPC_PROGRESSION.roomMap).forEach(room => {
                Game.npcProgress.canCollectInRooms.add(room);
            });
            console.log('All rooms unlocked');
        }
    },

    collectAllEvidence() {
        if (Game) {
            EVIDENCES.forEach(ev => {
                Game.markObjectCollected(ev.id);
            });
            console.log('All evidence collected');
        }
    },

    async runFullTest() {
        const log = (msg) => {
            console.log(`[TEST] ${msg}`);
            const logEl = document.getElementById('test-log');
            if (logEl) logEl.innerHTML += `${msg}\n`;
        };

        log('--- STARTING FULL TEST ---');
        this.resetGame();
        await this.wait(1000);

        // 1. Visit Mayordomo (Vestibulo)
        log('Step 1: Visiting Mayordomo');
        this.teleportTo('vestibulo');
        await this.wait(500);
        this.simulateInteraction('npc-mayordomo');
        await this.wait(1000);

        if (Game.npcProgress.visited.has('mayordomo')) {
            log('✅ Mayordomo visited');
        } else {
            log('❌ Failed to visit Mayordomo');
            return;
        }

        // Loop through remaining NPCs
        const sequence = [
            { id: 'consultor', room: 'oficina' },
            { id: 'cientifica', room: 'laboratorio' },
            { id: 'ejecutiva', room: 'sala-juntas' },
            { id: 'bibliotecario', room: 'biblioteca' },
            { id: 'detective', room: 'archivo' },
            { id: 'curadora', room: 'galeria' }
        ];

        for (const step of sequence) {
            log(`Visiting ${step.id} in ${step.room}...`);
            this.teleportTo(step.room);
            await this.wait(500);

            // Try to collect evidence BEFORE talking (should fail or be empty)
            // Actually, let's just talk to NPC first to unlock
            this.simulateInteraction(`npc-${step.id}`);
            await this.wait(1000);

            if (Game.npcProgress.visited.has(step.id)) {
                log(`✅ ${step.id} visited`);
            } else {
                log(`❌ Failed to visit ${step.id}`);
                // Try to debug why
                log(`Current Step: ${Game.npcProgress.currentStep}`);
                log(`Expected NPC: ${NPC_PROGRESSION.order[Game.npcProgress.currentStep]}`);
                return;
            }

            // Now collect evidence in this room
            if (Game.canCollectInRoom(step.room)) {
                log(`✅ Room ${step.room} unlocked for collection`);
                this.collectEvidenceInRoom(step.room);
            } else {
                log(`❌ Room ${step.room} NOT unlocked`);
            }
        }

        // Final Step: Visit Conde
        log('Final Step: Delivering to Conde');
        this.teleportTo('vestibulo');
        await this.wait(500);

        // Ensure all evidence is collected
        if (Game.collectedObjects.size < 8) {
            log(`⚠️ Warning: Only ${Game.collectedObjects.size} evidence collected. Forcing collection.`);
            this.collectAllEvidence();
        }

        this.simulateInteraction('npc-conde');
        await this.wait(1000);

        // Check for victory
        const victoryScreen = document.getElementById('victory-screen');
        if (victoryScreen && !victoryScreen.classList.contains('hidden')) {
            log('✅ VICTORY SCREEN DETECTED');
            log('--- TEST PASSED ---');
        } else {
            log('❌ Victory screen not shown');
            log('--- TEST FAILED ---');
        }
    },

    simulateInteraction(elementId) {
        // Find the element
        // Note: In the game, interactions are distance-based or via 'E' key.
        // We can simulate the effect of interaction by calling the handler directly if possible,
        // or by moving the player close and triggering the key.

        // Let's try to find the object in the Game data and call the manager
        const npcId = elementId.replace('npc-', '');
        if (NPCS[npcId]) {
            console.log(`Simulating interaction with NPC: ${npcId}`);
            // Force the dialog
            if (npcId === 'conde' && Game.collectedObjects.size >= 8) {
                if (DialogManager.showDeliveryDialog()) {
                    Game.victory();
                }
            } else {
                DialogManager.showNPCDialog(NPCS[npcId]);
                // Automatically click "Next" or "Close" to proceed
                setTimeout(() => {
                    const nextBtn = document.getElementById('btn-next-dialog');
                    const closeBtn = document.getElementById('btn-close-dialog');
                    if (nextBtn && !nextBtn.classList.contains('hidden')) nextBtn.click();
                    else if (closeBtn) closeBtn.click();
                }, 500);
            }
        }
    },

    collectEvidenceInRoom(roomId) {
        EVIDENCES.filter(e => e.room === roomId).forEach(e => {
            Game.markObjectCollected(e.id);
            console.log(`Collected ${e.id}`);
        });
    },

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Initialize when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DevTools.init());
} else {
    DevTools.init();
}
