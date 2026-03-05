import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface DigestData {
  memberEmail: string;
  memberHandle: string;
  unfollowed: string[];
}

interface InviteData {
  to: string;
  handle: string;
  name?: string;
  inviteCode: string;
  joinUrl: string;
}

export async function sendInviteEmail({ to, handle, name, inviteCode, joinUrl }: InviteData) {
  const result = await getResend().emails.send({
    from: process.env.EMAIL_FROM || "X Guild <noreply@example.com>",
    to,
    subject: "Your X Guild Invite",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0B1120; color: #ffffff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #C8A951, #8B6914); line-height: 48px; font-size: 24px; color: white;">&#10022;</div>
        </div>
        <h1 style="text-align: center; font-size: 24px; color: #C8A951; margin-bottom: 8px;">You're In${name ? `, ${name}` : ""}!</h1>
        <p style="text-align: center; color: #ffffff99; font-size: 16px; margin-bottom: 32px;">Your request to join X Guild has been approved.</p>
        <div style="background: #ffffff08; border: 1px solid #ffffff10; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <p style="color: #ffffff60; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px 0;">Your Invite Code</p>
          <p style="font-size: 28px; font-weight: bold; color: #C8A951; margin: 0; letter-spacing: 3px;">${inviteCode}</p>
        </div>
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${joinUrl}" style="display: inline-block; padding: 14px 32px; background: #C8A951; color: #0B1120; font-weight: bold; border-radius: 12px; text-decoration: none; font-size: 16px;">Join X Guild</a>
        </div>
        <p style="color: #ffffff40; font-size: 13px; text-align: center;">
          Use handle <strong style="color: #ffffff80;">@${handle}</strong> and the invite code above to complete your registration.
        </p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #ffffff10;" />
        <p style="color: #ffffff20; font-size: 11px; text-align: center;">Lion and Sun Public Affairs Guild</p>
      </div>
    `,
  });
  console.log("Resend invite response:", JSON.stringify(result));
  return result;
}

export async function sendDigestEmail({ memberEmail, memberHandle, unfollowed }: DigestData) {
  if (unfollowed.length === 0) return;

  const followLinks = unfollowed
    .map((handle) => `<li><a href="https://x.com/${handle}">@${handle}</a></li>`)
    .join("\n");

  await getResend().emails.send({
    from: process.env.EMAIL_FROM || "X Guild <noreply@example.com>",
    to: memberEmail,
    subject: `X Guild: ${unfollowed.length} members to follow`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hey @${memberHandle}!</h2>
        <p>You still need to follow <strong>${unfollowed.length}</strong> group members:</p>
        <ul>${followLinks}</ul>
        <p>Click each name to visit their profile and follow them.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e0e0e0;" />
        <p style="color: #888; font-size: 12px;">X Guild - Supporting each other in tech</p>
      </div>
    `,
  });
}
