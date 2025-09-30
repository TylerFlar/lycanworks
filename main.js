document.addEventListener("DOMContentLoaded", () => {
    enableSmoothScroll();
    setupLightbox();
});

function enableSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", targetId);
        });
    });
}

function setupLightbox() {
    if (!("HTMLDialogElement" in window)) {
        return;
    }

    const images = document.querySelectorAll("main figure img");
    if (images.length === 0) {
        return;
    }

    const dialog = document.createElement("dialog");
    dialog.classList.add("lightbox");
    dialog.innerHTML = `
        <button type="button" class="lightbox__close" aria-label="Close image viewer">×</button>
        <img alt="">
    `;

    document.body.append(dialog);

    const dialogImage = dialog.querySelector("img");
    const closeButton = dialog.querySelector(".lightbox__close");

    const closeDialog = () => {
        if (dialog.open) {
            dialog.close();
        }
    };

    closeButton?.addEventListener("click", closeDialog);

    dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeDialog();
    });

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            closeDialog();
        }
    });

    images.forEach((img) => {
        img.addEventListener("click", () => {
            dialogImage.src = img.currentSrc || img.src;
            dialogImage.alt = img.alt || "Expanded gallery artwork";
            dialog.showModal();
            closeButton?.focus();
        });
    });
}
