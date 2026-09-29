export function notificationToast(message, type = "info", title = "", conversationId = null) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const content = document.createElement("div");
    content.className = "toast-content";

    if (title) {
        const heading = document.createElement("strong");
        heading.className = "toast-title";
        heading.textContent = title;
        content.appendChild(heading);
    }

    const text = document.createElement("p");
    text.className = "toast-message";
    text.textContent = message;

    const closeBtn = document.createElement("button");
    closeBtn.className = "toast-close";
    closeBtn.textContent = "×";

    content.append(text, closeBtn);
    toast.appendChild(content);
    document.body.appendChild(toast);

    closeBtn.addEventListener("click", (e) => {
         e.stopPropagation();
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 300);
    });

    setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 300);
    }, 5000);


    if (conversationId) {
    toast.addEventListener("click", () => {
        window.location.href =
            `userProfile.html?tab=messages&conversation=${conversationId}`;
    });
}

}