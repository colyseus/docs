
export function SponsorsSidebar() {
    return (
        <div style={{ textAlign: "center", padding: "2em", width: "100%" }}>
            <span style={{ marginBottom: "0.5em", display: "inline-block", fontSize: "0.9em" }}>Sponsors</span>

            <a href="https://developers.poki.com/?utm_source=colyseus-docs&utm_content=sidebar" target="_blank" rel="sponsored" style={{ display: "block" }}>
                <img src="/sponsors/poki.svg" style={{ height: "32px", width: "auto", margin: "auto" }} />
            </a>

        </div>
    )
}