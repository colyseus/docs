
export function SponsorsSidebar() {
    return (
        <div style={{ textAlign: "center", padding: "1em", width: "100%" }}>
            <span style={{ marginBlock: "0.5em", display: "inline-block", fontSize: "0.9em" }}>Sponsors</span>

            <a href="https://developers.poki.com/" target="_blank" rel="sponsored" style={{ display: "block" }}>
                <img src="/sponsors/poki.svg" style={{ height: "48px", width: "auto", margin: "auto" }} />
            </a>

        </div>
    )
}