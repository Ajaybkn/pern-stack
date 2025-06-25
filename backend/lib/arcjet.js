import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import dotenv from "dotenv";
dotenv.config();

//initialize arcjet

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    //shield protects against bots and malicious traffic
    shield({ mode: "LIVE" }),
    //block all bots except search bots
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    //rate limit requests to 10 per second per IP
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});
