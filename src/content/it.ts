import type { DeviceContent, DeviceId } from '../store/types'

export const copy = {
  brand: 'CrossCheck OOB',
  tagline: 'Il backup che resta sveglio',
  enter: 'Entra nella scena',
  excursion: 'Simula Sbalzo Termico',
  excursionActive: 'Sbalzo in corso',
  reset: 'Ripristina',
  confirm: 'Conferma',
  close: 'Chiudi',
  tempLabel: 'Temperatura',
  links: {
    lora: 'LoRa',
    cellular: 'Cellulare',
  },
  linkState: {
    active: 'attivo',
    alert: 'allarme',
    standby: 'pronto',
  },
  escalationTitle: 'Escalation di sicurezza',
  escalation: {
    email: { label: 'Email', body: 'Soglia superata. L’avviso parte via email.' },
    sms: { label: 'SMS', body: 'Nessuna conferma. Parte l’SMS.' },
    call: { label: 'Chiamata', body: 'Ancora nessuna conferma. Il gateway chiama.' },
  },
  /** Testi disegnati sullo schermo dello smartphone in scena. */
  phoneScreen: {
    clock: '09:41',
    listening: 'in ascolto',
    rising: 'in salita',
    confirmed: 'Allarme confermato',
    now: 'ora',
    email: {
      kicker: 'EMAIL',
      title: 'Allarme temperatura',
      lines: ['Frigorifero oltre soglia.', 'Conferma la ricezione.'],
    },
    sms: {
      kicker: 'SMS',
      title: 'CrossCheck OOB',
      lines: ['Sbalzo termico in corso.', 'Nessuna conferma ricevuta.'],
    },
    call: {
      lines: ['Chiamata vocale', 'in arrivo'],
      decline: 'Rifiuta',
      answer: 'Rispondi',
    },
  },
  live: {
    intro: 'Scena pronta.',
    drifting: 'La temperatura sta salendo.',
    email: 'Email di allarme inviata.',
    sms: 'Nessuna conferma. SMS inviato.',
    call: 'Nessuna conferma. Chiamata vocale in corso.',
    acknowledged: 'Allarme confermato. La temperatura rientra.',
    reset: 'Scena riportata al funzionamento normale.',
  },
  fallbackTitle: 'WebGL non disponibile',
  fallbackBody: 'Questa presentazione ha bisogno di un browser con WebGL attivo.',
  devicesNav: 'Dispositivi',
} as const

export const deviceCopy: Record<DeviceId, DeviceContent> = {
  fridge: {
    title: 'Frigorifero',
    tagline: 'Gabbia di Faraday',
    body: 'L’acciaio scherma i segnali radio. Il sensore di backup trasmette lo stesso: il segnale esce dalla porta.',
  },
  sensor: {
    title: 'Sensore interno',
    tagline: 'Dentro il metallo',
    body: 'Fissato alla parete interna, misura la temperatura reale e continua a trasmettere quando il resto della rete tace.',
  },
  gateway: {
    title: 'Gateway esterno',
    tagline: 'Fuori dal frigo',
    body: 'Raccoglie il segnale uscito dalla porta e lo invia sulla rete cellulare, senza passare dalla rete IT.',
  },
  smartphone: {
    title: 'Smartphone',
    tagline: 'Chi riceve l’allarme',
    body: 'Email, SMS e chiamata arrivano qui in sequenza, anche se la rete del sito è ferma.',
  },
}
