"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Vector2D {
  x: number;
  y: number;
}

interface Entity {
  pos: Vector2D;
  vel: Vector2D;
  width: number;
  height: number;
}

// Profile types based on answers
type ProfileType = "risky" | "cautious" | "conscious";

// Anxiety types for personalization
type AnxietyType = "injury" | "documents" | "flight" | "accident";

// User questionnaire answers
interface UserAnswers {
  name: string;
  favoriteSubject: string;
  device: string;
  anxiety: AnxietyType;
  petName: string;
}

interface Player extends Entity {
  isGrounded: boolean;
  coyoteTime: number;
  jumpBufferTime: number;
  facingRight: boolean;
  animFrame: number;
  animTimer: number;
  emotion: "neutral" | "happy" | "sad";
  emotionTimer: number;
}

interface Cat extends Entity {
  targetX: number;
  animFrame: number;
  animTimer: number;
  tailWag: number;
  facingRight: boolean;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "ground" | "floating";
}

// Situation/Event on the map
interface Situation {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  month: string;
  icon: "phone" | "scooter" | "ticket" | "gamepad" | "water" | "pet" | "injury" | "documents" | "flight" | "accident";
  title: string;
  story: string;
  question: string;
  answers: {
    text: string;
    type: ProfileType;
    lossAmount: number;
  }[];
  triggered: boolean;
  answered: boolean;
}

interface ParallaxLayer {
  elements: { x: number; y: number; type: string }[];
  speed: number;
}

interface ProfileScores {
  risky: number;
  cautious: number;
  conscious: number;
}

type ParentMessage =
  | { type: "START_GAME" }
  | { type: "PAUSE_GAME" };

type ChildMessage =
  | { type: "GAME_STARTED" }
  | { type: "PROGRESS"; percent: number }
  | { type: "SITUATION_ANSWERED"; situationId: number; answerType: ProfileType }
  | { type: "GAME_COMPLETED"; profile: ProfileType; totalLoss: number };

// ============================================================================
// GAME CONSTANTS
// ============================================================================

const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;
const GRAVITY = 0.6;
const JUMP_FORCE = -14;
const MOVE_SPEED = 4;
const COYOTE_TIME_MAX = 8;
const JUMP_BUFFER_MAX = 8;
const GROUND_Y = GAME_HEIGHT - 80;
const TRIGGER_SHOW_DISTANCE = 100;
const TRIGGER_HIDE_DISTANCE = 140;
const BOUNDARY_MARGIN = 40;

/** Совпадает с Press Start 2P в layout (canvas не наследует шрифт из CSS) */
const CANVAS_FONT_FAMILY = '"Press Start 2P", monospace';

const COLORS = {
  sky: "#87CEEB",
  skyGradient: "#5BA3D9",
  ground: "#8B4513",
  groundDark: "#654321",
  grass: "#228B22",
  grassLight: "#32CD32",
  platform: "#A0522D",
  platformTop: "#CD853F",
  player: {
    skin: "#FFDAB9",
    hair: "#4A3728",
    shirt: "#6B8CFF",
    pants: "#3D5A80",
    shoes: "#2F2F2F",
  },
  cat: {
    body: "#FF8C00",
    stripes: "#CC7000",
    belly: "#FFE4B5",
    eyes: "#32CD32",
  },
  clouds: "#FFFFFF",
  mountains: "#6B8E6B",
  mountainsDark: "#4A6B4A",
  trees: "#1E5631",
  treesTrunk: "#4A3728",
  profiles: {
    risky: "#FF6B6B",
    cautious: "#4ECDC4",
    conscious: "#FFD93D",
  },
  situations: {
    phone: "#4A90D9",
    scooter: "#32CD32",
    ticket: "#FF69B4",
    gamepad: "#9370DB",
    water: "#00BFFF",
    pet: "#FF8C00",
    injury: "#FF4444",
    documents: "#FFD700",
    flight: "#87CEEB",
    accident: "#DC143C",
  },
};

// Subject-related situations
const SUBJECT_SITUATIONS: Record<string, { title: string; story: string; question: string }> = {
  "математика": {
    title: "Сломался калькулятор",
    story: "Ты готовился к контрольной по математике, и твой дорогой научный калькулятор перестал работать за день до экзамена.",
    question: "Что ты сделаешь?",
  },
  "физика": {
    title: "Проект по физике",
    story: "Ты собрал сложный проект по физике, но при транспортировке в школу он сломался.",
    question: "Как поступишь?",
  },
  "информатика": {
    title: "Потеря данных",
    story: "Ты работал над программой для урока информатики, и жёсткий диск вышел из строя — все файлы пропали.",
    question: "Твои действия?",
  },
  "физкультура": {
    title: "Травма на уроке",
    story: "На уроке физкультуры ты неудачно приземлился и подвернул ногу. Нужно идти к врачу.",
    question: "Что ты сделаешь?",
  },
  "default": {
    title: "Учебные материалы",
    story: "Ты потерял важный учебник и тетрадь с конспектами перед важным экзаменом.",
    question: "Как решишь проблему?",
  },
};

// Anxiety-based situations
const ANXIETY_SITUATIONS: Record<AnxietyType, { title: string; story: string; question: string; icon: "injury" | "documents" | "flight" | "accident" }> = {
  injury: {
    title: "Травма на тренировке",
    story: "На тренировке ты получил серьёзный ушиб. Тренер говорит, что нужно обратиться к врачу и сделать рентген.",
    question: "Как ты поступишь?",
    icon: "injury",
  },
  documents: {
    title: "Потеря паспорта",
    story: "Ты обнаружил, что потерял паспорт. Без него невозможно ни путешествовать, ни оформить важные документы.",
    question: "Что будешь делать?",
    icon: "documents",
  },
  flight: {
    title: "Отмена рейса",
    story: "Твой рейс отменили из-за погоды. Ты застрял в аэропорту без жилья и с ограниченным бюджетом.",
    question: "Как поступишь?",
    icon: "flight",
  },
  accident: {
    title: "ДТП на велосипеде",
    story: "Тебя сбила машина, когда ты ехал на велосипеде. Велосипед повреждён, и ты получил травму.",
    question: "Твои действия?",
    icon: "accident",
  },
};

// Profile descriptions
const PROFILE_INFO = {
  risky: {
    name: "Рискованный",
    description: "Ты действуешь быстро и импульсивно, не всегда думая о последствиях. Это может приводить к неожиданным расходам.",
    color: COLORS.profiles.risky,
    insuranceAdvice: "Тебе особенно важна страховка — она защитит от неожиданных крупных расходов, которые могут возникнуть из-за импульсивных решений.",
  },
  cautious: {
    name: "Осторожный",
    description: "Ты избегаешь рисков и всегда просишь помощи у близких. Это разумно, но иногда упускаешь возможности.",
    color: COLORS.profiles.cautious,
    insuranceAdvice: "Страховка даст тебе дополнительную уверенность и позволит чувствовать себя защищённым в любой ситуации.",
  },
  conscious: {
    name: "Осознанный",
    description: "Ты взвешиваешь решения, ищешь оптимальные варианты и думаешь о будущем. Отличный подход!",
    color: COLORS.profiles.conscious,
    insuranceAdvice: "Страховка — это логичное продолжение твоего разумного подхода к жизни. Она поможет оптимизировать расходы на непредвиденные случаи.",
  },
};

// ============================================================================
// GENERATE PERSONALIZED SITUATIONS
// ============================================================================

function generateSituations(userAnswers: UserAnswers): Situation[] {
  const { name, favoriteSubject, device, anxiety, petName } = userAnswers;
  const hasPet = petName.trim().length > 0;
  
  // Normalize subject for lookup
  const subjectLower = favoriteSubject.toLowerCase().trim();
  const subjectData = SUBJECT_SITUATIONS[subjectLower] || SUBJECT_SITUATIONS["default"];
  
  // Anxiety data
  const anxietyData = ANXIETY_SITUATIONS[anxiety];
  
  const situations: Situation[] = [
    // Situation 1: Device-specific phone/device damage
    {
      id: 1,
      x: 350,
      y: GROUND_Y - 120,
      width: 50,
      height: 60,
      month: "Март",
      icon: "phone",
      title: `${name}, твой ${device} сломался!`,
      story: `${name}, ты шёл по улице, и твой ${device} вылетел из рук и сильно разбился об асфальт. Экран треснул, устройство не включается.`,
      question: "Что ты сделаешь?",
      answers: [
        { text: `Куплю новый ${device} прямо сейчас — не могу без него ни дня`, type: "risky", lossAmount: 45000 },
        { text: "Отнесу в ремонт и попрошу родителей помочь с оплатой", type: "cautious", lossAmount: 15000 },
        { text: "Сначала узнаю точную стоимость ремонта и сравню, выгоднее ли купить новый", type: "conscious", lossAmount: 12000 },
      ],
      triggered: false,
      answered: false,
    },
    // Situation 2: Subject-related
    {
      id: 2,
      x: 750,
      y: GROUND_Y - 140,
      width: 50,
      height: 60,
      month: "Июнь",
      icon: "gamepad",
      title: subjectData.title,
      story: `${name}, ${subjectData.story.toLowerCase()}`,
      question: subjectData.question,
      answers: [
        { text: "Куплю всё заново, времени разбираться нет", type: "risky", lossAmount: 25000 },
        { text: "Попрошу одноклассников помочь или дать свои материалы", type: "cautious", lossAmount: 8000 },
        { text: "Попробую восстановить что возможно и составлю план действий", type: "conscious", lossAmount: 5000 },
      ],
      triggered: false,
      answered: false,
    },
    // Situation 3: Anxiety-based
    {
      id: 3,
      x: 1150,
      y: GROUND_Y - 100,
      width: 50,
      height: 60,
      month: "Август",
      icon: anxietyData.icon,
      title: anxietyData.title,
      story: `${name}, ${anxietyData.story.toLowerCase()}`,
      question: anxietyData.question,
      answers: [
        { text: "Это ерунда, как-нибудь справлюсь сам", type: "risky", lossAmount: 50000 },
        { text: "Сразу позвоню родителям и попрошу помочь", type: "cautious", lossAmount: 20000 },
        { text: "Соберу все документы, оценю ущерб и обращусь в нужные инстанции", type: "conscious", lossAmount: 15000 },
      ],
      triggered: false,
      answered: false,
    },
    // Situation 4: Concert/event tickets
    {
      id: 4,
      x: 1550,
      y: GROUND_Y - 160,
      width: 50,
      height: 60,
      month: "Октябрь",
      icon: "ticket",
      title: "Отмена концерта",
      story: `${name}, ты купил билеты на концерт любимой группы, но сильно заболел за день до мероприятия. Температура 38.`,
      question: "Как ты поступишь?",
      answers: [
        { text: "Поеду несмотря на температуру — билеты уже оплачены!", type: "risky", lossAmount: 15000 },
        { text: "Останусь дома, здоровье важнее. Билеты пропадут.", type: "cautious", lossAmount: 8000 },
        { text: "Попробую вернуть часть денег или перепродать билеты", type: "conscious", lossAmount: 3000 },
      ],
      triggered: false,
      answered: false,
    },
    // Situation 5: Pet OR Neighbors
    hasPet ? {
      id: 5,
      x: 1950,
      y: GROUND_Y - 120,
      width: 50,
      height: 60,
      month: "Декабрь",
      icon: "pet",
      title: `${petName} заболел!`,
      story: `${name}, твой питомец ${petName} внезапно заболел. Ветеринар говорит, что нужна срочная операция и лечение.`,
      question: "Что ты будешь делать?",
      answers: [
        { text: "Сделаю всё, что скажет врач, не глядя на стоимость", type: "risky", lossAmount: 60000 },
        { text: "Попрошу родителей оплатить лечение", type: "cautious", lossAmount: 40000 },
        { text: "Узнаю все варианты лечения и их стоимость, выберу оптимальный", type: "conscious", lossAmount: 30000 },
      ],
      triggered: false,
      answered: false,
    } : {
      id: 5,
      x: 1950,
      y: GROUND_Y - 120,
      width: 50,
      height: 60,
      month: "Декабрь",
      icon: "water",
      title: "Залил соседей",
      story: `${name}, ты забыл выключить воду после душа, и вода потекла к соседям снизу. Они требуют компенсацию за ремонт.`,
      question: "Как будешь решать проблему?",
      answers: [
        { text: "Скажу, что это не я, и попробую избежать ответственности", type: "risky", lossAmount: 80000 },
        { text: "Признаюсь родителям и попрошу их помочь разобраться", type: "cautious", lossAmount: 40000 },
        { text: "Признаю вину и попробую договориться о разумной сумме возмещения", type: "conscious", lossAmount: 25000 },
      ],
      triggered: false,
      answered: false,
    },
  ];
  
  return situations;
}

// ============================================================================
// PIXEL ART DRAWING FUNCTIONS
// ============================================================================

function drawPixelRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
}

function drawNeutralPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  frame: number,
  cameraX: number
) {
  const x = Math.floor(player.pos.x - cameraX);
  const y = Math.floor(player.pos.y);
  const flip = player.facingRight ? 1 : -1;

  ctx.save();
  ctx.translate(x + player.width / 2, y);
  ctx.scale(flip, 1);
  ctx.translate(-player.width / 2, 0);

  const s = 1.8;
  const walkBob = player.isGrounded ? Math.sin(frame * 0.3) * 3 : 0;
  const jumpSquash = !player.isGrounded ? -3 : 0;
  const legOffset = player.isGrounded ? Math.sin(frame * 0.4) * 6 : 0;
  const armSwing = player.isGrounded ? Math.sin(frame * 0.4) * 4 : 0;

  // Legs
  drawPixelRect(ctx, 14 * s, 52 + walkBob + jumpSquash, 10 * s, 24 * s, COLORS.player.pants);
  drawPixelRect(ctx, 32 * s, 52 + walkBob + jumpSquash - legOffset, 10 * s, 24 * s, COLORS.player.pants);
  // Shoes
  drawPixelRect(ctx, 12 * s, 74 + walkBob + jumpSquash, 14 * s, 6 * s, COLORS.player.shoes);
  drawPixelRect(ctx, 30 * s, 74 + walkBob + jumpSquash - legOffset, 14 * s, 6 * s, COLORS.player.shoes);

  // Body
  drawPixelRect(ctx, 10 * s, 28 + walkBob, 36 * s, 26 * s, COLORS.player.shirt);
  drawPixelRect(ctx, 22 * s, 30 + walkBob, 12 * s, 4 * s, "#5A7ACC");

  // Arms
  drawPixelRect(ctx, 4 * s, 30 + walkBob - armSwing, 8 * s, 20 * s, COLORS.player.shirt);
  drawPixelRect(ctx, 44 * s, 30 + walkBob + armSwing, 8 * s, 20 * s, COLORS.player.shirt);
  drawPixelRect(ctx, 4 * s, 48 + walkBob - armSwing, 8 * s, 6 * s, COLORS.player.skin);
  drawPixelRect(ctx, 44 * s, 48 + walkBob + armSwing, 8 * s, 6 * s, COLORS.player.skin);

  // Neck & Head
  drawPixelRect(ctx, 22 * s, 24 + walkBob, 12 * s, 6 * s, COLORS.player.skin);
  drawPixelRect(ctx, 14 * s, 2 + walkBob, 28 * s, 24 * s, COLORS.player.skin);

  // Hair
  drawPixelRect(ctx, 12 * s, 0 + walkBob, 32 * s, 10 * s, COLORS.player.hair);
  drawPixelRect(ctx, 10 * s, 4 + walkBob, 8 * s, 10 * s, COLORS.player.hair);
  drawPixelRect(ctx, 38 * s, 4 + walkBob, 8 * s, 10 * s, COLORS.player.hair);

  // Face
  if (player.emotion === "happy") {
    drawPixelRect(ctx, 20 * s, 14 + walkBob, 6 * s, 2 * s, "#2F2F2F");
    drawPixelRect(ctx, 34 * s, 14 + walkBob, 6 * s, 2 * s, "#2F2F2F");
    drawPixelRect(ctx, 22 * s, 20 + walkBob, 12 * s, 3 * s, "#2F2F2F");
  } else if (player.emotion === "sad") {
    drawPixelRect(ctx, 20 * s, 12 + walkBob, 6 * s, 6 * s, "#FFFFFF");
    drawPixelRect(ctx, 21 * s, 13 + walkBob, 3 * s, 3 * s, "#4169E1");
    drawPixelRect(ctx, 34 * s, 12 + walkBob, 6 * s, 6 * s, "#FFFFFF");
    drawPixelRect(ctx, 35 * s, 13 + walkBob, 3 * s, 3 * s, "#4169E1");
    drawPixelRect(ctx, 24 * s, 22 + walkBob, 8 * s, 2 * s, "#2F2F2F");
  } else {
    drawPixelRect(ctx, 20 * s, 12 + walkBob, 6 * s, 6 * s, "#FFFFFF");
    drawPixelRect(ctx, 21 * s, 13 + walkBob, 3 * s, 4 * s, "#4169E1");
    drawPixelRect(ctx, 22 * s, 14 + walkBob, 2 * s, 2 * s, "#000000");
    drawPixelRect(ctx, 34 * s, 12 + walkBob, 6 * s, 6 * s, "#FFFFFF");
    drawPixelRect(ctx, 35 * s, 13 + walkBob, 3 * s, 4 * s, "#4169E1");
    drawPixelRect(ctx, 36 * s, 14 + walkBob, 2 * s, 2 * s, "#000000");
    drawPixelRect(ctx, 24 * s, 20 + walkBob, 8 * s, 2 * s, "#2F2F2F");
  }

  ctx.restore();
}

function drawCat(ctx: CanvasRenderingContext2D, cat: Cat, frame: number, cameraX: number) {
  const baseX = Math.floor(cat.pos.x - cameraX);
  const y = Math.floor(cat.pos.y);
  
  const s = 1.35;
  const catWidth = 44 * s;
  const flip = cat.facingRight ? 1 : -1;
  
  ctx.save();
  ctx.translate(baseX + catWidth / 2, 0);
  ctx.scale(flip, 1);
  ctx.translate(-catWidth / 2, 0);
  
  const x = 0;
  const tailWag = Math.sin(frame * 0.2) * 6;

  ctx.fillStyle = COLORS.cat.body;
  ctx.fillRect(x - 8 * s + tailWag, y + 10 * s, 6 * s, 16 * s);
  ctx.fillRect(x - 12 * s + tailWag * 1.5, y + 6 * s, 6 * s, 10 * s);

  drawPixelRect(ctx, x, y + 10 * s, 32 * s, 18 * s, COLORS.cat.body);
  drawPixelRect(ctx, x + 6 * s, y + 10 * s, 5 * s, 18 * s, COLORS.cat.stripes);
  drawPixelRect(ctx, x + 18 * s, y + 10 * s, 5 * s, 18 * s, COLORS.cat.stripes);
  drawPixelRect(ctx, x + 10 * s, y + 18 * s, 12 * s, 10 * s, COLORS.cat.belly);

  const legAnim = Math.sin(frame * 0.3) * 3;
  drawPixelRect(ctx, x + 3 * s, y + 26 * s + legAnim, 6 * s, 10 * s, COLORS.cat.body);
  drawPixelRect(ctx, x + 22 * s, y + 26 * s - legAnim, 6 * s, 10 * s, COLORS.cat.body);
  drawPixelRect(ctx, x + 1 * s, y + 34 * s + legAnim, 10 * s, 5 * s, COLORS.cat.belly);
  drawPixelRect(ctx, x + 20 * s, y + 34 * s - legAnim, 10 * s, 5 * s, COLORS.cat.belly);

  drawPixelRect(ctx, x + 22 * s, y, 22 * s, 22 * s, COLORS.cat.body);
  drawPixelRect(ctx, x + 22 * s, y - 10 * s, 6 * s, 12 * s, COLORS.cat.body);
  drawPixelRect(ctx, x + 38 * s, y - 10 * s, 6 * s, 12 * s, COLORS.cat.body);
  drawPixelRect(ctx, x + 23 * s, y - 6 * s, 4 * s, 6 * s, "#FFB6C1");
  drawPixelRect(ctx, x + 39 * s, y - 6 * s, 4 * s, 6 * s, "#FFB6C1");
  drawPixelRect(ctx, x + 26 * s, y + 4 * s, 14 * s, 12 * s, COLORS.cat.belly);
  drawPixelRect(ctx, x + 26 * s, y + 5 * s, 6 * s, 6 * s, COLORS.cat.eyes);
  drawPixelRect(ctx, x + 38 * s, y + 5 * s, 6 * s, 6 * s, COLORS.cat.eyes);
  drawPixelRect(ctx, x + 28 * s, y + 6 * s, 3 * s, 3 * s, "#000000");
  drawPixelRect(ctx, x + 40 * s, y + 6 * s, 3 * s, 3 * s, "#000000");
  drawPixelRect(ctx, x + 32 * s, y + 12 * s, 6 * s, 5 * s, "#FFB6C1");

  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 22 * s, y + 12 * s);
  ctx.lineTo(x + 12 * s, y + 10 * s);
  ctx.moveTo(x + 22 * s, y + 15 * s);
  ctx.lineTo(x + 12 * s, y + 16 * s);
  ctx.moveTo(x + 44 * s, y + 12 * s);
  ctx.lineTo(x + 54 * s, y + 10 * s);
  ctx.moveTo(x + 44 * s, y + 15 * s);
  ctx.lineTo(x + 54 * s, y + 16 * s);
  ctx.stroke();
  
  ctx.restore();
}

function drawSituationIcon(
  ctx: CanvasRenderingContext2D,
  situation: Situation,
  cameraX: number,
  frame: number
) {
  const x = Math.floor(situation.x - cameraX);
  const y = Math.floor(situation.y);
  
  if (situation.answered) {
    ctx.fillStyle = "#32CD32";
    ctx.beginPath();
    ctx.arc(x + situation.width / 2, y + situation.height / 2, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold 24px ${CANVAS_FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.fillText("✓", x + situation.width / 2, y + situation.height / 2 + 8);
    return;
  }
  
  const floatY = Math.sin(frame * 0.05 + situation.id) * 5;
  const pulse = 1 + Math.sin(frame * 0.1 + situation.id) * 0.1;
  
  const iconColor = COLORS.situations[situation.icon] || "#4A90D9";
  
  ctx.shadowColor = iconColor;
  ctx.shadowBlur = 15;
  
  ctx.fillStyle = iconColor;
  ctx.beginPath();
  ctx.arc(x + situation.width / 2, y + situation.height / 2 + floatY, 25 * pulse, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.shadowBlur = 0;
  
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold 12px ${CANVAS_FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.fillText(situation.month, x + situation.width / 2, y - 10 + floatY);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold 20px ${CANVAS_FONT_FAMILY}`;
  const symbols: Record<string, string> = {
    phone: "📱",
    scooter: "🛴",
    ticket: "🎫",
    gamepad: "🎮",
    water: "💧",
    pet: "🐾",
    injury: "🩹",
    documents: "📄",
    flight: "✈️",
    accident: "🚗",
  };
  ctx.fillText(symbols[situation.icon] || "?", x + situation.width / 2, y + situation.height / 2 + 8 + floatY);
}

function drawParallaxBackground(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  layers: ParallaxLayer[]
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  gradient.addColorStop(0, COLORS.sky);
  gradient.addColorStop(1, COLORS.skyGradient);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  const mountainLayer = layers[0];
  mountainLayer.elements.forEach((el) => {
    const drawX = el.x - cameraX * mountainLayer.speed;
    const wrappedX = ((drawX % 2500) + 2500) % 2500 - 250;
    
    ctx.fillStyle = COLORS.mountains;
    ctx.beginPath();
    ctx.moveTo(wrappedX, GROUND_Y);
    ctx.lineTo(wrappedX + 100, GROUND_Y - 150);
    ctx.lineTo(wrappedX + 200, GROUND_Y);
    ctx.fill();
    
    ctx.fillStyle = COLORS.mountainsDark;
    ctx.beginPath();
    ctx.moveTo(wrappedX + 80, GROUND_Y - 100);
    ctx.lineTo(wrappedX + 100, GROUND_Y - 150);
    ctx.lineTo(wrappedX + 120, GROUND_Y - 100);
    ctx.fill();
  });

  const cloudLayer = layers[1];
  cloudLayer.elements.forEach((el) => {
    const drawX = el.x - cameraX * cloudLayer.speed;
    const wrappedX = ((drawX % 2000) + 2000) % 2000 - 100;
    
    ctx.fillStyle = COLORS.clouds;
    ctx.beginPath();
    ctx.arc(wrappedX, el.y, 30, 0, Math.PI * 2);
    ctx.arc(wrappedX + 25, el.y - 10, 25, 0, Math.PI * 2);
    ctx.arc(wrappedX + 50, el.y, 30, 0, Math.PI * 2);
    ctx.fill();
  });

  const treeLayer = layers[2];
  treeLayer.elements.forEach((el) => {
    const drawX = el.x - cameraX * treeLayer.speed;
    const wrappedX = ((drawX % 1800) + 1800) % 1800 - 100;
    
    ctx.fillStyle = COLORS.treesTrunk;
    ctx.fillRect(wrappedX + 15, el.y, 20, 50);
    
    ctx.fillStyle = COLORS.trees;
    ctx.beginPath();
    ctx.moveTo(wrappedX, el.y);
    ctx.lineTo(wrappedX + 25, el.y - 60);
    ctx.lineTo(wrappedX + 50, el.y);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(wrappedX + 5, el.y - 30);
    ctx.lineTo(wrappedX + 25, el.y - 80);
    ctx.lineTo(wrappedX + 45, el.y - 30);
    ctx.fill();
  });
}

function drawPlatforms(
  ctx: CanvasRenderingContext2D,
  platforms: Platform[],
  cameraX: number
) {
  platforms.forEach((plat) => {
    const x = Math.floor(plat.x - cameraX);
    
    if (plat.type === "ground") {
      ctx.fillStyle = COLORS.grass;
      ctx.fillRect(x, plat.y, plat.width, 8);
      ctx.fillStyle = COLORS.grassLight;
      for (let i = 0; i < plat.width; i += 20) {
        ctx.fillRect(x + i, plat.y - 4, 4, 8);
        ctx.fillRect(x + i + 10, plat.y - 2, 3, 6);
      }
      ctx.fillStyle = COLORS.ground;
      ctx.fillRect(x, plat.y + 8, plat.width, plat.height - 8);
      ctx.fillStyle = COLORS.groundDark;
      ctx.fillRect(x, plat.y + plat.height - 10, plat.width, 10);
    } else {
      ctx.fillStyle = COLORS.platformTop;
      ctx.fillRect(x, plat.y, plat.width, 8);
      ctx.fillStyle = COLORS.platform;
      ctx.fillRect(x, plat.y + 8, plat.width, plat.height - 8);
      ctx.fillStyle = COLORS.groundDark;
      ctx.fillRect(x, plat.y + 8, 4, plat.height - 8);
      ctx.fillRect(x + plat.width - 4, plat.y + 8, 4, plat.height - 8);
    }
  });
}

// ============================================================================
// MAIN GAME COMPONENT
// ============================================================================

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const keysRef = useRef<Set<string>>(new Set());

  // Game state
  const [gameState, setGameState] = useState<"questionnaire" | "intro" | "playing" | "situation" | "results">("questionnaire");
  const [questionStep, setQuestionStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({
    name: "",
    favoriteSubject: "",
    device: "",
    anxiety: "injury",
    petName: "",
  });
  
  const [activeSituation, setActiveSituation] = useState<Situation | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [scale, setScale] = useState(1);
  const [isInIframe, setIsInIframe] = useState(false);
  
  const [profileScores, setProfileScores] = useState<ProfileScores>({ risky: 0, cautious: 0, conscious: 0 });
  const [totalLoss, setTotalLoss] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [finalProfile, setFinalProfile] = useState<ProfileType | null>(null);
  const [showInsurance, setShowInsurance] = useState(false);
  
  const [modalAnimation, setModalAnimation] = useState<"enter" | "exit" | "none">("none");
  const [counterValue, setCounterValue] = useState(0);
  const [showResultsContent, setShowResultsContent] = useState(false);

  const gameRef = useRef({
    player: {
      pos: { x: 100, y: GROUND_Y - 80 },
      vel: { x: 0, y: 0 },
      width: 64,
      height: 80,
      isGrounded: false,
      coyoteTime: 0,
      jumpBufferTime: 0,
      facingRight: true,
      animFrame: 0,
      animTimer: 0,
      emotion: "neutral" as const,
      emotionTimer: 0,
    } as Player,
    cat: {
      pos: { x: 50, y: GROUND_Y - 36 },
      vel: { x: 0, y: 0 },
      width: 40,
      height: 36,
      targetX: 50,
      animFrame: 0,
      animTimer: 0,
      tailWag: 0,
      facingRight: true,
    } as Cat,
    cameraX: 0,
    animationFrame: 0,
    worldWidth: 2200,
    parallaxLayers: [
      { elements: [{ x: 100, y: GROUND_Y }, { x: 400, y: GROUND_Y }, { x: 800, y: GROUND_Y }, { x: 1200, y: GROUND_Y }, { x: 1600, y: GROUND_Y }], speed: 0.2 },
      { elements: [{ x: 50, y: 100 }, { x: 300, y: 80 }, { x: 600, y: 120 }, { x: 900, y: 90 }, { x: 1200, y: 110 }], speed: 0.4 },
      { elements: [{ x: 80, y: GROUND_Y }, { x: 250, y: GROUND_Y }, { x: 500, y: GROUND_Y }, { x: 750, y: GROUND_Y }, { x: 1000, y: GROUND_Y }, { x: 1300, y: GROUND_Y }], speed: 0.7 },
    ] as ParallaxLayer[],
    platforms: [
      { x: 0, y: GROUND_Y, width: 2500, height: 80, type: "ground" },
      { x: 250, y: GROUND_Y - 60, width: 100, height: 24, type: "floating" },
      { x: 500, y: GROUND_Y - 100, width: 120, height: 24, type: "floating" },
      { x: 700, y: GROUND_Y - 60, width: 100, height: 24, type: "floating" },
      { x: 900, y: GROUND_Y - 100, width: 140, height: 24, type: "floating" },
      { x: 1100, y: GROUND_Y - 60, width: 120, height: 24, type: "floating" },
      { x: 1300, y: GROUND_Y - 100, width: 100, height: 24, type: "floating" },
      { x: 1500, y: GROUND_Y - 120, width: 120, height: 24, type: "floating" },
      { x: 1700, y: GROUND_Y - 80, width: 100, height: 24, type: "floating" },
      { x: 1900, y: GROUND_Y - 60, width: 140, height: 24, type: "floating" },
    ] as Platform[],
    situations: [] as Situation[],
  });

  const sendToParent = useCallback((message: ChildMessage) => {
    if (typeof window !== "undefined" && window.parent !== window) {
      window.parent.postMessage(message, "*");
    }
  }, []);

  useEffect(() => {
    setIsInIframe(typeof window !== "undefined" && window.parent !== window);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const scaleX = containerWidth / GAME_WIDTH;
        const scaleY = containerHeight / GAME_HEIGHT;
        setScale(Math.min(scaleX, scaleY, 1.5));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const checkSituationProximity = useCallback((): Situation | null => {
    const game = gameRef.current;
    const playerCenterX = game.player.pos.x + game.player.width / 2;
    const playerCenterY = game.player.pos.y + game.player.height / 2;

    for (const situation of game.situations) {
      if (situation.answered) continue;

      const sitCenterX = situation.x + situation.width / 2;
      const sitCenterY = situation.y + situation.height / 2;

      const horizontalDist = Math.abs(playerCenterX - sitCenterX);
      const verticalDist = Math.abs(playerCenterY - sitCenterY);

      if (horizontalDist < TRIGGER_SHOW_DISTANCE && verticalDist < TRIGGER_SHOW_DISTANCE + 40) {
        return situation;
      }
    }
    return null;
  }, []);

  const determineProfile = useCallback((scores: ProfileScores): ProfileType => {
    const { risky, cautious, conscious } = scores;
    if (conscious >= cautious && conscious >= risky) return "conscious";
    if (cautious >= risky) return "cautious";
    return "risky";
  }, []);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (!activeSituation) return;
    
    const answer = activeSituation.answers[answerIndex];
    
    setProfileScores(prev => ({
      ...prev,
      [answer.type]: prev[answer.type] + 1
    }));
    
    setTotalLoss(prev => prev + answer.lossAmount);
    
    const game = gameRef.current;
    const sitIndex = game.situations.findIndex(s => s.id === activeSituation.id);
    if (sitIndex !== -1) {
      game.situations[sitIndex].answered = true;
    }
    
    const newCount = answeredCount + 1;
    setAnsweredCount(newCount);
    
    sendToParent({ 
      type: "SITUATION_ANSWERED", 
      situationId: activeSituation.id, 
      answerType: answer.type 
    });
    
    setModalAnimation("exit");
    setTimeout(() => {
      setActiveSituation(null);
      setModalAnimation("none");
      
      if (newCount >= 5) {
        const finalScores = {
          risky: profileScores.risky + (answer.type === "risky" ? 1 : 0),
          cautious: profileScores.cautious + (answer.type === "cautious" ? 1 : 0),
          conscious: profileScores.conscious + (answer.type === "conscious" ? 1 : 0),
        };
        const profile = determineProfile(finalScores);
        setFinalProfile(profile);
        
        setTimeout(() => {
          setGameState("results");
          const finalLoss = totalLoss + answer.lossAmount;
          animateCounter(0, finalLoss);
          setTimeout(() => setShowResultsContent(true), 500);
          
          sendToParent({ 
            type: "GAME_COMPLETED", 
            profile, 
            totalLoss: finalLoss 
          });
        }, 500);
      } else {
        setGameState("playing");
      }
    }, 300);
  }, [activeSituation, answeredCount, profileScores, totalLoss, sendToParent, determineProfile]);

  const animateCounter = useCallback((start: number, end: number) => {
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);
      setCounterValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, []);

  // Main game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      const game = gameRef.current;
      const keys = keysRef.current;
      const { player, cat } = game;

      const moveLeft = keys.has("arrowleft") || keys.has("a");
      const moveRight = keys.has("arrowright") || keys.has("d");
      const jump = keys.has(" ") || keys.has("arrowup") || keys.has("w");
      const interact = keys.has("shift");

      if (moveLeft) {
        player.vel.x = -MOVE_SPEED;
        player.facingRight = false;
      } else if (moveRight) {
        player.vel.x = MOVE_SPEED;
        player.facingRight = true;
      } else {
        player.vel.x *= 0.8;
        if (Math.abs(player.vel.x) < 0.1) player.vel.x = 0;
      }

      if (jump) {
        if (player.jumpBufferTime === 0) {
          player.jumpBufferTime = JUMP_BUFFER_MAX;
        }
      } else {
        player.jumpBufferTime = 0;
      }

      if (player.jumpBufferTime > 0 && player.coyoteTime > 0) {
        player.vel.y = JUMP_FORCE;
        player.jumpBufferTime = 0;
        player.coyoteTime = 0;
        player.isGrounded = false;
      }

      if (player.jumpBufferTime > 0) player.jumpBufferTime--;
      if (player.coyoteTime > 0) player.coyoteTime--;

      player.vel.y += GRAVITY;
      if (player.vel.y > 15) player.vel.y = 15;

      player.pos.x += player.vel.x;
      player.pos.y += player.vel.y;

      player.isGrounded = false;
      for (const plat of game.platforms) {
        const playerBottom = player.pos.y + player.height;
        const playerRight = player.pos.x + player.width;
        const playerLeft = player.pos.x;

        if (
          playerRight > plat.x &&
          playerLeft < plat.x + plat.width &&
          playerBottom > plat.y &&
          playerBottom < plat.y + plat.height + 10 &&
          player.vel.y >= 0
        ) {
          player.pos.y = plat.y - player.height;
          player.vel.y = 0;
          player.isGrounded = true;
          player.coyoteTime = COYOTE_TIME_MAX;
        }
      }

      if (player.pos.x < BOUNDARY_MARGIN) {
        player.pos.x = BOUNDARY_MARGIN;
        player.vel.x = 0;
      }
      if (player.pos.x > game.worldWidth - player.width - BOUNDARY_MARGIN) {
        player.pos.x = game.worldWidth - player.width - BOUNDARY_MARGIN;
        player.vel.x = 0;
      }
      if (player.pos.y < BOUNDARY_MARGIN) {
        player.pos.y = BOUNDARY_MARGIN;
        player.vel.y = 0;
      }

      if (player.facingRight) {
        cat.targetX = player.pos.x - 60;
      } else {
        cat.targetX = player.pos.x + player.width + 20;
      }
      if (cat.targetX < 0) cat.targetX = 0;
      cat.facingRight = player.facingRight;
      
      const catDiff = cat.targetX - cat.pos.x;
      cat.vel.x = catDiff * 0.08;
      cat.pos.x += cat.vel.x;

      const targetCameraX = player.pos.x - GAME_WIDTH / 2 + player.width / 2;
      game.cameraX += (targetCameraX - game.cameraX) * 0.12;
      game.cameraX = Math.max(0, Math.min(game.cameraX, game.worldWidth - GAME_WIDTH));

      const nearbySituation = checkSituationProximity();
      if (interact && nearbySituation && !nearbySituation.answered) {
        setActiveSituation(nearbySituation);
        setGameState("situation");
        setModalAnimation("enter");
      }

      game.animationFrame++;

      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      drawParallaxBackground(ctx, game.cameraX, game.parallaxLayers);
      drawPlatforms(ctx, game.platforms, game.cameraX);

      for (const situation of game.situations) {
        drawSituationIcon(ctx, situation, game.cameraX, game.animationFrame);
      }

      drawCat(ctx, cat, game.animationFrame, game.cameraX);
      drawNeutralPlayer(ctx, player, game.animationFrame, game.cameraX);

      if (nearbySituation && !nearbySituation.answered) {
        const hintX = nearbySituation.x - game.cameraX + nearbySituation.width / 2;
        const hintY = nearbySituation.y - 40;
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.beginPath();
        ctx.roundRect(hintX - 50, hintY - 15, 100, 30, 8);
        ctx.fill();
        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = `bold 14px ${CANVAS_FONT_FAMILY}`;
        ctx.textAlign = "center";
        ctx.fillText("Нажми Shift", hintX, hintY + 5);
      }

      const progress = answeredCount / 5;
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(20, 20, 200, 20);
      ctx.fillStyle = "#FFD700";
      ctx.fillRect(20, 20, 200 * progress, 20);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, 200, 20);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `bold 12px ${CANVAS_FONT_FAMILY}`;
      ctx.textAlign = "left";
      ctx.fillText(`${answeredCount}/5 ситуаций`, 25, 35);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, answeredCount, checkSituationProximity]);

  const startGame = useCallback(() => {
    const game = gameRef.current;
    game.player.pos = { x: 100, y: GROUND_Y - game.player.height };
    game.player.vel = { x: 0, y: 0 };
    game.player.emotion = "neutral";
    game.cat.pos = { x: 50, y: GROUND_Y - game.cat.height };
    game.cameraX = 0;
    game.situations = generateSituations(userAnswers);
    
    setProfileScores({ risky: 0, cautious: 0, conscious: 0 });
    setTotalLoss(0);
    setAnsweredCount(0);
    setActiveSituation(null);
    setFinalProfile(null);
    setShowInsurance(false);
    setShowResultsContent(false);
    setCounterValue(0);
    setGameState("playing");
    sendToParent({ type: "GAME_STARTED" });
  }, [sendToParent, userAnswers]);

  const handleExit = useCallback(() => {
    setShowExitConfirm(false);
    setGameState("questionnaire");
    setQuestionStep(0);
    setUserAnswers({ name: "", favoriteSubject: "", device: "", anxiety: "injury", petName: "" });
    setProfileScores({ risky: 0, cautious: 0, conscious: 0 });
    setTotalLoss(0);
    setAnsweredCount(0);
  }, []);

  const handleQuestionnaireNext = useCallback(() => {
    if (questionStep < 4) {
      setQuestionStep(prev => prev + 1);
    } else {
      setGameState("intro");
    }
  }, [questionStep]);

  const insuranceSavings = Math.floor(totalLoss * 0.85);
  const withInsuranceCost = totalLoss - insuranceSavings;

  // Anxiety options
  const anxietyOptions: { value: AnxietyType; label: string }[] = [
    { value: "injury", label: "Травма на тренировке" },
    { value: "documents", label: "Потеря паспорта/важных документов" },
    { value: "flight", label: "Полёт на самолёте" },
    { value: "accident", label: "Попасть в ДТП" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        style={{
          width: GAME_WIDTH * scale,
          height: GAME_HEIGHT * scale,
          imageRendering: "pixelated",
        }}
        className="border-4 border-amber-600"
      />

      {/* Questionnaire Screen */}
      {gameState === "questionnaire" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-4 animate-in fade-in duration-500"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.62)), linear-gradient(to bottom, rgba(15, 23, 42, 0.72), rgba(30, 27, 75, 0.82)), url(/gta.jpg)",
          }}
        >
          <div className="max-w-lg w-full">
            <h1 
              className="text-[2.25rem] sm:text-[2.8125rem] md:text-[2.8125rem] font-bold text-center mb-2 animate-in slide-in-from-top duration-500 bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-[0.06em_0.06em_0_rgb(0,0,0)]"
            >
              СТРАХОВОЕ ПРИКЛЮЧЕНИЕ
            </h1>
            <p 
              className="text-sm sm:text-base text-purple-200 text-center mb-6"
            >
              Давай познакомимся! Ответь на несколько вопросов.
            </p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-8">
              {[0, 1, 2, 3, 4].map((step) => (
                <div 
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step === questionStep 
                      ? "bg-amber-400 scale-125" 
                      : step < questionStep 
                      ? "bg-green-500" 
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>

            <div className="bg-slate-800/90 border-4 border-purple-500 rounded-2xl p-4 md:p-6 animate-in zoom-in-95 duration-300">
              {/* Question 1: Name */}
              {questionStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white text-center" >
                    Как тебя зовут?
                  </h2>
                  <input
                    type="text"
                    value={userAnswers.name}
                    onChange={(e) => setUserAnswers(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Введи своё имя"
                    className="w-full p-3 bg-slate-700 border-2 border-purple-400 rounded-xl text-white text-sm sm:text-base focus:outline-none focus:border-amber-400 transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={handleQuestionnaireNext}
                    disabled={!userAnswers.name.trim()}
                    className={`w-full py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 ${
                      userAnswers.name.trim() 
                        ? "bg-amber-500 hover:bg-amber-400 text-black" 
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    ДАЛЕЕ
                  </button>
                </div>
              )}

              {/* Question 2: Favorite Subject */}
              {questionStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white text-center" >
                    Какой школьный предмет ты любишь больше всего?
                  </h2>
                  <input
                    type="text"
                    value={userAnswers.favoriteSubject}
                    onChange={(e) => setUserAnswers(prev => ({ ...prev, favoriteSubject: e.target.value }))}
                    placeholder="Например: математика, физика, история..."
                    className="w-full p-3 bg-slate-700 border-2 border-purple-400 rounded-xl text-white text-sm sm:text-base focus:outline-none focus:border-amber-400 transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={handleQuestionnaireNext}
                    disabled={!userAnswers.favoriteSubject.trim()}
                    className={`w-full py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 ${
                      userAnswers.favoriteSubject.trim() 
                        ? "bg-amber-500 hover:bg-amber-400 text-black" 
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    ДАЛЕЕ
                  </button>
                </div>
              )}

              {/* Question 3: Device */}
              {questionStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white text-center" >
                    С какого устройства ты сейчас играешь?
                  </h2>
                  <p className="text-purple-300 text-center text-xs sm:text-sm" >
                    Будет отлично, если напишешь модель устройства
                  </p>
                  <input
                    type="text"
                    value={userAnswers.device}
                    onChange={(e) => setUserAnswers(prev => ({ ...prev, device: e.target.value }))}
                    placeholder="Например: iPhone 15, Samsung Galaxy, ноутбук..."
                    className="w-full p-3 bg-slate-700 border-2 border-purple-400 rounded-xl text-white text-sm sm:text-base focus:outline-none focus:border-amber-400 transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={handleQuestionnaireNext}
                    disabled={!userAnswers.device.trim()}
                    className={`w-full py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 ${
                      userAnswers.device.trim() 
                        ? "bg-amber-500 hover:bg-amber-400 text-black" 
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    ДАЛЕЕ
                  </button>
                </div>
              )}

              {/* Question 4: Anxiety */}
              {questionStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white text-center" >
                    Что вызывает большую тревогу?
                  </h2>
                  <div className="space-y-3">
                    {anxietyOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setUserAnswers(prev => ({ ...prev, anxiety: option.value }))}
                        className={`w-full p-3 rounded-xl font-medium text-left text-sm sm:text-base transition-all duration-200 ${
                          userAnswers.anxiety === option.value
                            ? "bg-amber-500 text-black border-2 border-amber-300"
                            : "bg-slate-700 text-white border-2 border-slate-500 hover:border-purple-400"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleQuestionnaireNext}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold text-sm sm:text-base transition-all duration-200"
                  >
                    ДАЛЕЕ
                  </button>
                </div>
              )}

              {/* Question 5: Pet */}
              {questionStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white text-center" >
                    Назови имя домашнего питомца
                  </h2>
                  <p className="text-purple-300 text-center text-xs sm:text-sm" >
                    Если питомца нет — оставь поле пустым
                  </p>
                  <input
                    type="text"
                    value={userAnswers.petName}
                    onChange={(e) => setUserAnswers(prev => ({ ...prev, petName: e.target.value }))}
                    placeholder="Имя питомца (необязательно)"
                    className="w-full p-3 bg-slate-700 border-2 border-purple-400 rounded-xl text-white text-sm sm:text-base focus:outline-none focus:border-amber-400 transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={handleQuestionnaireNext}
                    className="w-full py-3 bg-green-500 hover:bg-green-400 text-black rounded-xl font-bold text-sm sm:text-base transition-all duration-200"
                  >
                    НАЧАТЬ ИГРУ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exit Button */}
      {gameState === "playing" && !showExitConfirm && (
        <button
          onClick={() => setShowExitConfirm(true)}
          className="absolute top-4 right-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold border-2 border-red-800 rounded transition-all duration-150 hover:scale-105 active:scale-95 z-10"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          ВЫЙТИ
        </button>
      )}

      {/* Exit Confirmation */}
      {showExitConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 animate-in fade-in duration-200">
          <div className="bg-amber-900/95 border-4 border-amber-500 rounded-xl p-6 max-w-md mx-4 text-center animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-amber-300 mb-4" >
              ВЫХОД ИЗ ИГРЫ
            </h3>
            <p className="text-lg text-amber-100 mb-6" >
              Уверен, что хочешь выйти? Тогда результат не сохранится(
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleExit}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold border-2 border-red-800 rounded transition-all"
              >
                ДА, ВЫЙТИ
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold border-2 border-green-800 rounded transition-all"
              >
                ПРОДОЛЖИТЬ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intro Screen */}
      {gameState === "intro" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600 p-4 animate-in fade-in duration-500">
          <div className="text-center mb-8">
            <h1 
              className="text-4xl md:text-6xl font-bold text-amber-300 mb-4 tracking-wider animate-in slide-in-from-top duration-700"
              style={{ textShadow: "4px 4px 0 #000" }}
            >
              Привет, {userAnswers.name}!
            </h1>
            <p 
              className="text-xl md:text-2xl text-white mb-2 animate-in slide-in-from-bottom duration-700 delay-200"
              style={{ textShadow: "2px 2px 0 #000" }}
            >
              Готов узнать свой страховой портрет?
            </p>
            <p 
              className="text-lg text-amber-100 animate-in fade-in duration-700 delay-500"
            >
              Пройди 5 жизненных ситуаций и узнай, какой ты тип
            </p>
          </div>

          <div 
            className="bg-amber-900/80 border-4 border-amber-500 rounded-xl p-6 max-w-lg mx-4 mb-8 animate-in zoom-in-95 duration-500 delay-300"
          >
            <h3 className="text-xl font-bold text-amber-300 mb-4" >
              Управление:
            </h3>
            <div className="text-amber-100 space-y-2" >
              <p>Стрелки / WASD - Движение</p>
              <p>Пробел - Прыжок</p>
              <p>Shift - Взаимодействие с иконками</p>
            </div>
          </div>

          <button
            onClick={startGame}
            className="px-10 py-5 bg-green-600 hover:bg-green-500 text-white text-2xl font-bold border-4 border-green-800 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 animate-in zoom-in duration-500 delay-700"
            style={{ textShadow: "2px 2px 0 #000", boxShadow: "4px 4px 0 #000" }}
          >
            НАЧАТЬ ИГРУ
          </button>
        </div>
      )}

      {/* Situation Modal */}
      {gameState === "situation" && activeSituation && (
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-black/80 z-40 ${
            modalAnimation === "enter" ? "animate-in fade-in duration-300" : 
            modalAnimation === "exit" ? "animate-out fade-out duration-200" : ""
          }`}
        >
          <div 
            className={`bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-amber-500 rounded-2xl p-6 md:p-8 max-w-2xl mx-4 ${
              modalAnimation === "enter" ? "animate-in zoom-in-95 slide-in-from-bottom-4 duration-400" :
              modalAnimation === "exit" ? "animate-out zoom-out-95 slide-out-to-bottom-4 duration-200" : ""
            }`}
          >
            <div className="flex justify-center mb-4">
              <span 
                className="px-4 py-1 rounded-full text-white font-bold"
                style={{ 
                  backgroundColor: COLORS.situations[activeSituation.icon] || "#4A90D9",
                }}
              >
                {activeSituation.month}
              </span>
            </div>

            <h2 
              className="text-2xl md:text-3xl font-bold text-amber-300 text-center mb-4"
              style={{ textShadow: "2px 2px 0 #000" }}
            >
              {activeSituation.title}
            </h2>

            <p 
              className="text-lg text-gray-200 text-center mb-6 leading-relaxed"
            >
              {activeSituation.story}
            </p>

            <p 
              className="text-xl text-amber-200 text-center mb-6 font-bold"
            >
              {activeSituation.question}
            </p>

            <div className="space-y-3">
              {activeSituation.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 bg-slate-700 hover:bg-slate-600 border-2 border-slate-500 hover:border-amber-400 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <span 
                    className="text-gray-100 group-hover:text-white"
                  >
                    {answer.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Screen */}
      {gameState === "results" && finalProfile && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-50 overflow-auto p-4 animate-in fade-in duration-500">
          <div className="max-w-3xl w-full">
            <div className={`text-center mb-8 ${showResultsContent ? "animate-in slide-in-from-top duration-700" : "opacity-0"}`}>
              <h1 
                className="text-3xl md:text-5xl font-bold mb-4"
                style={{ 
                  textShadow: "3px 3px 0 #000",
                  color: PROFILE_INFO[finalProfile].color 
                }}
              >
                ТВОЯ ЖИЗНЬ БЕЗ СТРАХОВКИ
              </h1>
            </div>

            <div className={`flex flex-col md:flex-row items-center gap-8 mb-8 ${showResultsContent ? "animate-in slide-in-from-left duration-700 delay-300" : "opacity-0"}`}>
              <div className="w-48 h-56 rounded-xl border-4 overflow-hidden shadow-2xl flex-shrink-0" style={{ borderColor: PROFILE_INFO[finalProfile].color }}>
                <img
                  src={
                    finalProfile === "cautious"
                      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D1%82%D0%BE%D0%BF%D0%BB%D0%B5%D1%81-L83zKAuvicIJ8qTkYEcv1Lxb1wNgfu.png"
                      : finalProfile === "risky"
                      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D0%B4%D0%BE%D0%BB%D0%B8%D0%BD%D0%B0-XCjbk74jpvag1pmRymwpoAJH1TuqgK.png"
                      : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D0%BA%D0%BE%D1%82%D0%B5%D0%BD%D0%BE%D0%BA-IolIGPC0s8Z7yXID97Trb45YI0x2Nq.png"
                  }
                  alt={PROFILE_INFO[finalProfile].name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div 
                className="flex-1 bg-white rounded-2xl p-6 relative shadow-xl"
              >
                <div 
                  className="absolute -left-4 top-8 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent hidden md:block" 
                  style={{ borderRightColor: "#FFFFFF" }}
                />
                <p className="text-lg text-gray-800 leading-relaxed">
                  Привет, {userAnswers.name}! По твоим решениям я вижу, что ты — <strong style={{ color: PROFILE_INFO[finalProfile].color }}>{PROFILE_INFO[finalProfile].name}</strong>.
                </p>
                <p className="text-gray-600 mt-3">
                  {PROFILE_INFO[finalProfile].description}
                </p>
              </div>
            </div>

            <div className={`bg-slate-800 rounded-2xl p-6 border-4 border-red-500 mb-6 ${showResultsContent ? "animate-in zoom-in-95 duration-500 delay-500" : "opacity-0"}`}>
              <h3 className="text-xl text-center text-gray-300 mb-2" >
                Итоговая сумма потерь без страховки:
              </h3>
              <div className="text-center">
                <span 
                  className={`text-5xl md:text-6xl font-bold transition-all duration-500 ${showInsurance ? "text-green-400 line-through opacity-50" : "text-red-400"}`}
                >
                  {counterValue.toLocaleString("ru-RU")} ₽
                </span>
                {showInsurance && (
                  <div className="mt-4 animate-in slide-in-from-bottom duration-300">
                    <span className="text-4xl md:text-5xl font-bold text-green-400" >
                      {withInsuranceCost.toLocaleString("ru-RU")} ₽
                    </span>
                    <p className="text-green-300 mt-2" >
                      Экономия: {insuranceSavings.toLocaleString("ru-RU")} ₽
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className={`flex flex-col items-center mb-8 ${showResultsContent ? "animate-in fade-in duration-500 delay-700" : "opacity-0"}`}>
              <button
                onClick={() => setShowInsurance(!showInsurance)}
                className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                  showInsurance 
                    ? "bg-green-600 text-white border-4 border-green-400" 
                    : "bg-red-600 text-white border-4 border-red-400"
                }`}
              >
                {showInsurance ? "Со страховкой" : "Без страховки"}
              </button>
              <p 
                className="mt-2 text-amber-300 animate-pulse"
              >
                Нажми
              </p>
            </div>

            <div className={`bg-gradient-to-r from-amber-900/80 to-amber-800/80 rounded-2xl p-6 border-2 border-amber-500 mb-6 ${showResultsContent ? "animate-in slide-in-from-bottom duration-500 delay-900" : "opacity-0"}`}>
              <p className="text-lg text-amber-100 text-center leading-relaxed" >
                {PROFILE_INFO[finalProfile].insuranceAdvice}
              </p>
              <p className="text-amber-200 text-center mt-4 text-xl font-bold" >
                Давай я расскажу тебе, как работает страхование именно с твоей точки зрения!
              </p>
            </div>

            <div className={`flex justify-center gap-4 flex-wrap ${showResultsContent ? "animate-in zoom-in duration-500 delay-1000" : "opacity-0"}`}>
              <button
                onClick={() => {
                  setGameState("questionnaire");
                  setQuestionStep(0);
                  setUserAnswers({ name: "", favoriteSubject: "", device: "", anxiety: "injury", petName: "" });
                }}
                className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white text-xl font-bold border-4 border-amber-800 rounded-xl transition-all duration-200 hover:scale-105"
                style={{ textShadow: "2px 2px 0 #000" }}
              >
                ИГРАТЬ СНОВА
              </button>
              <button
                onClick={() => {
                  const guideUrl = process.env.NEXT_PUBLIC_GUIDE_URL ?? "/guide";
                  window.open(guideUrl, "_blank", "noopener,noreferrer");
                }}
                className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white text-xl font-bold border-4 border-green-800 rounded-xl transition-all duration-200 hover:scale-105"
                style={{ textShadow: "2px 2px 0 #000" }}
              >
                ПРОЙТИ ГАЙД
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      {gameState === "playing" && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between md:hidden z-10">
          <div className="flex gap-2">
            <button
              onTouchStart={() => keysRef.current.add("arrowleft")}
              onTouchEnd={() => keysRef.current.delete("arrowleft")}
              className="w-14 h-14 bg-gray-800/80 border-2 border-gray-600 rounded-lg flex items-center justify-center text-white text-2xl active:bg-gray-700"
            >
              ←
            </button>
            <button
              onTouchStart={() => keysRef.current.add("arrowright")}
              onTouchEnd={() => keysRef.current.delete("arrowright")}
              className="w-14 h-14 bg-gray-800/80 border-2 border-gray-600 rounded-lg flex items-center justify-center text-white text-2xl active:bg-gray-700"
            >
              →
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onTouchStart={() => keysRef.current.add("shift")}
              onTouchEnd={() => keysRef.current.delete("shift")}
              className="w-14 h-14 bg-amber-700/80 border-2 border-amber-500 rounded-lg flex items-center justify-center text-white text-xs font-bold active:bg-amber-600"
            >
              Shift
            </button>
            <button
              onTouchStart={() => keysRef.current.add(" ")}
              onTouchEnd={() => keysRef.current.delete(" ")}
              className="w-14 h-14 bg-green-700/80 border-2 border-green-500 rounded-lg flex items-center justify-center text-white text-lg active:bg-green-600"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
