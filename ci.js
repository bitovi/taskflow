#!/usr/bin/env node
import fetch from "node-fetch";

const url = process.env.JIRA_WEBHOOK_URL;
const token = process.env.JIRA_WEBHOOK_TOKEN;
const prTitle = process.argv.slice(2).join(" "); // passed in as CLI arg

if (!url || !token) {
    console.error("❌ Missing JIRA_WEBHOOK_URL or JIRA_WEBHOOK_TOKEN in process.env.");
    process.exit(1);
}

// Extract Jira key (e.g., ABC-123) from PR title
const match = prTitle.match(/[A-Z][A-Z0-9]+-\d+/);
if (!match) {
    console.error("❌ No Jira key found in PR title:", prTitle);
    process.exit(1);
}
const jiraKey = match[0];

(async () => {
    console.log(`🔗 Marking ${jiraKey} In Review…`);

    const response = await fetch(`${url}?issue=${jiraKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Automation-Webhook-Token": token,
        },
    });

    if (!response.ok) {
        console.error(`❌ Jira webhook failed: ${response.status} ${response.statusText}`);
        process.exit(1);
    }

    console.log("✅ Jira webhook called successfully.");
})();
