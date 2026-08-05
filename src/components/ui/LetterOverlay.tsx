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
            Aunque esta carta llegue un poco antes de tu cumplea&ntilde;os, quer&iacute;a
            ser de las primeras personas en decirte cu&aacute;nto deseo que tengas un
            muy feliz cumplea&ntilde;os n&uacute;mero <strong>19</strong>. Espero que Dios
            te regale muchos a&ntilde;os m&aacute;s, llenos de salud, felicidad, nuevas
            experiencias y personas que siempre te quieran ver sonre&iacute;r.
          </p>
          <p>
            No soy muy bueno escribiendo cartas. De hecho, esta es una de las
            primeras que hago, pero hoy quise escribir con el coraz&oacute;n. Tal vez no
            encuentre las palabras perfectas, pero cada una de ellas es
            completamente sincera.
          </p>
          <p>
            &iquest;En serio ya son 19 a&ntilde;os? &iexcl;Qu&eacute; r&aacute;pido pasa el tiempo! Todav&iacute;a
            recuerdo cuando habl&aacute;bamos de tantas cosas y ahora tengo la
            oportunidad de celebrar un cumplea&ntilde;os m&aacute;s contigo. Eso,
            sinceramente, me hace muy feliz.
          </p>
          <p>
            Espero que este peque&ntilde;o detalle te guste y que, cuando lo vuelvas
            a ver alg&uacute;n d&iacute;a, recuerdes este momento con una sonrisa.
          </p>
          <p>
            Este ser&aacute; tu &uacute;ltimo a&ntilde;o con el n&uacute;mero <strong>1</strong> al inicio
            de tu edad. Qu&eacute; bonito pensar que poco a poco est&aacute;s entrando en una
            nueva etapa de tu vida. Has vivido muchas experiencias y estoy seguro
            de que las mejores todav&iacute;a est&aacute;n por llegar.
          </p>
          <p>
            Hay algo que quiero decirte. A veces siento que crecer te da un poco
            de miedo, y la verdad es que es completamente normal. La
            incertidumbre del futuro puede hacernos dudar, preocuparnos o sentir
            que no estamos preparados. Pero no permitas que ese miedo sea m&aacute;s
            grande que tus sue&ntilde;os.
          </p>
          <p>
            Quiero que nunca olvides lo mucho que vales. Eres una persona
            inteligente, fuerte y muy capaz. Aunque a veces t&uacute; misma no lo notes,
            tienes la capacidad de lograr todo aquello que te propongas. Todav&iacute;a
            quedan muchas cosas por aprender y muchos retos por superar, pero
            estoy seguro de que podr&aacute;s con cada uno de ellos.
          </p>
          <p>
            Una de las cosas que m&aacute;s admiro de ti es la persona en la que te
            est&aacute;s convirtiendo. Sigue siendo esa Violeta que lucha por lo que
            quiere, que aprende de sus errores y que nunca deja de crecer. No
            dejes que nadie te haga creer lo contrario.
          </p>
          <p>
            Si pudiera pedir un solo regalo en tu cumplea&ntilde;os, ser&iacute;a que nunca
            dejaras de sonre&iacute;r. Tal vez no lo notes, pero tu sonrisa tiene la
            capacidad de alegrar mucho m&aacute;s de lo que imaginas.
          </p>
          <p>
            Y como una vez me dijiste, quiero seguir apoy&aacute;ndote siempre, ya sea
            de cerca o de lejos. Quiero estar presente en tus alegr&iacute;as, en tus
            metas y en esos momentos donde simplemente necesites que alguien crea
            en ti. Porque yo siempre creer&eacute; en ti.
          </p>
          <p>
            Tambi&eacute;n le pido a Dios que nos permita seguir compartiendo muchos
            momentos juntos, celebrar muchos cumplea&ntilde;os m&aacute;s y acompa&ntilde;arnos
            mientras cumplimos nuestros sue&ntilde;os. Ojal&aacute; pueda seguir
            regal&aacute;ndote peque&ntilde;os detalles, pero sobre todo, muchos recuerdos
            bonitos.
          </p>
          <p>
            No s&eacute; qu&eacute; nos depare el futuro, pero s&iacute; s&eacute; que deseo verte feliz,
            cumplir cada uno de tus sue&ntilde;os y sentirte orgullosa de la gran mujer
            en la que te est&aacute;s convirtiendo.
          </p>
          <p>
            Y aunque alguna vez puedas llegar a dudarlo, nunca dudes del enorme
            cari&ntilde;o y del amor que siento por ti. Gracias por permitirme
            compartir un pedacito de tu vida y por hacer que la m&iacute;a sea mucho m&aacute;s
            bonita desde que llegaste.
          </p>
          <p>
            <strong>Feliz cumplea&ntilde;os, mi princesa hermosa.</strong> Que Dios te
            bendiga siempre, cuide cada uno de tus pasos y haga realidad los
            deseos m&aacute;s bonitos de tu coraz&oacute;n.
          </p>
          <p className="pt-2 text-right italic" style={{ color: "#7a4536" }}>
            Con mucho cari&ntilde;o,
            <br />
            <strong>Atte.: Dany</strong>
            <br />
            <strong>Para: Violeta</strong>
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
