"use client";

import { motion } from "framer-motion";

interface LetterOverlayProps {
  onClose: () => void;
}

const sparkles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 3 + ((i * 7) % 5),
  left: 8 + ((i * 23) % 84),
  top: 10 + ((i * 31) % 78),
  delay: ((i * 11) % 20) / 10,
  color: ["#ffd77a", "#ff9fb8", "#fff6cf", "#a8e6ff"][i % 4],
}));

export function LetterOverlay({ onClose }: LetterOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <button
        aria-label="Cerrar carta"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(22, 28, 54, 0.2), rgba(31, 22, 18, 0.62))",
          backdropFilter: "blur(5px)",
        }}
        onClick={onClose}
      />

      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: sparkle.size,
            height: sparkle.size,
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            background: sparkle.color,
            boxShadow: `0 0 12px ${sparkle.color}`,
          }}
          animate={{ opacity: [0.15, 0.85, 0.15], y: [0, -14, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: sparkle.delay }}
        />
      ))}

      <motion.article
        className="relative max-h-[90dvh] w-full max-w-2xl overflow-hidden rounded-[20px] px-6 py-7 shadow-2xl sm:px-8"
        style={{
          background:
            "linear-gradient(180deg, #fff3d2 0%, #ffe0ad 48%, #ffc99a 100%)",
          border: "2px solid rgba(111, 63, 31, 0.2)",
          boxShadow: "0 28px 80px rgba(33, 19, 14, 0.35)",
        }}
        initial={{ y: 38, scale: 0.92, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 22, scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute left-0 top-0 h-2 w-full"
          style={{ background: "linear-gradient(90deg, #8c315b, #ff8f57, #ffd76b)" }}
        />

        <header className="mb-6 text-center">
          <motion.div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background: "#fff7ca",
              color: "#8c315b",
              boxShadow: "0 10px 24px rgba(140, 49, 91, 0.22)",
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-2xl">*</span>
          </motion.div>
          <p className="text-xs font-semibold uppercase" style={{ color: "#8c4b36", letterSpacing: 3 }}>
            Para ti
          </p>
        </header>

        <div
          className="max-h-[58dvh] space-y-4 overflow-y-auto pr-2"
          style={{
            color: "#40251c",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 14,
            lineHeight: 1.78,
          }}
        >
          <p>
            <strong>Para: Violeta</strong>
            <br />
            <strong>De: Dany</strong>
          </p>
          <p>
            Feliz cumpleaños a la niña más bella y especial para mí. Sé que
            todavía falta un poquito para que sea oficialmente tu cumpleaños,
            pero quería adelantarme y ser de los primeros en desearte un muy
            felices 19 años. Espero que Dios te regale mucha salud, felicidad y
            momentos que siempre recuerdes con una sonrisa.
          </p>
          <p>
            No soy muy bueno escribiendo cartas ni expresando todo lo que siento.
            Pero para esta ocasión hice mi mejor esfuerzo —aunque no me costó
            tanto porque te quiero, jaja—.
          </p>
          <p>
            ¿En serio ya son 19 años? Este es tu último año teniendo un “1” al
            inicio de tu edad. Sé que crecer y pensar en el futuro puede darte un
            poco de miedo, pero quiero recordarte que eres una princesa muy capaz,
            inteligente, valiosa y con un corazón increíble. No permitas que las
            dudas te hagan olvidar todo lo que puedes lograr. Confío mucho en ti
            y quiero ser una de esas personas que te recuerden lo especial que
            eres cuando tú misma no puedas verlo.
          </p>
          <p>
            Quiero estar contigo no solamente en los momentos bonitos, sino
            también cuando tengas miedo, dudas o simplemente necesites hablar con
            alguien. Quiero conocer tus sueños, tus metas, tus preocupaciones y
            todo lo que guardas en tu corazón. Deseo que conmigo puedas ser tú
            misma, sin miedo a ser juzgada.
          </p>
          <p>
            Hemos tenido algunos problemas, pero aun así seguimos aquí. Espero
            que no permitamos que las dificultades dañen lo bonito que estamos
            construyendo, sino que aprendamos a comunicarnos mejor, apoyarnos y
            crecer juntos. No puedo prometerte que todo será perfecto, pero sí
            que mis intenciones contigo son sinceras y que siempre trataré de dar
            lo mejor de mí.
          </p>
          <p>
            Como una vez me dijiste, quiero apoyarte siempre, ya sea de cerca o
            de lejos, en cada paso que des y en cada meta que quieras alcanzar.
            Quiero celebrar tus logros, animarte cuando algo no salga bien y
            acompañarte en cada nueva etapa que la vida nos permita compartir.
          </p>
          <p>
            También le pido a Dios que cuide tu vida, guíe tus pasos y te
            permita cumplir todos esos sueños que tienes. Le pido que podamos
            seguir compartiendo muchos momentos, celebrar más cumpleaños juntos y
            continuar construyendo algo bonito, sincero y duradero.
          </p>
          <p>
            Feliz cumpleaños, mi princesa hermosa. Estoy muy feliz de tenerte en
            mi vida y nunca dudes del cariño tan grande que siento por ti.
          </p>
          <p>
            <strong>Te quiero muchísimo. ❤️</strong>
          </p>
          <p className="pt-2 text-right italic" style={{ color: "#7a4536" }}>
            <strong>Con mucho cariño,</strong>
            <br />
            <strong>Dany</strong>
          </p>
        </div>

        <div className="mt-7 flex justify-center">
          <motion.button
            className="rounded-full px-7 py-2.5 text-sm font-semibold"
            style={{
              background: "#8c315b",
              color: "#fff7d6",
              boxShadow: "0 10px 24px rgba(140, 49, 91, 0.28)",
            }}
            onClick={onClose}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            volver al jardin
          </motion.button>
        </div>
      </motion.article>
    </motion.div>
  );
}
