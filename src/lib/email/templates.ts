import { renderEmailLayout, emailButton } from "@/lib/email/layout";
import { SITE_URL } from "@/lib/email/resend";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function newRecipeEmail(recipe: { title: string; slug: string; description: string; imageUrl: string | null; tag: string | null }) {
  const url = `${SITE_URL}/recipes/${recipe.slug}`;
  const image = recipe.imageUrl
    ? `<img src="${recipe.imageUrl}" alt="${escapeHtml(recipe.title)}" width="496" style="width:100%;max-width:496px;height:auto;border-radius:14px;display:block;margin:0 0 22px;" />`
    : "";
  const tag = recipe.tag
    ? `<span style="display:inline-block;background-color:#F4EFE3;color:#2f7d3b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;padding:5px 12px;border-radius:999px;margin:0 0 12px;">${escapeHtml(recipe.tag)}</span>`
    : "";

  const bodyHtml = `
    ${image}
    ${tag}
    <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#d97706;">New Recipe</p>
    <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.3;color:#111827;">${escapeHtml(recipe.title)}</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4B4A45;">${escapeHtml(recipe.description)}</p>
    ${emailButton("Get the Recipe →", url)}
  `;

  return {
    subject: `🍽️ New Recipe: ${recipe.title}`,
    html: renderEmailLayout({ previewText: recipe.description, bodyHtml, unsubscribePath: "/account?tab=settings" }),
  };
}

export function newPostEmail(post: { title: string; slug: string; excerpt: string; imageUrl: string | null; categoryName?: string | null }) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.imageUrl
    ? `<img src="${post.imageUrl}" alt="${escapeHtml(post.title)}" width="496" style="width:100%;max-width:496px;height:auto;border-radius:14px;display:block;margin:0 0 22px;" />`
    : "";
  const category = post.categoryName
    ? `<span style="display:inline-block;background-color:#F4EFE3;color:#2f7d3b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;padding:5px 12px;border-radius:999px;margin:0 0 12px;">${escapeHtml(post.categoryName)}</span>`
    : "";

  const bodyHtml = `
    ${image}
    ${category}
    <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#d97706;">New on the Blog</p>
    <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.3;color:#111827;">${escapeHtml(post.title)}</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4B4A45;">${escapeHtml(post.excerpt)}</p>
    ${emailButton("Read the Article →", url, "#d97706")}
  `;

  return {
    subject: `📝 New on the Blog: ${post.title}`,
    html: renderEmailLayout({ previewText: post.excerpt, bodyHtml, unsubscribePath: "/account?tab=settings" }),
  };
}

export function contactFormNotificationEmail(msg: { name: string; email: string; subject: string; message: string }) {
  const bodyHtml = `
    <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#d97706;">New Contact Form Message</p>
    <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#111827;">${escapeHtml(msg.subject)}</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#8A8578;width:80px;">From</td>
        <td style="padding:4px 0;font-size:14px;color:#111827;font-weight:600;">${escapeHtml(msg.name)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#8A8578;">Email</td>
        <td style="padding:4px 0;font-size:14px;"><a href="mailto:${msg.email}" style="color:#2f7d3b;">${escapeHtml(msg.email)}</a></td>
      </tr>
    </table>
    <div style="padding:18px 20px;background-color:#FBF6EE;border-radius:14px;border:1px solid #ECE3D3;">
      <p style="margin:0;font-size:14px;line-height:1.7;color:#4B4A45;white-space:pre-wrap;">${escapeHtml(msg.message)}</p>
    </div>
    ${emailButton("Reply to " + msg.name.split(" ")[0], `mailto:${msg.email}`, "#d97706")}
  `;

  return {
    subject: `📩 Contact form: ${msg.subject}`,
    html: renderEmailLayout({
      previewText: `${msg.name}: ${msg.message.slice(0, 120)}`,
      bodyHtml,
      footerNote: "This message was submitted through the contact form at",
    }),
  };
}

export function contactFormConfirmationEmail(msg: { name: string; subject: string }) {
  const firstName = msg.name.trim().split(/\s+/)[0] || "there";
  const bodyHtml = `
    <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#d97706;">Message Received</p>
    <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#111827;">Thanks, ${escapeHtml(firstName)} — we got it!</h1>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#4B4A45;">
      Your message about &ldquo;${escapeHtml(msg.subject)}&rdquo; landed in our inbox. We read every one and
      usually reply within 1-2 business days.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#4B4A45;">
      While you wait, feel free to browse the recipe library.
    </p>
    ${emailButton("Browse Recipes →", `${SITE_URL}/recipes`)}
  `;

  return {
    subject: `We got your message — The Meal Prep Ideas`,
    html: renderEmailLayout({
      previewText: `Thanks for reaching out — we'll reply within 1-2 business days.`,
      bodyHtml,
      footerNote: "You're receiving this because you contacted",
    }),
  };
}

export function newCategoryEmail(category: { name: string }) {
  const url = `${SITE_URL}/blog`;
  const bodyHtml = `
    <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#d97706;">New Category</p>
    <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.3;color:#111827;">${escapeHtml(category.name)}</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4B4A45;">We've just added a new category to the blog — fresh articles will start landing there soon.</p>
    ${emailButton("Browse the Blog →", url, "#d97706")}
  `;

  return {
    subject: `🗂️ New Category: ${category.name}`,
    html: renderEmailLayout({
      previewText: `A new blog category just went live: ${category.name}`,
      bodyHtml,
      unsubscribePath: "/account?tab=settings",
    }),
  };
}
