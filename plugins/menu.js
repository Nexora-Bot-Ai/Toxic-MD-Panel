import moment from "moment-timezone";
import fs from "fs";
import pkg from "@whiskeysockets/baileys";
const { generateWAMessageFromContent, proto } = pkg;
import config from "../config.cjs";
import axios from "axios";

// Time logic
const xtime = moment.tz("Asia/Karach").format("HH:mm:ss");
const xdate = moment.tz("Asia/Karach").format("DD/MM/YYYY");
const time2 = moment().tz("Asia/Karach").format("HH:mm:ss");
let pushwish = "";

if (time2 < "05:00:00") {
  pushwish = `Good Morning 🌄`;
} else if (time2 < "11:00:00") {
  pushwish = `Good Morning 🌄`;
} else if (time2 < "15:00:00") {
  pushwish = `Good Afternoon 🌅`;
} else if (time2 < "18:00:00") {
  pushwish = `Good Evening 🌃`;
} else if (time2 < "19:00:00") {
  pushwish = `Good Evening 🌃`;
} else {
  pushwish = `Good Night 🌌`;
}

// Fancy font utility
function toFancyFont(text, isUpperCase = false) {
  const fonts = {
    A: "𝘼", B: "𝘽", C: "𝘾", D: "𝘿", E: "𝙀", F: "𝙁", G: "𝙂", H: "𝙃", 
    I: "𝙄", J: "𝙅", K: "𝙆", L: "𝙇", M: "𝙈", N: "𝙉", O: "𝙊", P: "𝙋", 
    Q: "𝙌", R: "𝙍", S: "𝙎", T: "𝙏", U: "𝙐", V: "𝙑", W: "𝙒", X: "𝙓", 
    Y: "𝙔", Z: "𝙕", a: "𝙖", b: "𝙗", c: "𝙘", d: "𝙙", e: "𝙚", f: "𝙛", 
    g: "𝙜", h: "𝙝", i: "𝙞", j: "𝙟", k: "𝙠", l: "𝙡", m: "𝙢", n: "𝙣", 
    o: "𝙤", p: "𝙥", q: "𝙦", r: "𝙧", s: "𝙨", t: "𝙩", u: "𝙪", v: "𝙫", 
    w: "𝙬", x: "𝙭", y: "𝙮", z: "𝙯"
  };
  
  const formattedText = isUpperCase ? text.toUpperCase() : text;
  return formattedText
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

// Image fetch utility
async function fetchMenuImage() {
  const imageUrl = "https://i.ibb.co/JRvZBgDK/temp.jpg";
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.error("❌ Failed to fetch image:", error.message);
    return null;
  }
}

const menu = async (m, Matrix) => {
  try {
    const prefix = config.PREFIX || ".";
    const body = m.body || "";
    const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const mode = config.MODE === "public" ? "public" : "private";
    const totalCommands = 70;

    const validCommands = ["list", "help", "menu"];
    const subMenuCommands = [
      "download-menu", "converter-menu", "ai-menu", "tools-menu", 
      "group-menu", "search-menu", "main-menu", "owner-menu", "stalk-menu"
    ];

    // Handle main menu commands
    if (validCommands.includes(cmd)) {
      const menuImage = await fetchMenuImage();
      const mainMenu = `
◈━━━━━━━━━━━━━━━━◈
│❒ ${toFancyFont("NEXORA-BOT")} Command Menu ⚠
│
│ 🤖 *${toFancyFont("Bot")}*: ${toFancyFont("NEXORA-BOT")}
│ 📋 *${toFancyFont("Total Commands")}*: ${totalCommands}
│ 🔣 *${toFancyFont("Prefix")}*: ${prefix}
│ 🌐 *${toFancyFont("Mode")}*: ${mode}
│ 📚 *${toFancyFont("Library")}*: Baileys
◈━━━━━━━━━━━━━━━━◈

${pushwish} @${m.pushName || 'User'}! Tap a button to select a menu category:

> Pσɯҽɾҽԃ Ⴆყ SOURAJIT
`;

      const message = {
        text: mainMenu,
        footer: "Pσɯҽɾҽԃ Ⴆყ SOURAJIT",
        title: `${toFancyFont("NEXORA-BOT")} Menu`,
        buttons: [
          { buttonId: `${prefix}download-menu`, buttonText: { displayText: "📥 Download" }, type: 1 },
          { buttonId: `${prefix}converter-menu`, buttonText: { displayText: "🔄 Converter" }, type: 1 },
          { buttonId: `${prefix}ai-menu`, buttonText: { displayText: "🤖 AI" }, type: 1 },
          { buttonId: `${prefix}tools-menu`, buttonText: { displayText: "🛠 Tools" }, type: 1 },
          { buttonId: `${prefix}group-menu`, buttonText: { displayText: "👥 Group" }, type: 1 },
          { buttonId: `${prefix}search-menu`, buttonText: { displayText: "🔍 Search" }, type: 1 },
          { buttonId: `${prefix}main-menu`, buttonText: { displayText: "⚙ Main" }, type: 1 },
          { buttonId: `${prefix}owner-menu`, buttonText: { displayText: "🔒 Owner" }, type: 1 },
          { buttonId: `${prefix}stalk-menu`, buttonText: { displayText: "🕵 Stalk" }, type: 1 }
        ],
        headerType: 1,
        mentions: [m.sender],
        contextInfo: {
          externalAdReply: {
            title: `${toFancyFont("NEXORA-BOT")} Menu`,
            body: `${pushwish} Explore NEXORA-BOT's features!`,
            thumbnail: menuImage || Buffer.alloc(0),
            sourceUrl: "https://github.com/Nexora-Bot-Ai/NEXORA-BOT",
            mediaType: 1
          }
        }
      };

      if (menuImage) {
        await Matrix.sendMessage(m.from, { 
          image: menuImage, 
          caption: mainMenu,
          ...message 
        }, { quoted: m });
      } else {
        await Matrix.sendMessage(m.from, message, { quoted: m });
      }

      return;
    }

    // Handle sub-menu commands
    if (subMenuCommands.includes(cmd)) {
      let menuTitle = "";
      let menuResponse = "";

      switch (cmd) {
        case "download-menu":
          menuTitle = "Download";
          menuResponse = `
◈━━━━━━━━━━━━━━━━◈
│❒ ${toFancyFont("Download")} 📥
│ ✘ *${toFancyFont("apk")}*
│ ✘ *${toFancyFont("facebook")}*
│ ✘ *${toFancyFont("mediafire")}*
│ ✘ *${toFancyFont("pinters")}*
│ ✘ *${toFancyFont("gitclone")}*
│ ✘ *${toFancyFont("gdrive")}*
│ ✘ *${toFancyFont("insta")}*
│ ✘ *${toFancyFont("ytmp3")}*
│ ✘ *${toFancyFont("ytmp4")}*
│ ✘ *${toFancyFont("play")}*
│ ✘ *${toFancyFont("song")}*
│ ✘ *${toFancyFont("video")}*
│ ✘ *${toFancyFont("ytmp3doc")}*
│ ✘ *${toFancyFont("ytmp4doc")}*
│ ✘ *${toFancyFont("tiktok")}*
◈━━━━━━━━━━━━━━━━◈
`;
          break;

        case "converter-menu":
          menuTitle = "Converter";
          menuResponse = `
◈━━━━━━━━━━━━━━━━◈
│❒ ${toFancyFont("Converter")} 🔄
│ ✘ *${toFancyFont("attp")}*
│ ✘ *${toFancyFont("attp2")}*
│ ✘ *${toFancyFont("attp3")}*
│ ✘ *${toFancyFont("ebinary")}*
│ ✘ *${toFancyFont("dbinary")}*
│ ✘ *${toFancyFont("emojimix")}*
│ ✘ *${toFancyFont("mp3")}*
◈━━━━━━━━━━━━━━━━◈
`;
          break;

        case "ai-menu":
          menuTitle = "AI";
          menuResponse = `
◈━━━━━━━━━━━━━━━━◈
│❒ ${toFancyFont("AI")} 🤖
│ ✘ *${toFancyFont("ai")}*
│ ✘ *${toFancyFont("bug")}*
│ ✘ *${toFancyFont("report")}*
│ ✘ *${toFancyFont("gpt")}*
│ ✘ *${toFancyFont("dalle")}*
│ ✘ *${toFancyFont("remini")}*
│ ✘ *${toFancyFont("gemini")}*
◈━━━━━━━━━━━━━━━━◈
`;
          break;

        case "tools-menu":
          menuTitle = "Tools";
          menuResponse = `
◈━━━━━━━━━━━━━━━━◈
│❒ ${toFancyFont("Tools")} 🛠
│ ✘ *${toFancyFont("calculator")}*
│ ✘ *${toFancyFont("tempmail")}*
│ ✘ *${toFancyFont("checkmail")}*
│ ✘ *${toFancyFont("trt")}*
│ ✘ *${toFancyFont("tts")}*
◈━━━━━━━━━━━━━━━━◈
`;
          break;

        case "group-menu":
          menuTitle = "Group";
          menuResponse = `
◈━━━━━━━━━━━━━━━━◈
│❒ ${toFancyFont("Group")} 👥
│ ✘ *${toFancyFont("linkgroup")}*
│ ✘ *${toFancyFont("setppgc")}*
│ ✘ *${toFancyFont("setname")}*
│ ✘ *${toFancyFont("setdesc")}*
│ ✘ *${toFancyFont("group")}*
│ ✘ *${toFancyFont("gcsetting")}*
│ ✘ *${toFancyFont("welcome")}*
│ ✘ *${toFancyFont("add")}*
│ ✘ *${toFancyFont("kick")}*
│ ✘ *${toFancyFont("hidetag")}*
│ ✘ *${toFancyFont("tagall")}*
│ ✘ *${toFancyFont("antilink")}*
│ ✘ *${toFancyFont("antitoxic")}*
│ ✘ *${toFancyFont("promote")}*
│ ✘ *${toFancyFont("demote")}*
│ ✘ *${toFancyFont("getbio")}*
◈━━━━━━━━━━━━━━━━◈
`;
          break;

        case "search-menu":
          menuTitle = "Search";
          menuResponse = `
◈━━━━━━━━━━━━━━━━◈
│❒ ${toFancyFont("Search")} 🔍
│ ✘ *${toFancyFont("play")}*
│ ✘ *${toFancyFont("yts")}*
│ ✘ *${toFancyFont("imdb")}*
│ ✘ *${toFancyFont("google")}*
│ ✘ *${toFancyFont("gimage")}*
│ ✘ *${toFancyFont("pinterest")}*
│ ✘ *${toFancyFont("wallpaper")}*
│ ✘ *${toFancyFont("wikimedia")}*
│ ✘ *${toFancyFont("ytsearch")}*
│ ✘ *${toFancyFont("ringtone")}*
│ ✘ *${toFancyFont("lyrics")}*
◈━━━━━━━━━━━━━━━━◈
`;
          break;

        case "main-menu":
          menuTitle = "Main";
          menuResponse = `
◈━━━━━━━━━━━━━━━━◈
│❒ ${toFancyFont("Main")} ⚙
│ ✘ *${toFancyFont("ping")}*
│ ✘ *${toFancyFont("alive")}*
│ ✘ *${toFancyFont("owner")}*
│ ✘ *${toFancyFont("menu")}*
│ ✘ *${toFancyFont("infobot")}*
◈━━━━━━━━━━━━━━━━◈
`;
          break;

        case "owner-menu":
          menuTitle = "Owner";
          menuResponse = `
◈━━━━━━━━━━━━━━━━◈
│❒ ${toFancyFont("Owner")} 🔒
│ ✘ *${toFancyFont("join")}*
│ ✘ *${toFancyFont("leave")}*
│ ✘ *${toFancyFont("block")}*
│ ✘ *${toFancyFont("unblock")}*
│ ✘ *${toFancyFont("setppbot")}*
│ ✘ *${toFancyFont("anticall")}*
│ ✘ *${toFancyFont("setstatus")}*
│ ✘ *${toFancyFont("setnamebot")}*
│ ✘ *${toFancyFont("autorecording")}*
│ ✘ *${toFancyFont("autolike")}*
│ ✘ *${toFancyFont("autotyping")}*
│ ✘ *${toFancyFont("alwaysonline")}*
│ ✘ *${toFancyFont("autoread")}*
│ ✘ *${toFancyFont("autosview")}*
◈━━━━━━━━━━━━━━━━◈
`;
          break;

        case "stalk-menu":
          menuTitle = "Stalk";
          menuResponse = `
◈━━━━━━━━━━━━━━━━◈
│❒ ${toFancyFont("Stalk")} 🕵
│ ✘ *${toFancyFont("truecaller")}*
│ ✘ *${toFancyFont("instastalk")}*
│ ✘ *${toFancyFont("githubstalk")}*
◈━━━━━━━━━━━━━━━━◈
`;
          break;

        default:
          return;
      }

      const fullResponse = `
◈━━━━━━━━━━━━━━━━◈
│❒ ${toFancyFont("Arslan-MD")} - ${toFancyFont(menuTitle)} ⚠
│
│ 🤖 *${toFancyFont("Bot")}*: ${toFancyFont("Arslan-MD")}
│ 👤 *${toFancyFont("User")}*: ${m.pushName || 'User'}
│ 🔣 *${toFancyFont("Prefix")}*: ${prefix}
│ 📚 *${toFancyFont("Library")}*: Baileys
◈━━━━━━━━━━━━━━━━◈

${menuResponse}

> Pσɯҽɾҽԃ Ⴆყ ᴀʀꜱʟᴀɴ-ɱԃȥ
`;

      await Matrix.sendMessage(m.from, { 
        text: fullResponse,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: `${toFancyFont("Arslan-MD")} ${toFancyFont(menuTitle)}`,
            body: `Explore NEXORA-BOT ${menuTitle.toLowerCase()} commands!`,
            sourceUrl: "https://github.com/Arslan-MD/Arslan-XMD",
            mediaType: 1
          }
        }
      }, { quoted: m });
    }
  } catch (error) {
    console.error(`❌ Menu error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *NEXORA-BOT* hit a snag! Error: ${error.message || "Failed to load menu"} 😡
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default menu;
