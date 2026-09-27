// --- EXACT FIREBASE CONFIGURATION WITH YOUR API KEY ---
const firebaseConfig = {
    apiKey: "AIzaSyDo_2erVoeb5Xz_dOfTUQ21C_cmOdq0cbw",
    authDomain: "kryptos-heritage.firebaseapp.com",
    projectId: "kryptos-heritage",
    storageBucket: "kryptos-heritage.firebasestorage.app",
    messagingSenderId: "472268166863",
    appId: "1:472268166863:web:bb2f91319dcc0448d189ba"
};

// Initialize Firebase App & Firestore
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

// Web3 Sci-Fi Sound Generator via Web Audio API
let soundMuted = false;
function playSciFiSound(freq = 440, duration = 0.08) {
    if (soundMuted) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

// FUNCTION TO GENERATE DYNAMIC INITIAL AVATAR (SVG DATA URI)
function generateInitialAvatar(char) {
    const upperChar = char ? char.toUpperCase() : 'U';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <rect width="64" height="64" rx="32" fill="#0d111d"/>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#00f3ff" font-family="Arial, sans-serif" font-weight="bold" font-size="32">${upperChar}</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

document.addEventListener('DOMContentLoaded', () => {

    // PREVENT RIGHT CLICK AND IMAGE DRAGGING GLOBALLY
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());

    // --- INITIALIZE VANTA FOG SILVER BACKGROUND ANIMATION ---
    if (window.VANTA && window.VANTA.FOG) {
        window.VANTA.FOG({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: 0x00f3ff,
            midtoneColor: 0x121a2d,
            lowlightColor: 0x05070e,
            baseColor: 0x080b14,
            blurFactor: 0.6,
            speed: 1.2
        });
    }

    // --- CYBERPUNK MOUSE CURSOR TRAIL FIX (SHOW ONLY ON MOUSE MOVE) ---
    const cursor = document.getElementById('cyber-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block';
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        document.addEventListener('mouseleave', () => {
            cursor.style.display = 'none';
        });
    }

    // --- SOUND TOGGLE WITH SVG ICON DYNAMIC SWITCHING ---
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            soundMuted = !soundMuted;
            if (soundMuted) {
                soundToggleBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff3366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <line x1="23" y1="9" x2="17" y2="15"></line>
                        <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                `;
            } else {
                soundToggleBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                `;
                playSciFiSound(600, 0.08);
            }
        });
    }

    // --- LIVE ETH PRICE TICKER (CoinGecko API) ---
    let currentEthUsdPrice = 2650.00;
    function fetchLiveEthPrice() {
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
            .then(res => res.json())
            .then(data => {
                if (data.ethereum && data.ethereum.usd) {
                    currentEthUsdPrice = data.ethereum.usd;
                    const ethDisplay = document.getElementById('ethPriceDisplay');
                    if (ethDisplay) ethDisplay.innerText = `$${currentEthUsdPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                }
            })
            .catch(() => {});
    }
    fetchLiveEthPrice();
    setInterval(fetchLiveEthPrice, 60000);

    // --- REALTIME LIVE USERS & FOLLOWERS LOGIC ---
    const liveUsersEl = document.getElementById('dynamicLiveUsers');
    const followersEl = document.getElementById('dynamicFollowers');
    
    function updateLiveUsers() {
        if (liveUsersEl) {
            const randomUsers = Math.floor(Math.random() * (28 - 5 + 1)) + 5;
            liveUsersEl.innerText = randomUsers;
        }
    }

    function updateFollowersDisplay() {
        if (!followersEl) return;
        let storedFollowers = parseFloat(localStorage.getItem('kh_fixed_followers'));
        if (isNaN(storedFollowers)) {
            storedFollowers = 150.4;
            localStorage.setItem('kh_fixed_followers', storedFollowers);
        }
        followersEl.innerText = storedFollowers.toFixed(1) + 'k';
    }

    window.boostFollowersOnLogin = function() {
        let storedFollowers = parseFloat(localStorage.getItem('kh_fixed_followers')) || 150.4;
        if (!localStorage.getItem('kh_user_counted')) {
            storedFollowers += 0.1;
            localStorage.setItem('kh_fixed_followers', storedFollowers);
            localStorage.setItem('kh_user_counted', 'true');
        }
        updateFollowersDisplay();
    };

    updateLiveUsers();
    updateFollowersDisplay();
    setInterval(updateLiveUsers, 15000);

    function generateUniqueRandomLikes() {
        return Math.floor(Math.random() * (199999 - 100000 + 1)) + 100000;
    }

    function formatLikes(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num;
    }

    let currentUser = null;

    const googleSignInBtn = document.getElementById('googleSignInBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    const userInfo = document.getElementById('userInfo');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');

    // EMAIL AUTH ELEMENTS
    const authEmail = document.getElementById('authEmail');
    const authPassword = document.getElementById('authPassword');
    const emailSignInBtn = document.getElementById('emailSignInBtn');
    const emailSignUpBtn = document.getElementById('emailSignUpBtn');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');

    // SEARCH & FILTER STATE
    let currentSearchQuery = "";
    let currentFilterCategory = "all";
    let currentSortOption = "newest";

    const nftSearchInput = document.getElementById('nftSearchInput');
    const nftSortSelect = document.getElementById('nftSortSelect');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (nftSearchInput) {
        nftSearchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.toLowerCase().trim();
            cachedNftHTML = ""; // Reset cache on input change
            renderContent();
        });
    }

    if (nftSortSelect) {
        nftSortSelect.addEventListener('change', (e) => {
            currentSortOption = e.target.value;
            cachedNftHTML = "";
            renderContent();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playSciFiSound(600, 0.05);
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilterCategory = btn.getAttribute('data-filter');
            cachedNftHTML = "";
            renderContent();
        });
    });

    // OPEN LOGIN MODAL
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', () => {
            playSciFiSound(500, 0.08);
            if (loginModal) loginModal.classList.remove('hidden');
        });
    }

    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => {
            if (loginModal) loginModal.classList.add('hidden');
        });
    }

    // AUTH STATE LISTENER
    auth.onAuthStateChanged((user) => {
        if (user) {
            const userDisplayName = user.displayName || user.email.split('@')[0];
            currentUser = { uid: user.uid, displayName: userDisplayName, email: user.email, photoURL: user.photoURL };
            
            if (userInfo) userInfo.classList.remove('hidden');
            if (googleSignInBtn) googleSignInBtn.classList.add('hidden');

            const initialChar = (currentUser.email || currentUser.displayName || 'U').charAt(0);
            const avatarSrc = currentUser.photoURL || generateInitialAvatar(initialChar);

            if (userAvatar) {
                userAvatar.src = avatarSrc;
                userAvatar.classList.add('neon-avatar');
            }
            if (userName) userName.innerText = currentUser.displayName;
            if (loginModal) loginModal.classList.add('hidden');
            boostFollowersOnLogin();
        } else {
            currentUser = null;
            if (userInfo) userInfo.classList.add('hidden');
            if (googleSignInBtn) googleSignInBtn.classList.remove('hidden');
            localStorage.removeItem('kh_user_counted');
            updateFollowersDisplay();
        }
        renderContent();
    });

    // LOGGED IN USER PROFILE MODAL
    const userProfileModal = document.getElementById('userProfileModal');
    const closeUserProfileModal = document.getElementById('closeUserProfileModal');

    if (userAvatar) {
        userAvatar.addEventListener('click', () => {
            if (!currentUser) return;
            playSciFiSound(700, 0.08);
            document.getElementById('modalUserName').innerText = currentUser.displayName;
            document.getElementById('modalUserEmail').innerText = currentUser.email;
            
            const initialChar = (currentUser.email || 'U').charAt(0);
            const avatarSrc = currentUser.photoURL || generateInitialAvatar(initialChar);
            document.getElementById('modalUserAvatarContainer').innerHTML = `<img src="${avatarSrc}" class="neon-avatar" style="width:60px; height:60px;">`;

            // Populate Liked NFTs
            const likedNftsList = document.getElementById('modalLikedNftsList');
            const userLikedItems = liveNFTs.filter(item => (item.likedBy || []).includes(currentUser.uid));
            
            if (userLikedItems.length === 0) {
                likedNftsList.innerHTML = `<p style="color:#aaa; font-size:0.85rem;">You haven't liked any NFTs yet.</p>`;
            } else {
                likedNftsList.innerHTML = userLikedItems.map(item => `<span class="liked-nft-chip">❤️ ${item.title}</span>`).join('');
            }

            userProfileModal.classList.remove('hidden');
        });
    }

    if (closeUserProfileModal) {
        closeUserProfileModal.addEventListener('click', () => {
            userProfileModal.classList.add('hidden');
        });
    }

    // SIGN IN / SIGN UP / FORGOT PASSWORD
    if (emailSignInBtn) {
        emailSignInBtn.addEventListener('click', () => {
            const email = authEmail.value.trim();
            const password = authPassword.value.trim();
            if (!email || !password) {
                alert('Please enter your Email and Password.');
                return;
            }
            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    playSciFiSound(800, 0.12);
                    alert('Successfully signed in!');
                    if (loginModal) loginModal.classList.add('hidden');
                })
                .catch((error) => alert('Login Error: ' + error.message));
        });
    }

    if (emailSignUpBtn) {
        emailSignUpBtn.addEventListener('click', () => {
            const email = authEmail.value.trim();
            const password = authPassword.value.trim();
            if (!email || !password) {
                alert('Please enter your Email and Password.');
                return;
            }
            auth.createUserWithEmailAndPassword(email, password)
                .then(() => {
                    playSciFiSound(900, 0.15);
                    alert('Account created successfully!');
                    if (loginModal) loginModal.classList.add('hidden');
                })
                .catch((error) => alert('Registration Error: ' + error.message));
        });
    }

    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', () => {
            const email = authEmail.value.trim();
            if (!email) {
                alert('Please enter your Email address and click "Forgot Password?".');
                return;
            }
            auth.sendPasswordResetEmail(email)
                .then(() => alert('Password reset link has been sent to your email. Please check your Inbox/Spam folder.'))
                .catch((error) => alert('Error: ' + error.message));
        });
    }

    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => auth.signOut());
    }

    let liveNFTs = [];
    let liveCollectors = [];
    let cachedNftHTML = "";
    let cachedCollectorHTML = "";

    function listenToData() {
        db.collection("nfts").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
            liveNFTs = [];
            snapshot.forEach((doc) => {
                let data = doc.data();
                if (!data.baseLikes) {
                    data.baseLikes = generateUniqueRandomLikes();
                    db.collection("nfts").doc(doc.id).update({ baseLikes: data.baseLikes });
                }
                liveNFTs.push({ id: doc.id, ...data });
            });
            cachedNftHTML = "";
            renderContent();
        }, (error) => console.log("Error loading NFTs:", error));

        db.collection("collectors").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
            liveCollectors = [];
            snapshot.forEach((doc) => liveCollectors.push({ id: doc.id, ...doc.data() }));
            cachedCollectorHTML = "";
            renderContent();
        }, (error) => console.log("Error loading Collectors:", error));

        db.collection("settings").doc("profile").onSnapshot((doc) => {
            if (doc.exists && doc.data().photoUrl) {
                const p = document.getElementById('profileImage');
                if (p) p.src = doc.data().photoUrl;
            }
        });
    }

    listenToData();

    function renderContent() {
        const nftGrid = document.getElementById('nftGrid');
        const collectorList = document.getElementById('collectorList');

        if (nftGrid) {
            // Apply Search & Filter
            let filteredNFTs = liveNFTs.filter(item => {
                const matchesSearch = item.title.toLowerCase().includes(currentSearchQuery) || (item.story && item.story.toLowerCase().includes(currentSearchQuery));
                const matchesCategory = currentFilterCategory === "all" || item.status === currentFilterCategory;
                return matchesSearch && matchesCategory;
            });

            // Apply Sorting
            if (currentSortOption === "popular") {
                filteredNFTs.sort((a, b) => ((b.baseLikes || 0) + (b.likedBy || []).length) - ((a.baseLikes || 0) + (a.likedBy || []).length));
            } else if (currentSortOption === "title") {
                filteredNFTs.sort((a, b) => a.title.localeCompare(b.title));
            }

            if (filteredNFTs.length === 0) {
                cachedNftHTML = "";
                nftGrid.innerHTML = `<p style="color:#888; grid-column: 1/-1; text-align:center; padding: 40px; font-size: 1rem;">No NFT creations matching your criteria.</p>`;
            } else {
                const newNftHTML = filteredNFTs.map((item, idx) => {
                    const isLongStory = item.story && item.story.length > 100;
                    const truncatedText = isLongStory ? item.story.substring(0, 100) + '...' : (item.story || '');
                    const likedByArray = item.likedBy || [];
                    const isLiked = currentUser ? likedByArray.includes(currentUser.uid) : false;
                    const base = item.baseLikes || 125000;
                    const totalLikes = base + (likedByArray.length);

                    return `
                        <div class="nft-card glassmorphism" onmousemove="handleCardTilt(event, this)" onmouseleave="resetCardTilt(this)">
                            <div class="nft-img-wrapper" onclick="openPreview('${item.img}', '${item.title}')">
                                <img src="${item.img}" alt="${item.title}" onerror="this.src='profile 1.jpg'">
                                <span class="card-watermark">KH ©</span>
                            </div>
                            <h3>${item.title}</h3>
                            <div class="nft-desc-wrapper">
                                <span id="desc-${idx}">${truncatedText}</span>
                                ${isLongStory ? `<button class="read-more-btn" id="btn-${idx}" onclick="toggleReadMore(${idx}, '${encodeURIComponent(item.story)}')">More</button>` : ''}
                            </div>
                            <div class="card-footer-action">
                                <span class="badge ${item.status === 'Available' ? 'badge-available' : 'badge-sold'}">${item.status}</span>
                                <div style="display:flex; gap: 6px; align-items:center;">
                                    <button class="outline-like-btn ${isLiked ? 'liked' : ''}" onclick="handleLike('${item.id}')">
                                        <svg class="heart-icon" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                        <span>${formatLikes(totalLikes)}</span>
                                    </button>
                                    <button onclick="shareNft('${item.title}')" style="background:transparent; border:none; color:#00f3ff; cursor:pointer;" title="Share NFT">🔗</button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                if (newNftHTML !== cachedNftHTML) {
                    cachedNftHTML = newNftHTML;
                    nftGrid.innerHTML = newNftHTML;
                }
            }
        }

        if (collectorList) {
            if (liveCollectors.length === 0) {
                collectorList.innerHTML = `<p style="color:#888; padding: 10px;">No collectors listed yet.</p>`;
            } else {
                const newCollectorHTML = liveCollectors.map(item => {
                    const ethVal = parseFloat(item.eth) || 0;
                    const usdVal = ethVal > 0 ? (ethVal * currentEthUsdPrice).toLocaleString('en-US', { maximumFractionDigits: 0 }) : null;
                    const usdText = usdVal ? ` ≈ $${usdVal} USD` : '';

                    return `
                        <div class="collector-card glassmorphism">
                            <span>💎</span>
                            <span><strong>${item.name}</strong> bought <em>${item.itemBought || 'NFT'}</em></span>
                            <span style="color:#00ff66;" title="${usdText}">(${item.eth}${usdText ? ' • ' + usdText : ''})</span>
                        </div>
                    `;
                }).join('');

                if (newCollectorHTML !== cachedCollectorHTML) {
                    cachedCollectorHTML = newCollectorHTML;
                    collectorList.innerHTML = newCollectorHTML;
                }
            }
        }

        renderAdminLists(liveNFTs, liveCollectors);
    }

    // 3D CARD TILT EFFECT
    window.handleCardTilt = function(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) scale(1.02)`;
    };

    window.resetCardTilt = function(card) {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    };

    // CLEAN SOCIAL SHARE (PREVENTS 404 ERRORS)
    window.shareNft = function(title) {
        playSciFiSound(750, 0.08);
        const cleanUrl = window.location.origin + window.location.pathname;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(cleanUrl);
            alert(`Share link for "${title}" copied to clipboard!\n\n${cleanUrl}`);
        }
    };

    // INTERACTIVE ZOOM IN PREVIEW MODAL
    let zoomLevel = 1;
    const previewModalImg = document.getElementById('previewModalImg');

    window.openPreview = function(imgSrc, title) {
        playSciFiSound(650, 0.08);
        const modal = document.getElementById('imagePreviewModal');
        if (modal) {
            zoomLevel = 1;
            if (previewModalImg) previewModalImg.style.transform = `scale(1)`;
            document.getElementById('previewModalImg').src = imgSrc;
            document.getElementById('previewModalTitle').innerText = title;
            modal.classList.remove('hidden');
        }
    };

    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (zoomLevel < 3) zoomLevel += 0.3;
            if (previewModalImg) previewModalImg.style.transform = `scale(${zoomLevel})`;
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (zoomLevel > 0.8) zoomLevel -= 0.3;
            if (previewModalImg) previewModalImg.style.transform = `scale(${zoomLevel})`;
        });
    }

    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', () => {
            zoomLevel = 1;
            if (previewModalImg) previewModalImg.style.transform = `scale(1)`;
        });
    }

    const closePreviewBtn = document.getElementById('closePreview');
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', () => {
            const previewModal = document.getElementById('imagePreviewModal');
            if (previewModal) previewModal.classList.add('hidden');
        });
    }

    window.handleLike = function(docId) {
        if (!currentUser) {
            if (loginModal) loginModal.classList.remove('hidden');
            return;
        }

        playSciFiSound(850, 0.1);
        const nftRef = db.collection("nfts").doc(docId);
        nftRef.get().then((doc) => {
            if (doc.exists) {
                let likedBy = doc.data().likedBy || [];
                if (likedBy.includes(currentUser.uid)) {
                    likedBy = likedBy.filter(uid => uid !== currentUser.uid);
                } else {
                    likedBy.push(currentUser.uid);
                }
                nftRef.update({ likedBy: likedBy });
            }
        });
    };

    window.toggleReadMore = function(idx, fullStoryEncoded) {
        const fullStory = decodeURIComponent(fullStoryEncoded);
        const descElement = document.getElementById(`desc-${idx}`);
        const btnElement = document.getElementById(`btn-${idx}`);

        if (btnElement.innerText === 'More') {
            descElement.innerText = fullStory;
            btnElement.innerText = 'Less';
        } else {
            descElement.innerText = fullStory.substring(0, 100) + '...';
            btnElement.innerText = 'More';
        }
    };

    function renderAdminLists(nfts, collectors) {
        const adminNftList = document.getElementById('adminNftList');
        const adminCollectorList = document.getElementById('adminCollectorList');

        if (adminNftList) {
            adminNftList.innerHTML = nfts.map((item) => `
                <div class="admin-item-row">
                    <div class="admin-item-info">
                        <span class="admin-item-title">${item.title}</span>
                        <span style="font-size:0.75rem; color:${item.status === 'Available' ? '#00ff66' : '#ff3333'};">${item.status}</span>
                    </div>
                    <div class="admin-item-actions">
                        <button class="action-btn btn-toggle" onclick="toggleNftStatus('${item.id}', '${item.status}')">Toggle Status</button>
                        <button class="action-btn btn-delete" onclick="deleteNft('${item.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        if (adminCollectorList) {
            adminCollectorList.innerHTML = collectors.map((item) => `
                <div class="admin-item-row">
                    <div class="admin-item-info">
                        <span class="admin-item-title">${item.name} (${item.itemBought || 'N/A'})</span>
                        <span style="font-size:0.75rem; color:#aaa;">${item.eth}</span>
                    </div>
                    <div class="admin-item-actions">
                        <button class="action-btn btn-delete" onclick="deleteCollector('${item.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    }

    window.toggleNftStatus = function(docId, currentStatus) {
        db.collection("nfts").doc(docId).update({ status: currentStatus === 'Available' ? 'Sold Out' : 'Available' });
    };

    window.deleteNft = function(docId) {
        if (confirm('Delete NFT from cloud?')) {
            db.collection("nfts").doc(docId).delete();
        }
    };

    window.deleteCollector = function(docId) {
        if (confirm('Delete Collector from cloud?')) {
            db.collection("collectors").doc(docId).delete();
        }
    };

    const adminLockBtn = document.getElementById('adminLockBtn');
    const adminPanel = document.getElementById('adminPanel');
    const closeAdmin = document.getElementById('closeAdmin');

    if (adminLockBtn && adminPanel) {
        adminLockBtn.addEventListener('click', () => {
            const password = prompt('Enter Admin Password:');
            if (password === 'Vajini2001#') adminPanel.classList.remove('hidden');
            else if (password !== null) alert('Incorrect Password!');
        });
    }

    if (closeAdmin && adminPanel) {
        closeAdmin.addEventListener('click', () => adminPanel.classList.add('hidden'));
    }

    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const newUrl = document.getElementById('adminProfileInput').value.trim();
            if (newUrl) {
                db.collection("settings").doc("profile").set({ photoUrl: newUrl });
                alert('Profile Picture Saved to Cloud!');
            }
        });
    }

    const addNftBtn = document.getElementById('addNftBtn');
    if (addNftBtn) {
        addNftBtn.addEventListener('click', () => {
            const title = document.getElementById('nftTitle').value.trim();
            const img = document.getElementById('nftImage').value.trim();
            const story = document.getElementById('nftStory').value.trim();
            const status = document.getElementById('nftStatus').value;

            if (title && img && story) {
                db.collection("nfts").add({
                    title, img, story, status,
                    baseLikes: generateUniqueRandomLikes(),
                    likedBy: [],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    alert('NFT Added to Cloud Successfully!');
                    document.getElementById('nftTitle').value = '';
                    document.getElementById('nftImage').value = '';
                    document.getElementById('nftStory').value = '';
                });
            } else {
                alert('Please fill all fields!');
            }
        });
    }

    const addCollectorBtn = document.getElementById('addCollectorBtn');
    if (addCollectorBtn) {
        addCollectorBtn.addEventListener('click', () => {
            const name = document.getElementById('collectorName').value.trim();
            const eth = document.getElementById('collectorEth').value.trim();
            const itemBought = document.getElementById('collectorItem').value.trim();

            if (name && eth && itemBought) {
                db.collection("collectors").add({
                    name, eth, itemBought,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    alert('Collector Added to Cloud Successfully!');
                    document.getElementById('collectorName').value = '';
                    document.getElementById('collectorEth').value = '';
                    document.getElementById('collectorItem').value = '';
                });
            } else {
                alert('Please fill all fields!');
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! Message recorded.');
            contactForm.reset();
        });
    }
});
