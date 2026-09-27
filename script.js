// --- EXACT FIREBASE CONFIGURATION WITH NEW API KEY ---
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

document.addEventListener('DOMContentLoaded', () => {

    // PREVENT RIGHT CLICK AND IMAGE DRAGGING GLOBALLY
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());

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

    // OPEN LOGIN MODAL ON HEADER BUTTON CLICK
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', () => {
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
            if (userAvatar) userAvatar.src = currentUser.photoURL || 'profile 1.jpg';
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

    // 1. SIGN IN WITH EMAIL & PASSWORD
    if (emailSignInBtn) {
        emailSignInBtn.addEventListener('click', () => {
            const email = authEmail.value.trim();
            const password = authPassword.value.trim();

            if (!email || !password) {
                alert('කරුණාකර Email සහ Password ඇතුළත් කරන්න.');
                return;
            }

            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    alert('සාර්ථකව ඇතුළු විය!');
                    if (loginModal) loginModal.classList.add('hidden');
                })
                .catch((error) => {
                    alert('Login Error: ' + error.message);
                });
        });
    }

    // 2. CREATE NEW ACCOUNT (SIGN UP)
    if (emailSignUpBtn) {
        emailSignUpBtn.addEventListener('click', () => {
            const email = authEmail.value.trim();
            const password = authPassword.value.trim();

            if (!email || !password) {
                alert('කරුණාකර Email සහ Password ඇතුළත් කරන්න.');
                return;
            }

            auth.createUserWithEmailAndPassword(email, password)
                .then(() => {
                    alert('ගිණුම සාර්ථකව සාදන ලදී!');
                    if (loginModal) loginModal.classList.add('hidden');
                })
                .catch((error) => {
                    alert('Registration Error: ' + error.message);
                });
        });
    }

    // 3. FORGOT PASSWORD (RESET LINK TO EMAIL)
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', () => {
            const email = authEmail.value.trim();

            if (!email) {
                alert('කරුණාකර Email ලිපිනය ඇතුළත් කර "Forgot Password?" ඔබන්න.');
                return;
            }

            auth.sendPasswordResetEmail(email)
                .then(() => {
                    alert('Password Reset කිරීමට අදාළ Link එක ඔබගේ Email එකට යවන ලදී. කරුණාකර Inbox/Spam පරීක්ෂා කරන්න.');
                })
                .catch((error) => {
                    alert('Error: ' + error.message);
                });
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
            renderContent();
        }, (error) => console.log("Error loading NFTs:", error));

        db.collection("collectors").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
            liveCollectors = [];
            snapshot.forEach((doc) => liveCollectors.push({ id: doc.id, ...doc.data() }));
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
            if (liveNFTs.length === 0) {
                nftGrid.innerHTML = `<p style="color:#888; grid-column: 1/-1; text-align:center; padding: 40px; font-size: 1rem;">No NFT creations available yet. Use Admin Panel (🔒) to upload your first creation.</p>`;
            } else {
                const newNftHTML = liveNFTs.map((item, idx) => {
                    const isLongStory = item.story && item.story.length > 100;
                    const truncatedText = isLongStory ? item.story.substring(0, 100) + '...' : (item.story || '');
                    const likedByArray = item.likedBy || [];
                    const isLiked = currentUser ? likedByArray.includes(currentUser.uid) : false;
                    const base = item.baseLikes || 125000;
                    const totalLikes = base + (likedByArray.length);

                    return `
                        <div class="nft-card glassmorphism">
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
                                <button class="outline-like-btn ${isLiked ? 'liked' : ''}" onclick="handleLike('${item.id}')">
                                    <svg class="heart-icon" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                    <span>${formatLikes(totalLikes)}</span>
                                </button>
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
                const newCollectorHTML = liveCollectors.map(item => `
                    <div class="collector-card glassmorphism">
                        <span>💎</span>
                        <span><strong>${item.name}</strong> bought <em>${item.itemBought || 'NFT'}</em></span>
                        <span style="color:#00ff66;">(${item.eth})</span>
                    </div>
                `).join('');

                if (newCollectorHTML !== cachedCollectorHTML) {
                    cachedCollectorHTML = newCollectorHTML;
                    collectorList.innerHTML = newCollectorHTML;
                }
            }
        }

        renderAdminLists(liveNFTs, liveCollectors);
    }

    window.openPreview = function(imgSrc, title) {
        const modal = document.getElementById('imagePreviewModal');
        if (modal) {
            document.getElementById('previewModalImg').src = imgSrc;
            document.getElementById('previewModalTitle').innerText = title;
            modal.classList.remove('hidden');
        }
    };

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
