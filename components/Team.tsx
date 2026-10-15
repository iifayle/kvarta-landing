import styles from "./Team.module.css";

export default function Team() {
  return (
    <section
      id="kto-zharit"
      className={styles.team}
      aria-labelledby="team-title"
    >
      <div className={styles.inner}><div
          className={styles.photo}
          role="img"
          aria-label="Аня и Дима в мастерской на Короля, 9"
        />
        <div className={styles.content}>
          <h2 id="team-title" className={styles.title}>
            Кто жарит
          </h2>
          <p className={styles.text}>
            Аня и Дима. Оба раньше работали бариста. В 2019 завели свою
            обжарку — небольшую, на Короля, 9. С тех пор всё сами: выбираем
            зерно, жарим, фасуем, развозим.
          </p>
          <p className={styles.text}>
            Обжариваем по четвергам, партиями по 5 кг на барабанном ростере.
            Это не маркетинговый ход, а реальный объём: каждая партия проходит
            через руки. По пятницам развозим по Минску, или забирайте сами —
            тогда зерно у вас почти сразу с ростера.
          </p>
        </div>

        {/* Фото: /images/team.jpg. Пока файла нет, виден просто тёмный прямоугольник. */}
        
      </div>
    </section>
  );
}