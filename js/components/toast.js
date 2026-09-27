export function Toast(message, type = "info") {
    let toastContainer = document.querySelector(".toast-container");

    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.classList.add("toast-container");
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement("div");
    toast.classList.add("toast", `toast-${type}`);

    toast.innerHTML = `
        <div class="toast-content">
            <p class="toast-message">${message}</p>
            <button class="toast-close" aria-label="Close toast">×</button>
        </div>
    `;

    // FIX: Append to toastContainer instead of document.body
    toastContainer.appendChild(toast);

    const closeButton = toast.querySelector(".toast-close");

    const removeToast = () => {
        if (toast.classList.contains("toast-hide")) return;
        toast.classList.add("toast-hide");

        setTimeout(() => {
            toast.remove();
            // Optional: clean up empty container
            if (toastContainer && toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        }, 300);
    };

    closeButton.addEventListener("click", removeToast);

    setTimeout(removeToast, 5000);

    return toast;
}