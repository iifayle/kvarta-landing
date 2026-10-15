import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Week from '@/components/Week';
import Catalog from '@/components/Catalog';
import Subscription from '@/components/Subscription';
import Delivery from '@/components/Delivery';
import LeadForm from '@/components/LeadForm';
import Team from '@/components/Team';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Header />
      <div className={styles.firstScreen} aria-hidden="true" />
      <Hero />
      <Week />
      <Catalog/>
      <Subscription/>
      <Delivery/>
      <LeadForm/>
      <Team />
      <Faq />
      <Footer />
    </main>
  )
}