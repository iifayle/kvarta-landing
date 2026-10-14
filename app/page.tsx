import Header from '@/components/Header'
import Hero from '@/components/Hero'
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Header />
      <div className={styles.firstScreen} aria-hidden="true" />
      <Hero />
    </main>
  )
}