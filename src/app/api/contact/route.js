import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

const submissions = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;

function rateLimited(ip) {
  const now = Date.now();
  const entry = submissions.get(ip) || [];
  const recent = entry.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  submissions.set(ip, recent);
  return false;
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (rateLimited(ip)) {
      return NextResponse.json({ error: 'Trop de tentatives. Réessayez plus tard.' }, { status: 429 });
    }

    const body = await request.json();
    const { nom, societe, telephone, email, objet, message, website } = body;

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!nom?.trim() || !telephone?.trim() || !email?.trim() || !objet?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
    }
    if (message.length > 5000 || nom.length > 200) {
      return NextResponse.json({ error: 'Contenu trop long.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const esc = (s) => String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));

    await transporter.sendMail({
      from: `"Site ATNER" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `[Site Web] ${objet} — ${nom}`,
      html: `
        <h2 style="color:#0a1628;">Nouveau message depuis le site ATNER</h2>
        <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
          <tr><td><b>Nom</b></td><td>${esc(nom)}</td></tr>
          <tr><td><b>Société</b></td><td>${esc(societe || '—')}</td></tr>
          <tr><td><b>Téléphone</b></td><td>${esc(telephone)}</td></tr>
          <tr><td><b>Email</b></td><td>${esc(email)}</td></tr>
          <tr><td><b>Objet</b></td><td>${esc(objet)}</td></tr>
        </table>
        <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;border-left:3px solid #00a3ff;padding-left:12px;">${esc(message)}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: "L'envoi a échoué. Réessayez ou contactez-nous par téléphone." }, { status: 500 });
  }
}