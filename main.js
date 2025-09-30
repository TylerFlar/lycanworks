document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector("#app");
    if (!app) {
        console.error("App root element not found");
        return;
    }

    app.innerHTML = `
        <main>
            <h1>Lycanworks</h1>
            <p>Welcome to your new web playground.</p>
        </main>
    `;
});
