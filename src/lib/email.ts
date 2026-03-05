import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = process.env.EMAIL_FROM || "Persian X Lobby <noreply@example.com>";

interface DigestData {
  memberEmail: string;
  memberHandle: string;
  unfollowed: string[];
}

export async function sendDigestEmail({ memberEmail, memberHandle, unfollowed }: DigestData) {
  if (unfollowed.length === 0) return;

  const followLinks = unfollowed
    .map((handle) => `<li><a href="https://x.com/${handle}">@${handle}</a></li>`)
    .join("\n");

  await resend.emails.send({
    from: emailFrom,
    to: memberEmail,
    subject: `Persian X Lobby: ${unfollowed.length} members to follow`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hey @${memberHandle}!</h2>
        <p>You still need to follow <strong>${unfollowed.length}</strong> group members:</p>
        <ul>${followLinks}</ul>
        <p>Click each name to visit their profile and follow them.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e0e0e0;" />
        <p style="color: #888; font-size: 12px;">Persian X Lobby - Supporting each other in tech</p>
      </div>
    `,
  });
}
