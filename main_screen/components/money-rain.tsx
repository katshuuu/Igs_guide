"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface Bill {
  id: number;
  x: number;
  side: "left" | "right";
  rotation: number;
  delay: number;
  duration: number;
  scale: number;
  swayAmount: number;
}

interface MoneyRainProps {
  isActive: boolean;
  duration?: number;
}

/*
 * ═══════════════════════════════════════════════════════════════════════
 * НАСТРОЙКИ СКОРОСТИ И ТРАЕКТОРИИ КУПЮР:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * 1. СКОРОСТЬ ПАДЕНИЯ (duration в generateBills):
 *    - Меньше значение = быстрее падение
 *    - Текущее: 3 + Math.random() * 1.5 = 3-4.5 сек
 *    - Быстрее: 1.5 + Math.random() * 1 = 1.5-2.5 сек
 *    - Медленнее: 5 + Math.random() * 2 = 5-7 сек
 * 
 * 2. ЗАДЕРЖКА ПОЯВЛЕНИЯ (delay в generateBills):
 *    - Текущее: Math.random() * 2 = 0-2 сек
 *    - Все сразу: 0
 *    - Волнами: Math.random() * 3 = 0-3 сек
 * 
 * 3. ТРАЕКТОРИЯ К ЦЕНТРУ (swayAmount в generateBills):
 *    - Больше значение = сильнее смещение к центру
 *    - Текущее: 150 + Math.random() * 200 = 150-350px
 *    - Сильнее к центру: 250 + Math.random() * 300 = 250-550px
 *    - Меньше к центру: 50 + Math.random() * 100 = 50-150px
 * 
 * 4. ВРАЩЕНИЕ (rotate в animate):
 *    - Текущее: 360 градусов за время падения
 *    - Больше оборотов: 720 (2 оборота)
 *    - Меньше: 180 (пол-оборота)
 * 
 * 5. КОЛИЧЕСТВО КУПЮР (billCount):
 *    - Текущее: 30
 *    - Больше: 50-60
 *    - Меньше: 15-20
 * 
 * ═══════════════════════════════════════════════════════════════════════
 */

// Локальный ассет: мгновенно доступен, без сетевых задержек
const BILL_IMAGE_URL = "/images/money-bill.jpg";

export function MoneyRain({ isActive, duration = 4000 }: MoneyRainProps) {
  const [bills, setBills] = useState<Bill[]>([]);

  const generateBills = useCallback(() => {
    const newBills: Bill[] = [];
    const billCount = 60; // Количество купюр (меньше, но крупнее)

    for (let i = 0; i < billCount; i++) {
      const side = i % 2 === 0 ? "left" : "right";
      newBills.push({
        id: i,
        // Стартовые позиции: левые купюры слева (0-15%), правые справа (85-100%)
        x: side === "left" 
          ? Math.random() * 15
          : 85 + Math.random() * 15,
        side,
        rotation: -30 + Math.random() * 30, // Небольшой начальный наклон
        delay: Math.random() * 3, // Задержка до 2 сек для волнового эффекта
        duration: 1 + Math.random() * 1.5, // 3-4.5 сек падения
        scale: 0.9 + Math.random() * 0.4, // Крупнее: размер 0.9-1.3
        // Смещение к центру: от края к 50%
        swayAmount: side === "left" 
          ? 100 + Math.random() * 700  // Левые летят вправо к центру
          : -(100 + Math.random() * 700), // Правые летят влево к центру
      });
    }
    return newBills;
  }, []);

  useEffect(() => {
    if (isActive) {
      setBills(generateBills());
      
      // Очистка через duration
      const timer = setTimeout(() => {
        setBills([]);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setBills([]);
    }
  }, [isActive, duration, generateBills]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {bills.map((bill) => (
            <motion.div
              key={bill.id}
              className="absolute"
              style={{
                left: `${bill.x}%`,
                top: -120,
              }}
              initial={{ 
                y: -150, 
                rotate: bill.rotation,
                opacity: 0,
                scale: bill.scale,
              }}
              animate={{
                y: "110vh",
                // Траектория к центру с небольшим покачиванием
                x: [
                  0,
                  bill.swayAmount * 0.3,
                  bill.swayAmount * 0.6,
                  bill.swayAmount * 0.8,
                  bill.swayAmount,
                ],
                rotate: [
                  bill.rotation,
                  bill.rotation + (bill.side === "left" ? 45 : -45),
                  bill.rotation + (bill.side === "left" ? 90 : -90),
                  bill.rotation + (bill.side === "left" ? 180 : -180),
                  bill.rotation + (bill.side === "left" ? 360 : -360),
                ],
                opacity: [0, 1, 1, 1, 0.8, 0],
              }}
              transition={{
                duration: bill.duration,
                delay: bill.delay,
                ease: [0.25, 0.1, 0.25, 1],
                x: {
                  duration: bill.duration,
                  delay: bill.delay,
                  ease: "easeOut",
                },
                rotate: {
                  duration: bill.duration,
                  delay: bill.delay,
                  ease: "linear",
                },
              }}
              exit={{ opacity: 0 }}
            >
              {/* Купюра 5000 рублей - реальное изображение */}
              <div className="relative w-40 h-20 md:w-52 md:h-26 lg:w-64 lg:h-32">
                <img
                  src={BILL_IMAGE_URL}
                  alt="5000 рублей"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>
          ))}
          
          {/* Золотистое свечение для вау-эффекта */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.08) 40%, transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.4, 0.5, 0.3, 0] }}
            transition={{ duration: 3.5, ease: "easeOut" }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
