
// ?utm_source=colyseus-docs&utm_content=sidebar

export function SponsorsSidebar() {
    return (
        <div style={{ textAlign: "center", padding: "2em", width: "100%" }}>
            <span style={{ marginBottom: "0.5em", display: "inline-block", fontSize: "0.9em" }}>Sponsors</span>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1em" }}>
                <a href="https://developers.poki.com/?utm_source=colyseus-docs&utm_content=sidebar" target="_blank" rel="sponsored" style={{ display: "flex", alignItems: "center" }}>
                    <img src="/sponsors/poki.svg" style={{ height: "32px", width: "auto", margin: "auto" }} />
                </a>

                <a href="https://pixels.xyz?utm_source=colyseus-docs&utm_content=sidebar" target="_blank" rel="sponsored" style={{ display: "flex", alignItems: "center" }}>
                    <img src="/sponsors/pixels.png" style={{ height: "auto", width: "100%", margin: "auto" }} />
                </a>

                <a href="https://bloxd.io/?utm_source=colyseus-docs&utm_content=sidebar" target="_blank" rel="sponsored" style={{ display: "flex", alignItems: "center" }}>
                    <img src="/sponsors/bloxd.svg" style={{ height: "auto", width: "100%", margin: "auto" }} />
                </a>

                <a href="https://0xand.com/?utm_source=colyseus-docs&utm_content=sidebar" target="_blank" rel="sponsored" style={{ display: "flex", alignItems: "center" }}>
                    <img src="/sponsors/zeroxand.png" style={{ height: "auto", width: "100%", margin: "auto" }} />
                </a>

            </div>
        </div>
    )
}