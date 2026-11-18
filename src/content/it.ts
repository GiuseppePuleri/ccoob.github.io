import type { DeviceContent, DeviceId } from '../store/types'

export const copy = {
  brand: 'CrossCheck OOB',
  tagline: 'Il backup che resta sveglio',
  enter: 'Entra nella scena',
  attack: 'Simula Attacco IT',
  attackActive: 'Attacco IT in corso',
  excursion: 'Simula Sbalzo Termico',
  excursionActive: 'Sbalzo in corso',
  reset: 'Ripristina',
  confirm: 'Conferma',
  networkOnline: 'Rete IT: online',
  networkOffline: 'Rete IT: offline',
  tempLabel: 'Temperatura',
  links: {
    lora: 'LoRa',
    cellular: 'Cellulare',
    wifi: 'Wi-Fi',
  },
  linkState: {
    active: 'attivo',
    alert: 'allarme',
    down: 'spento',
  },
  smsTitle: 'Messaggio',
  smsBody: 'Sbalzo termico nel frigorifero. Il backup ha inviato l’avviso.',
  callTitle: 'Chiamata in arrivo',
  callBody: 'Nessuna conferma. Il gateway sta chiamando.',
  live: {
    intro: 'Scena pronta.',
    blackout: 'Rete IT spenta. Il canale di backup continua.',
    restored: 'Rete IT ripristinata.',
    drifting: 'La temperatura sta salendo.',
    sms: 'Avviso inviato allo smartphone.',
    call: 'Chiamata in corso.',
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
    body: 'L’acciaio scherma la rete interna. Il monitoraggio ordinario non entra. Il backup esce lo stesso, dalla porta.',
  },
  sensor: {
    title: 'Sensore interno',
    tagline: 'Dentro il metallo',
    body: 'Misura la temperatura dal ripiano e continua a trasmettere quando il resto della rete tace.',
  },
  gateway: {
    title: 'Gateway esterno',
    tagline: 'Fuori dal frigo',
    body: 'Raccoglie il segnale uscito dalla porta e lo porta sul telefono, senza passare dalla rete IT.',
  },
  router: {
    title: 'Rete nativa',
    tagline: 'Il sistema principale',
    body: 'Quando il router si spegne, il monitoraggio ordinario si interrompe. Il canale di backup no.',
  },
  smartphone: {
    title: 'Smartphone',
    tagline: 'Chi riceve l’allarme',
    body: 'SMS e chiamata arrivano qui, anche se la rete del sito è ferma.',
  },
}
