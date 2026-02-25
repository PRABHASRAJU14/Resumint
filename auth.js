import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from "./firebase-config.js";

const loginBtn = document.getElementById("loginBtn");
const userAvatar = document.getElementById("userAvatar");
const userNameDisplay = document.getElementById("userNameDisplay");
const authContainer = document.getElementById("authContainer");

let currentUser = null;

// Expose user to other scripts
export function getUser() {
    return currentUser;
}

// Login Function
export async function login() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        currentUser = result.user;
        updateUI(currentUser);
        console.log("Logged in:", currentUser.displayName);
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Check console for details (and ensure you updated firebase-config.js!)");
    }
}

// Logout Function
export async function logout() {
    try {
        await signOut(auth);
        currentUser = null;
        updateUI(null);
        console.log("Logged out");
        // Optional: clear local state or reload?
        // window.location.reload(); 
    } catch (error) {
        console.error("Logout failed:", error);
    }
}

// Update UI based on auth state
function updateUI(user) {
    if (!loginBtn) return; // Guard if elements don't exist yet

    if (user) {
        loginBtn.style.display = "none";
        if (userAvatar) {
            userAvatar.src = user.photoURL || "https://ui-avatars.com/api/?name=" + user.displayName;
            userAvatar.style.display = "block";
        }
        if (authContainer) authContainer.classList.add("logged-in");
    } else {
        loginBtn.style.display = "inline-flex";
        if (userAvatar) userAvatar.style.display = "none";
        if (authContainer) authContainer.classList.remove("logged-in");
    }
}

// Listen for state changes
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    updateUI(user);
});

// Attach event listeners if elements exist
if (loginBtn) {
    loginBtn.addEventListener("click", login);
}

if (userAvatar) {
    userAvatar.addEventListener("click", () => {
        if (confirm("Log out?")) {
            logout();
        }
    });
}
