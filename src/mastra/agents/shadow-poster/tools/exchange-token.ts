// src/mastra/agents/exchange-token.ts
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const shortLivedToken = "EAAKQ2GfmRkkBPBg1shtZBVChwyLBjdCBCNGOEZBqKj9Ugy81dsc8dbFFRLszLZBJJD2NxNnnwnJl0QfjIj4qVigZBDDQEiJOcZADrJrgtiVLogt5AwZCZBCBDxH966gNbhgtIIwiyM9yyTyxvzJNNiPJxQPTgToZCbs4Ki9xGsHI3ApTUppvFBWikxn7ZAG1TU1ZCDfxwJt5dlxAYBZCKrQ7giyEMtOEgTJjfSThzmypj3uFCGWZChrB6TOEL684984AZBcsn6jOcDQZDZD"; // Replace with the one you just got
const client_id = process.env.META_APP_ID;
const client_secret = process.env.META_APP_SECRET;

async function exchangeForLongLivedToken() {
  const res = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token` +
      `?grant_type=fb_exchange_token` +
      `&client_id=${client_id}` +
      `&client_secret=${client_secret}` +
      `&fb_exchange_token=${shortLivedToken}`
  );

  const data = await res.json();
  console.log("✅ Long-Lived Token Response:", data);
}

exchangeForLongLivedToken();
