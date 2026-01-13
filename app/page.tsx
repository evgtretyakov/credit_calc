import Calculator from '@/components/Calculator/Calculator'
import styles from './page.module.scss'

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Калькулятор реструктуризации кредита</h1>
        <p>Примерный расчет платежа для клиента</p>
      </header>
      <main className={styles.main}>
        <Calculator />
      </main>
      <footer className={styles.footer}>
        <p>© 2026 СберБанк. Все расчеты являются предварительными.</p>
      </footer>
    </div>
  )
}