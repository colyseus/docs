import React from "react";
import { Callout } from "nextra/components";
import { Link } from "nextra-theme-docs"; // styled like MDX links, unlike next/link

/**
 * Points a client SDK Quick Example at the room it joins. Readers often land
 * on a client page from search and never see the server step.
 *
 * Usage in MDX, right below the "Quick Example" heading:
 *
 *   <ServerRequired />
 */
export function ServerRequired() {
    return (
        <Callout type="info">
            The state schema and messages in this example come from the room built
            in <Link href="/getting-started/server">Create a Server</Link>. Start that server before you run it.
        </Callout>
    );
}
