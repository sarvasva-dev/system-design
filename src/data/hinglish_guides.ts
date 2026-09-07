export interface HinglishChapterGuide {
  chapterId: string;
  desiTitle: string;
  oneLiner: string;
  whyNeeded: string;
  realLifeAnalogy: {
    scenario: string;
    explanation: string;
  };
  threeGoldenRules: string[];
  keyTermsHinglish: {
    term: string;
    englishMeaning: string;
    aasanBhasha: string;
    desiExample: string;
  }[];
  conceptHinglish: Record<string, {
    aasanTitle: string;
    simpleExplanation: string;
    desiExample: string;
    proTip: string;
  }>;
}

export const HINGLISH_CHAPTER_GUIDES: Record<string, HinglishChapterGuide> = {
  'part0-mindset': {
    chapterId: 'part0-mindset',
    desiTitle: 'System Design Ka Asli Funda — Sochne Ka Tareeka',
    oneLiner: 'Chhoti app koi bhi bana leta hai, par jab 10 lakh log ek saath app kholein aur server na mare — usko bolte hain System Design!',
    whyNeeded: 'Jab aap laptop pe code likhte ho to sab mast chalta hai. Lekin reality mein servers crash hote hain, internet slow hota hai, aur database par load aane se app atakti hai. Isliye pehle se planning zaroori hai.',
    realLifeAnalogy: {
      scenario: 'Chai Ki Tapri vs Shaadi Ka Grand Buffet',
      explanation: 'Agar 5 log chai peene aayein, to 1 banda akele bana lega. Lekin agar 5,000 log shaadi mein aa gaye, to 1 aadmi nahi sambhal payega! Aapko alag-alag counter (Load Balancer), pehle se bani hui samosa tray (Cache), aur alag-alag chai ke bartan (Sharding) lagane padenge.'
    },
    threeGoldenRules: [
      'Pehle Requirements Clear Karo: Pehle pucho ki kya banana hai (Features) aur kitna fast chalna chahiye (Scale/Latency). Andhadhun coding mat shuru karo!',
      'Silver Bullet Kuchh Nahi Hota: Har decision mein Trade-off hota hai — ya to fast chalega aur paisa jyada lagega, ya sasta hoga par thoda slow.',
      'Har Cheez Fail Hogi: Maan ke chalo ki hard disk udegi, internet katega, aur server down hoga. System aisa banao jo fir bhi chalta rahe.'
    ],
    keyTermsHinglish: [
      {
        term: 'Throughput (QPS / RPS)',
        englishMeaning: 'Queries or requests processed per second',
        aasanBhasha: 'Ek second mein aapka server kitne logon ki request nipta sakta hai.',
        desiExample: 'Toll plaza par 1 second mein kitni gaadiyan cross kar rahi hain.'
      },
      {
        term: 'Latency',
        englishMeaning: 'Time delay between request and response',
        aasanBhasha: 'Aapne button dabaya aur screen par result aane mein kitna time (milliseconds) laga.',
        desiExample: 'Swiggy par "Order Now" dabane se leke "Order Placed" ka tick aane tak ka delay.'
      },
      {
        term: 'High Availability (Uptime)',
        englishMeaning: 'System remains operational without interruption',
        aasanBhasha: 'App 24 ghante 365 din chalni chahiye, kabhi "Server Down" ka board na dikhe.',
        desiExample: 'Jaise hospital ka emergency ward — 24 ghante khula rehta hai.'
      },
      {
        term: 'Single Point of Failure (SPOF)',
        englishMeaning: 'A single component that halts the whole system if it fails',
        aasanBhasha: 'Aisi kamzor kadi jiske girte hi pura system thapp ho jaye.',
        desiExample: 'Puri bus mein 1 hi driver hai — agar use chakkar aa gaya to puri bus ruk jayegi! Isliye 2nd backup driver hona chahiye.'
      }
    ],
    conceptHinglish: {
      'Functional vs. Non-Functional Requirements': {
        aasanTitle: 'App Karti Kya Hai vs App Kitni Mazboot Hai',
        simpleExplanation: 'Functional Matlab: App ke features (jaise photo upload, like button). Non-Functional Matlab: App kitni tez hai, kitna load jhel sakti hai aur hack na ho.',
        desiExample: 'Car mein steering aur breaks hona Functional requirement hai. Car 150 km/h par bhi shake na kare aur accident mein bacha le, ye Non-Functional requirement hai.',
        proTip: 'Interview mein pehle Functional pucho, fir turant pucho: "Kitne active users honge aur kitna latency acceptable hai?"'
      },
      'Latency vs. Throughput': {
        aasanTitle: 'Kitna Tez vs Kitna Zyada',
        simpleExplanation: 'Latency matlab ek kaam mein kitna time lagta hai. Throughput matlab ek ghante ya second mein kul kitna kaam ho sakta hai.',
        desiExample: 'Ek bullet train mein 1 aadmi 2 ghante mein Delhi se Kanpur pahunch gaya (Low Latency). Par ek lambi maal gaadi ne ek baar mein 5000 ton koyla transport kar diya (High Throughput).',
        proTip: 'Dono ek saath badhana mushkil hota hai — batching karne se throughput badhta hai par latency thodi badh sakti hai.'
      },
      'Availability vs. Consistency (The CAP Trade-Off Preview)': {
        aasanTitle: 'Hamesha Chalu Raho vs Hamesha Sahi Data Dikhao',
        simpleExplanation: 'Availability ka matlab app kabhi band na ho. Consistency ka matlab har user ko 100% updated sachha data dikhe.',
        desiExample: 'ATM se paise nikal rahe ho to Consistency chahiye (galat balance nahi chalega). Par Instagram pe kisi ki reel ke like count 10 second purane dikh jayein to chalega (Availability jyada zaroori hai).',
        proTip: 'Banking mein Consistency chuno, Social Media mein Availability chuno.'
      },
      'Capacity Estimation (Back-of-the-Envelope Calculations)': {
        aasanTitle: 'Kharcha Aur Scale Ka Pehle Andaza Lagana',
        simpleExplanation: 'App banane se pehle hisaab lagao: Kitne users aayenge? Kitni GB memory lagegi? Kitna internet bandwidth chahiye?',
        desiExample: 'Ghar mein party dene se pehle plate aur rasogulle ka hisaab lagana taaki khana kam na pade ya waste na ho.',
        proTip: 'Thumb rule: 1 Day = 86,400 seconds (~100,000 maan lo calculation easy karne ke liye). 1 Million req/day = ~12 requests/second.'
      }
    }
  },

  'part1-networking': {
    chapterId: 'part1-networking',
    desiTitle: 'Networking & Protocols — Internet Ka Sadak Aur Paani Ka Pipeline',
    oneLiner: 'Data hawa mein jadu se nahi udta — cables, routers aur rules (protocols) ke zariye travel karta hai.',
    whyNeeded: 'Jab user mobile par button dabata hai, to data America ya Mumbai ke server tak kaise pahunchta hai bina khoe? Ye networking sikhata hai.',
    realLifeAnalogy: {
      scenario: 'Chitthi Bhejna (Postal Service) vs Phone Call',
      explanation: 'TCP ek phone call ki tarah hai: pehle "Hello, sun rahe ho?", samne wala bola "Haan sun raha hoon", fir baat shuru (Handshake). UDP ek postcard ki tarah hai: bas bhej diya, pahuncha ya raste mein bheeg gaya, bhejne wale ko parwah nahi (Streaming/Gaming).'
    },
    threeGoldenRules: [
      'TCP Guarantee Deta Hai, UDP Speed Deta Hai: Jahan ek ek byte zaroori ho (Payment/Chat) wahan TCP. Jahan real-time video/gaming ho wahan UDP.',
      'DNS Phonebook Hai: IP address (142.250.190.46) yaad nahi rehta, isliye google.com likhte hain. DNS use IP mein badal deta hai.',
      'TLS / HTTPS Se Taaza Tala Lagao: Bina HTTPS ke raste mein WiFi wala banda aapka password padh sakta hai.'
    ],
    keyTermsHinglish: [
      {
        term: 'DNS (Domain Name System)',
        englishMeaning: 'Translates domain names to IP addresses',
        aasanBhasha: 'Internet ki phone directory jo "zomato.com" ko uske server ke IP address se jodti hai.',
        desiExample: 'Aapne phone mein "Mummy" naam save kiya, dial karte waqt phone unka 10-digit number lagata hai.'
      },
      {
        term: 'TCP Handshake (SYN -> SYN-ACK -> ACK)',
        englishMeaning: '3-step connection setup ensuring reliability',
        aasanBhasha: 'Dono taraf se pehle connection pakka karna: 1. Main bolu? 2. Haan bolo. 3. Theek hai bol raha hoon!',
        desiExample: 'Walkie-talkie par "Over" aur "Copy that" bolke confirm karna.'
      },
      {
        term: 'HTTP/2 vs HTTP/1.1 (Multiplexing)',
        englishMeaning: 'Sending multiple requests over a single TCP connection',
        aasanBhasha: 'HTTP/1.1 mein har photo ke liye nayi gaadi aati thi. HTTP/2 mein ek hi badi train mein saari photos ek saath load ho gayi.',
        desiExample: 'Dukaan se 5 cheezein lani hain — 5 alag chakkar lagane ke badle 1 hi thele mein sab le aana.'
      }
    ],
    conceptHinglish: {
      'TCP vs. UDP: Connection Semantics & Mechanics': {
        aasanTitle: 'Pakka Delivery (TCP) vs Fatafat Delivery (UDP)',
        simpleExplanation: 'TCP check karta hai ki har packet pahuncha ya nahi. Agar koi packet gir gaya to dobara bhejega. UDP bas phenkta rehta hai, fast hai par loss ho sakta hai.',
        desiExample: 'TCP = Registered Post (Sign karwana zaroori hai). UDP = Hawa mein patang udana ya FM Radio sunna.',
        proTip: 'Zoom call ya PUBG gaming mein UDP use hota hai taaki lag na ho; WhatsApp message mein TCP use hota hai.'
      },
      'DNS Resolution Path & Anycast Routing': {
        aasanTitle: 'Sabse Paas Wale Server Tak Pahunchne Ka Rasta',
        simpleExplanation: 'Jab aap google.com kholte ho to browser sabse paas wale data center ka pata nikalta hai taaki round-trip time kam se kam ho.',
        desiExample: 'Swiggy aapko 2 km dur wale Domino\'s se pizza bhejta hai, 50 km dur wale se nahi.',
        proTip: 'Anycast routing se DDoS attacks bhi fail ho jate hain kyunki traffic alag-alag global locations mein divide ho jata hai.'
      }
    }
  },

  'part2-backend': {
    chapterId: 'part2-backend',
    desiTitle: 'Backend Architecture — Monolith vs Microservices & APIs',
    oneLiner: 'Saara code ek hi bade bartan mein pakayein, ya alag-alag chulhe jalaayein? Iska decision lena backend design hai.',
    whyNeeded: 'Jab team badi hoti hai aur app mein 100 features jud jaate hain, to ek banda galti kare to puri app crash na ho.',
    realLifeAnalogy: {
      scenario: 'Sab-Kuch-Ek-Mein Departmental Store vs Supermarket Stalls',
      explanation: 'Monolith ek aisi dukaan hai jahan 1 hi counter pe kapde, sabzi, dawa sab bikti hai. Dukan me aag lagi to sab band. Microservices mein kapde ki dukaan alag, chemist alag, sabzi alag — ek dukan band bhi ho to baaki khuli rehti hain!'
    },
    threeGoldenRules: [
      'Pehle Monolith Se Shuru Karo: Chhoti app ko faltu mein 20 microservices mein mat todo — network latency aur deployment ka sar-dard ho jayega.',
      'Async Queues Ka Use Karo: Email bhejna ya PDF generate karna user ke raaste mein mat roko; background queue (RabbitMQ/Kafka) mein daal do.',
      'APIs Mein Versioning Zaroori Hai: /v1/users ko kabhi bina bataye change mat karo, purane mobile apps crash ho jayenge.'
    ],
    keyTermsHinglish: [
      {
        term: 'Load Balancer (Nginx / ALB)',
        englishMeaning: 'Distributes network traffic evenly across server fleet',
        aasanBhasha: 'Traffic police wala jo aane wali gaadiyon ko khali lanes mein bhejta hai taaki koi ek server choke na ho.',
        desiExample: 'Bank mein aate hi guard bolta hai: "Aap counter 2 pe jao, aap counter 4 pe jao."'
      },
      {
        term: 'Message Queue (Kafka / RabbitMQ)',
        englishMeaning: 'Asynchronous buffer decoupling producers from consumers',
        aasanBhasha: 'Ek dabba jisme kaam ki parchi daal di jati hai, aur worker aaram se ek-ek karke kaam nipta leta hai.',
        desiExample: 'Restaurant mein waiter order lekar kitchen ki clip par tang deta hai aur agle customer ke paas chala jata hai.'
      },
      {
        term: 'Idempotency Key',
        englishMeaning: 'Ensuring an operation produces the same result if retried',
        aasanBhasha: 'Ye ensure karna ki agar network error ki wajah se user ne 2 baar "Pay" dabaya, to paise 1 hi baar katein.',
        desiExample: 'Metro token: Ek baar gate se nikalne ke baad token use ho gaya, dubara tap karne par extra ticket nahi banti.'
      }
    ],
    conceptHinglish: {
      'Monolithic vs. Microservices Architecture': {
        aasanTitle: 'Ek Badi Thali vs Alag Alag Katori',
        simpleExplanation: 'Monolith mein sab code ek repo aur ek deployable file mein hota hai — fast development. Microservices mein alag services hoti hain jo network (gRPC/HTTP) par baat karti hain.',
        desiExample: 'Monolith = Ghar ka joint family kitchen. Microservices = Food Court jahan Burger King aur Subway alag independent stall hain.',
        proTip: 'Jab tak team mein 30+ engineers na hon aur domain clearly divided na ho, tab tak Microservices par mat kudo!'
      }
    }
  },

  'part3-databases': {
    chapterId: 'part3-databases',
    desiTitle: 'Databases & Storage — SQL vs NoSQL, ACID & Indexing',
    oneLiner: 'Data ko memory (RAM) se hard drive par safe rakhna taaki power cut hone par bhi 1 rupaye ka hisaab na ghoome.',
    whyNeeded: 'RAM fast hoti hai par computer restart hone par saaf ho jati hai. Database disk par permanently data save karta hai aur queries ko fast search karta hai.',
    realLifeAnalogy: {
      scenario: 'Bahi-Khata (Ledger) vs Book Ke Peeche Ka Index',
      explanation: 'Agar 1000 pages ki book mein "Kashmir" dhoondhna ho to page 1 se 1000 tak padhoge to 2 ghante lagenge (Table Scan). Lekin book ke aakhri page par "Index" dekh loge to 2 second mein page 412 par pahunch jaoge (Database Indexing / B-Tree).'
    },
    threeGoldenRules: [
      'Index Ke Bina Query Mat Likho: Jahan `WHERE user_id = 42` ho, wahan `user_id` par B-Tree index hona compulsory hai!',
      'ACID Banking Ke Liye, NoSQL Scale Ke Liye: Jahan paisa ho wahan Postgres/MySQL (ACID). Jahan chat history ya IoT sensors ka massive data ho wahan Cassandra/MongoDB.',
      'Indexes Ka Kharcha Hota Hai: Index read fast karta hai, lekin har `INSERT` aur `UPDATE` ko slow kar deta hai kyunki index ko bhi update karna padta hai.'
    ],
    keyTermsHinglish: [
      {
        term: 'B-Tree Index',
        englishMeaning: 'Balanced search tree for logarithmic lookups',
        aasanBhasha: 'Aisa sorted structure jisse lakhon records mein se aapka record sirf 3-4 steps mein mil jata hai.',
        desiExample: 'Dictionary mein word dhoondhna — pehle beech se khola, aage ya peeche check kiya.'
      },
      {
        term: 'ACID Transactions',
        englishMeaning: 'Atomicity, Consistency, Isolation, Durability guarantees',
        aasanBhasha: 'Guaranteed sachai: Ya to pura kaam hoga, ya bilkul nahi hoga. Beech mein aatke bina roll-back ho jayega.',
        desiExample: 'A ke account se 500 kate to B ke account mein 500 judne hi chahiye. Beech mein server band hua to paise wapas A ke paas!'
      },
      {
        term: 'WAL (Write-Ahead Log)',
        englishMeaning: 'Append-only log written to disk before modifying data pages',
        aasanBhasha: 'Main diary mein pakki entry karne se pehle turant diary ke panne pe kacchi entry thok dena.',
        desiExample: 'Dukaan par bheed ho to pehle rough copy mein likh liya, shaam ko aaram se computer mein charhaya.'
      }
    ],
    conceptHinglish: {
      'Relational (RDBMS) vs. Non-Relational (NoSQL)': {
        aasanTitle: 'Table-Wala Database vs Document-Wala Database',
        simpleExplanation: 'SQL (Postgres, MySQL) tables aur relations par chalta hai, strict schema hota hai. NoSQL (Mongo, DynamoDB) flexible JSON documents ya Key-Value pairs store karta hai.',
        desiExample: 'SQL = Excel sheet jisme columns fix hain. NoSQL = Folder jisme alag-alag papers rakhe hain jinme thodi alag information ho sakti hai.',
        proTip: 'Agar data mein heavy relations aur transactions hain to SQL chuno. Agar horizontal scale aur simple lookups hain to NoSQL chuno.'
      }
    }
  },

  'part4-db-scaling': {
    chapterId: 'part4-db-scaling',
    desiTitle: 'Database Scaling — Sharding, Replication & Partitions',
    oneLiner: 'Jab ek database server ki hard drive aur CPU bhar jaye, to data ko 10 alag computers par kaise baantein?',
    whyNeeded: 'Duniya ka sabse bada server khareed loge tab bhi ek limit ke baad wo hang ho jayega. Isliye data ko divide karna padta hai.',
    realLifeAnalogy: {
      scenario: 'Puri City Ki Ek Phone Book vs 4 Alag Volumes',
      explanation: 'Agar Mumbai city ke sabhi logon ke numbers ek hi moti kitaab mein daalein to kitaab 100 kg ki ho jayegi aur phat jayegi. Isliye 4 kitabein banayi: A-F, G-M, N-S, T-Z. Har kitaab ek alag "Shard" hai!'
    },
    threeGoldenRules: [
      'Read Replica Banao: 90% apps mein Read zyada hota hai, Write kam. Ek Master server pe Write karo, 3 Read-only replicas par Read baanto.',
      'Sharding Key Bahut Dhyan Se Chuno: Agar galat sharding key chuni to saara traffic ek hi server par aayega (Hotspot) aur wo crash ho jayega.',
      'Cross-Shard Queries Se Bacho: Aisi query mat likho jisko 5 alag-alag shards se data join karna pade, ye bohot slow hoti hai.'
    ],
    keyTermsHinglish: [
      {
        term: 'Database Sharding',
        englishMeaning: 'Horizontally partitioning database across multiple servers',
        aasanBhasha: 'Data ke tukde karke alag-alag database servers par rakhna taaki koi ek server overload na ho.',
        desiExample: 'Library mein saari kitabein ek hi kamre mein na rakh ke alag-alag floors par baant dena.'
      },
      {
        term: 'Hotspot Partition Problem',
        englishMeaning: 'Disproportionate load hitting a single shard',
        aasanBhasha: 'Jab sabhi users ka traffic sirf ek hi shard par toot pade aur baaki shard khali baithe rahein.',
        desiExample: 'Celebrity (jaise Virat Kohli ya Shahrukh Khan) ka account jis shard par hoga, wahan achanak karodon comments aane lagenge!'
      }
    ],
    conceptHinglish: {
      'Read Replicas vs. Horizontal Sharding': {
        aasanTitle: 'Copy Banana (Replication) vs Tukde Karna (Sharding)',
        simpleExplanation: 'Replication mein har server ke paas pura data hota hai (sirf read speed badhane ke liye). Sharding mein data ke tukde alag-alag servers ke paas hote hain (storage aur write badhane ke liye).',
        desiExample: 'Replication = Ek hi paper ki photocopy baantna. Sharding = Ek lambi novel ke 3 hisse karke 3 doston ko alag-alag padhne dena.',
        proTip: 'Hamesha pehle Read Replicas lagao. Sharding aakhri rasta hona chahiye jab data disk par fit na aa raha ho.'
      }
    }
  },

  'part5-caching': {
    chapterId: 'part5-caching',
    desiTitle: 'Caching Strategies — Redis, Memcached & Speed Ka Jaadu',
    oneLiner: 'Database slow hai, RAM super fast hai — baar-baar maangi jane wali cheezein RAM mein chipka do!',
    whyNeeded: 'Hard disk se data nikalne mein 10-20 milliseconds lagte hain. RAM (Redis) se data nikalne mein 0.5 millisecond lagta hai. Caching se app 50 guna fast ho jati hai.',
    realLifeAnalogy: {
      scenario: 'Store Room vs Kitchen Ka Masala Box',
      explanation: 'Namak, mirchi aur haldi kitchen ke counter pe rakhi hoti hai kyunki har sabzi mein chahiye (Cache). Chawal ki 50 kg bori store room mein rakhi hai (Database). Baar-baar store room daudoge to thak jaoge!'
    },
    threeGoldenRules: [
      'Cache-Aside Pattern Sabse Safe Hai: Pehle Redis mein check karo. Mil gaya to (Hit) wahi se return. Nahi mila to (Miss) DB se laao aur Redis mein daal do.',
      'TTL (Time-To-Live) Hamesha Lagao: Har cache key ki expiry date honi chahiye, warna purana data forever pada rahega.',
      'Cache Invalidations Sabse Badi Musibat Hai: Jab database mein data update ho, to purana cache delete karna mat bhoolna!'
    ],
    keyTermsHinglish: [
      {
        term: 'Cache Hit vs Cache Miss',
        englishMeaning: 'Finding data in cache vs needing to query database',
        aasanBhasha: 'Cache Hit = Data RAM mein mil gaya (super fast). Cache Miss = Data nahi mila, ab DB se lana padega (slow).',
        desiExample: 'Pocket mein chhute paise mil gaye (Hit). Pocket khali nikli to ATM jana pada (Miss).'
      },
      {
        term: 'LRU Eviction (Least Recently Used)',
        englishMeaning: 'Dropping oldest unaccessed items when memory fills up',
        aasanBhasha: 'Jab RAM bhar jaye, to jo cheez sabse lambe time se kisi ne nahi maangi, use bahar phek do.',
        desiExample: 'Almari bhar gayi to wo kapda kudedaan mein daal diya jo pichle 2 saal se nahi pehna.'
      }
    ],
    conceptHinglish: {
      'Cache-Aside (Lazy Loading)': {
        aasanTitle: 'Maangne Par RAM Mein Lana',
        simpleExplanation: 'Jab user data maange, tabhi cache mein dhoondho. Nahi mila to DB se la kar cache mein rakh lo agle user ke liye.',
        desiExample: 'Dukaan wala pehli baar customer ke kehne par godown se soap laya, aur fir 2 dabbe counter pe hi rakh liye.',
        proTip: 'Most popular pattern hai. Simple hai aur sirf wahi data cache hota hai jo sach mein users demand karte hain.'
      }
    }
  },

  'part6-cache-stampede': {
    chapterId: 'part6-cache-stampede',
    desiTitle: 'Cache Stampede & Invalidation — Jab Cache Dhoka De',
    oneLiner: 'Agar 1 lakh log ek saath wahi maang rahe hon aur achanak cache expire ho jaye, to kya hoga? Pura database crash!',
    whyNeeded: 'Jab popular post ya match ka score cache se delete hota hai, to lakhon queries ek saath DB par girti hain (Thundering Herd). Isse bachna zaroori hai.',
    realLifeAnalogy: {
      scenario: 'Bank Ka Single Token Counter Tutna',
      explanation: 'Achanak bijli chali gayi aur counter wala bola "Sab log manager ke cabin mein line lagao!" Lakhon log ek chote se kamre mein ghus gaye aur gate toot gaya!'
    },
    threeGoldenRules: [
      'Distributed Mutex Lock Lagao: Sirf 1 worker ko DB mein query karne do, baaki sab 100ms wait karein.',
      'Probabilistic Early Expiration (XFetch): Cache key expire hone se pehle hi background mein naya data fetch kar lo.',
      'Jitter Add Karo: Saari cache keys ka TTL ek hi second pe expire mat hone do, unme thoda random time (+/- 30 sec) jod do.'
    ],
    keyTermsHinglish: [
      {
        term: 'Thundering Herd Problem',
        englishMeaning: 'Massive concurrent requests hitting database on cache expiry',
        aasanBhasha: 'Bina lock ke lakhon requests ka ek saath database par hamla bol dena.',
        desiExample: 'Dukan khulte hi saare log ek saath darwaze par toot padna.'
      }
    ],
    conceptHinglish: {
      'Distributed Locks for Cache Backfill': {
        aasanTitle: 'Sirf Ek Bande Ko Andar Jane Do (Lock Lagao)',
        simpleExplanation: 'Jab cache miss ho, to Redis mein ek lock le lo. Sirf 1 request DB se data layegi aur cache bharegi, baaki sab wait karengi.',
        desiExample: 'Toilet mein ek waqt par 1 hi aadmi jata hai aur andar se kundi laga leta hai, baaki line mein rehte hain.',
        proTip: 'Redis Redlock ya simple SETNX (Set if Not Exists) use karo with a 3-second timeout.'
      }
    }
  },

  'part7-storage': {
    chapterId: 'part7-storage',
    desiTitle: 'Distributed Storage — S3 Object Storage vs Hard Disk (Block vs File)',
    oneLiner: 'Database mein video ya 10MB ki photo daaloge to database ro dega — photos aur files ko S3 Object Storage mein daalo!',
    whyNeeded: 'Files bohot badi hoti hain. Agar database mein binary blob bharte gaye to database backup lene mein ghanton lagenge aur slow ho jayega.',
    realLifeAnalogy: {
      scenario: 'Tijori (DB) vs Bada Godown (Object Storage)',
      explanation: 'Tijori mein sirf cash aur zewar (important numbers/text) rakhe jate hain. Bada furniture ya gehun ki boriyaan (Videos/Images) tijori mein nahi ghusate, unke liye alag godown (AWS S3 / Cloud Storage) hota hai, aur tijori mein bas godown ki raseed (URL) rakhte hain!'
    },
    threeGoldenRules: [
      'Database Mein Images Mat Daalo: Postgres/MySQL mein image ka URL rakho, actual image S3 bucket mein save karo.',
      'Multipart Upload Karo: 100MB+ ki file ko tukdon mein upload karo, network break hua to shuru se upload nahi karna padega.',
      'Pre-signed URLs Use Karo: Client ko direct S3 par upload karne do, aapka backend server traffic mein beech mein nahi phasega.'
    ],
    keyTermsHinglish: [
      {
        term: 'Object Storage (S3 / GCS)',
        englishMeaning: 'Flat namespace storing unstructured data with unique key identifier',
        aasanBhasha: 'Asim (unlimited) storage jahan kitni bhi photos/videos daal do, bas ek URL se wapas mil jati hain.',
        desiExample: 'Google Drive ya Amazon S3 jahan file ka naam/URL diya aur file download ho gayi.'
      },
      {
        term: 'Pre-Signed URL',
        englishMeaning: 'Cryptographically signed temporary permission to upload/download',
        aasanBhasha: 'Aisa temporary pass jisse user seedha cloud godown mein file daal sake bina backend server ko pareshan kiye.',
        desiExample: 'Mall ka parking coupon jo 15 minute ke liye valid hai.'
      }
    ],
    conceptHinglish: {
      'Block vs. File vs. Object Storage': {
        aasanTitle: 'Hard Disk vs Folder vs Unlimited Cloud Godown',
        simpleExplanation: 'Block storage aapke computer ki internal fast SSD hai. File storage office ka shared folder hai. Object storage internet ka infinite digital godown hai.',
        desiExample: 'Block = Laptop ki C Drive. File = Shared Pendrive. Object = Google Photos.',
        proTip: 'Photos, videos, backups aur PDFs ke liye hamesha Object Storage (S3) hi use hota hai.'
      }
    }
  },

  'part9-containers-k8s': {
    chapterId: 'part9-containers-k8s',
    desiTitle: 'Containers & Kubernetes — "Mere Laptop Pe Chal Raha Tha" Ki Samasya Ka Ant',
    oneLiner: 'Apne code ko uske saare masala-papad ke sath ek tiffin (Docker Container) mein band kar do, taaki kisi bhi server par chale!',
    whyNeeded: 'Pehle developer bolta tha "Mere computer pe to chal raha tha, production server pe kyun crash hua?". Docker ne code aur environment ko ek dabba bana diya.',
    realLifeAnalogy: {
      scenario: 'Shipping Container (Malwahak Dabba) vs Shipping Crane (Kubernetes)',
      explanation: 'Pehle jahaz mein saaman khula laadte the to gir jata tha. Cargo container (Docker) aane ke baad koi bhi saaman kisi bhi jahaz ya train mein fit ho jata hai. Aur Kubernetes wo station master/crane operator hai jo 1000 containers ko automatic manage karta hai!'
    },
    threeGoldenRules: [
      'Containers Stateless Hone Chahiye: Container ke andar kabhi important files mat save karo, kyunki container kabhi bhi mar sakta hai.',
      'Health Checks Lagao (Liveness & Readiness): K8s ko batao ki container zinda hai ya hang ho gaya taaki wo use restart kar sake.',
      'Auto-scaling (HPA) Set Karo: Diwali sale par traffic 10x ho to K8s apne aap 5 naye containers khol de, raat ko band kar de.'
    ],
    keyTermsHinglish: [
      {
        term: 'Docker Image vs Container',
        englishMeaning: 'Blueprint vs Running instance',
        aasanBhasha: 'Image matlab recipe (blueprint). Container matlab banna hua garam khana (running process).',
        desiExample: 'Gulab jamun banane ka formula Image hai, katora bhar gulab jamun Container hai.'
      },
      {
        term: 'Kubernetes Pod',
        englishMeaning: 'Smallest deployable unit in Kubernetes',
        aasanBhasha: 'Ek chota sa dabba jisme 1 ya 2 containers milke rehte hain aur ek IP address share karte hain.',
        desiExample: 'Hostel ka ek kamra jisme 2 room partners rehte hain.'
      }
    ],
    conceptHinglish: {
      'Containers vs. Virtual Machines': {
        aasanTitle: 'Alag Ghar (VM) vs Ek Hi Ghar Mein Alag Kamre (Docker)',
        simpleExplanation: 'Virtual Machine pura naya computer banati hai (heavy, slow boot). Container ek hi OS kernel ko share karte hain (lightweight, 1 second mein start).',
        desiExample: 'VM = Puri nayi building khadi karna. Docker = Ek flat mein curtains daal kar privacy banana.',
        proTip: 'Production microservices hamesha Containers mein run hoti hain.'
      }
    }
  },

  'part15-auth-identity': {
    chapterId: 'part15-auth-identity',
    desiTitle: 'Auth & Identity — Login, Password, JWT & OAuth2 Ka Sach',
    oneLiner: 'Har request pe database se password verify karoge to server mar jayega — digitally signed Token (JWT) pakdao!',
    whyNeeded: 'Har user ko pehchanna aur verify karna ki wo kisi aur ka data na chura sake.',
    realLifeAnalogy: {
      scenario: 'Amusement Park Ka Wristband (JWT Token)',
      explanation: 'Park ke gate par ticket dikhayi to unhone haath par ek waterproof wristband baandh diya. Ab har jhule par ticket nahi dikhani padti, guard bas wristband par stamp dekh kar andar jaane deta hai (Stateless JWT Token)!'
    },
    threeGoldenRules: [
      'JWT Secret Key Kabhi Leak Mat Karo: Agar secret key leak hui to koi bhi fake Admin token bana sakta hai.',
      'Short-Lived Access Token + Refresh Token: Access token sirf 15 minute chale, taaki chori ho jaye to jyada nuksaan na ho.',
      'Passwords Kabhi Plain Text Mein Mat Rakho: Hamesha bcrypt / Argon2 se hash karke hi DB mein store karo.'
    ],
    keyTermsHinglish: [
      {
        term: 'JWT (JSON Web Token)',
        englishMeaning: 'Stateless cryptographically signed identity claim',
        aasanBhasha: 'Aisa digital certificate jisme likha hai "Ye User 42 hai", aur server ke secret sign lage hain.',
        desiExample: 'Aadhar Card ya Driving License jo koi bhi traffic police wala verify kar sakta hai bina RTO ko call kiye.'
      },
      {
        term: 'OAuth 2.0 ("Login with Google")',
        englishMeaning: 'Delegated authorization framework',
        aasanBhasha: 'Google ko apna password diye bina kisi teesri app ko access dena.',
        desiExample: 'Hotel ka Valet Parking Key: Car driver ko car chalane ki chabi dete ho, ghar ki tijori ki chabi nahi!'
      }
    ],
    conceptHinglish: {
      'Stateful Sessions vs. Stateless JWTs': {
        aasanTitle: 'Register Mein Entry Rakhna vs Digital Stamp Dena',
        simpleExplanation: 'Session mein server memory mein yaad rakhta hai ki kaun login hai (Redis session store chahiye). JWT mein token ke andar hi user ki ID digitally signed hoti hai, server ko memory mein kuchh rakhne ki zaroorat nahi.',
        desiExample: 'Session = Club ka bouncer list mein naam check karta hai. JWT = Digital barcode scan hota hai.',
        proTip: 'Distributed microservices mein JWT tokens sabse best perform karte hain.'
      }
    }
  },

  'part18-security': {
    chapterId: 'part18-security',
    desiTitle: 'Security, DDoS & Rate Limiting — Darwaze Par Security Guard',
    oneLiner: 'Agar koi hacker 1 second mein 1 lakh requests bhej kar server crash karne lage, to use kaise rokein?',
    whyNeeded: 'Hacking aur bots aapke paise aur servers dono khatam kar sakte hain. Security layer sabse aage honi chahiye.',
    realLifeAnalogy: {
      scenario: 'Metro Station Ka AFC Smart Gate',
      explanation: 'Metro ke gate par ek baar mein 1 hi banda card touch karke nikal sakta hai. Agar 500 log ek saath jor se dhakka denge to gate band ho jayega (Rate Limiting Token Bucket)!'
    },
    threeGoldenRules: [
      'Rate Limiting Zaroori Hai: Har IP address ko limit karo (e.g. max 100 requests per minute).',
      'WAF (Web Application Firewall) Lagao: SQL Injection aur malicious scripts ko application tak pahunchne se pehle hi block karo.',
      'HTTPS / TLS Sabhi Jagah: Internal microservices ke beech bhi mTLS (mutual TLS) se communication secure rakho.'
    ],
    keyTermsHinglish: [
      {
        term: 'Rate Limiting (Token Bucket)',
        englishMeaning: 'Restricting the rate of requests a client can make',
        aasanBhasha: 'Har user ki limit fix karna taaki koi akela banda server ka saara internet ya CPU na choos le.',
        desiExample: 'ATM se 1 din mein sirf 5 baar paise nikalne ki limit.'
      },
      {
        term: 'DDoS Attack (Distributed Denial of Service)',
        englishMeaning: 'Overwhelming target with massive flood of internet traffic',
        aasanBhasha: 'Hacker ke 10,000 infected computers milkar aapki website par ek saath hamla kar dete hain taaki asli users ke liye site band ho jaye.',
        desiExample: 'Dukaan ke darwaze par 500 nalle ladke khade ho gaye, na khud kuchh khareed rahe hain na kisi aur ko andar ghusne de rahe hain.'
      }
    ],
    conceptHinglish: {
      'Token Bucket Rate Limiting Algorithm': {
        aasanTitle: 'Baalti Mein Token Daalna Aur Nikalna',
        simpleExplanation: 'Ek baalti hai jisme har second 10 token girte hain. Har request aane par 1 token nikalta hai. Agar baalti khali ho gayi, to request reject ho jayegi (HTTP 429 Too Many Requests).',
        desiExample: 'Game parlor mein tokens: Token hai to game khelo, token khatam to line mein khade raho.',
        proTip: 'Redis mein `SET` aur `INCR` with TTL ya sliding window log se easily implement hota hai.'
      }
    }
  },

  'part19-performance-math': {
    chapterId: 'part19-performance-math',
    desiTitle: 'Performance Math — Latency Numbers & System Ki Ganit',
    oneLiner: 'System design koi andha tukka nahi hai — 4 simple numbers yaad rakhoge to interview mein exact calculations kar loge!',
    whyNeeded: 'Jab interviewer puche "Is architecture mein kitne servers lagenge?", to hawa mein teer mat maro; math se proof do.',
    realLifeAnalogy: {
      scenario: 'Toll Naka Math (Little\'s Law)',
      explanation: 'Agar toll plaza par 1 minute mein 60 gaadiyan aati hain (Arrival Rate = 1/sec), aur har gaadi ko nikalne mein 10 second lagte hain (Latency = 10s), to kisi bhi waqt toll naka par 10 gaadiyan line mein hongi! (L = λ * W).'
    },
    threeGoldenRules: [
      'RAM Hamesha Disk Se 1000x Fast Hai: L1/L2 Cache ~1ns, RAM ~100ns, SSD Disk ~100,000ns. Jitna data RAM mein rahega, utna fast hoga.',
      '86,400 Seconds Per Day: Calculation easy karne ke liye din mein 100,000 seconds maan lo. 10 Million requests/day = 10,000,000 / 100,000 = 100 QPS.',
      'Network Round Trip Ko Kam Karo: Data center se user tak ping aane mein 50-100ms lagta hai, isliye CDN se data user ke shahar tak le aao.'
    ],
    keyTermsHinglish: [
      {
        term: "Little's Law (L = λ * W)",
        englishMeaning: 'Average items in queuing system = arrival rate * average wait time',
        aasanBhasha: 'System mein ek waqt par kitni requests phasi hongi = (Kitni requests per second aa rahi hain) * (Ek request kitna time leti hai).',
        desiExample: 'Bank ke andar kitne log khade honge = (1 minute mein kitne log ghuse) * (Har aadmi counter par kitna der rukta hai).'
      },
      {
        term: 'p99 Latency',
        englishMeaning: '99% of requests are faster than this threshold',
        aasanBhasha: 'Average latency jhooth bolti hai! p99 ka matlab hai 100 mein se 99 users ko itna fast response mila, sirf 1 sabse badkismat user ko zyada time laga.',
        desiExample: 'Exam mein 99% students 1 ghante mein paper deke nikal gaye, sirf 1 student 3 ghante baitha raha.'
      }
    ],
    conceptHinglish: {
      'Latency Numbers Every Programmer Should Know': {
        aasanTitle: 'Kaun Si Cheez Kitni Slow Hai (Aankhein Kholne Wala Comparison)',
        simpleExplanation: 'Agar CPU cycle 1 second maanein: RAM access = 1 minute, SSD disk access = 2 din, aur Mumbai se California internet packet jana = 5 saal! Isliye disk aur network call kam se kam karo.',
        desiExample: 'Apne pocket se pen nikalna (RAM) vs Kanpur se dukan jaake pen lana (Disk) vs America se courier mangwana (Cross-region Network).',
        proTip: 'Interview mein latency numbers mention karte hi interviewer impress ho jata hai!'
      }
    }
  }
};

/**
 * Global Jargon Buster dictionary mapping scary technical terms to plain Hinglish explanations.
 */
export const DESI_JARGON_BUSTER: Record<string, { term: string; meaning: string; desiAnalogy: string }> = {
  'throughput': {
    term: 'Throughput (QPS / RPS)',
    meaning: 'Ek second mein aapka system kitne requests successfully process kar sakta hai.',
    desiAnalogy: 'Toll naka par 1 minute mein kitni gaadiyan cross kar rahi hain.'
  },
  'latency': {
    term: 'Latency',
    meaning: 'Aapne button dabaya aur response aane tak ka time delay (milliseconds mein).',
    desiAnalogy: 'Swiggy par order place karne se leke confirmation ka tick aane tak ka waqt.'
  },
  'cache': {
    term: 'Cache (RAM)',
    meaning: 'Fast temporary memory jahan baar baar maangi jane wali cheezein rakhte hain taaki slow database na jaana pade.',
    desiAnalogy: 'Kitchen counter par rakha namak-mirchi ka dabba (Store room baar baar na daudna pade).'
  },
  'sharding': {
    term: 'Database Sharding',
    meaning: 'Bade database table ko alag-alag physical database servers par divide karna.',
    desiAnalogy: 'Ek hi 5000 page ki moti copy ke badle A-Z ke hisaab se 5 alag alag registers banana.'
  },
  'replication': {
    term: 'Replication (Leader-Follower)',
    meaning: 'Same data ko multiple servers par copy karke rakhna taaki ek server gire to doosra sambhal le.',
    desiAnalogy: 'School ke class monitor ke notes ki photocopy karwake sabhi students ko baantna.'
  },
  'load balancer': {
    term: 'Load Balancer',
    meaning: 'Ek traffic distributor jo incoming requests ko multiple backend servers par equally baantta hai.',
    desiAnalogy: 'Shaadi mein khana lene aayi bheed ko 4 alag-alag food counters par bhejne wala guard.'
  },
  'idempotency': {
    term: 'Idempotency',
    meaning: 'Aisa operation jisko 1 baar chalao ya 10 baar chalao, result hamesha ek hi jaisa aayega.',
    desiAnalogy: 'Fan ka ON switch — agar fan pehle se chal raha hai aur dobara ON dabao to koi farq nahi padega.'
  },
  'acid': {
    term: 'ACID Properties',
    meaning: 'Database transactions ke 4 pakke niyam: Atomicity (Sab ya kuchh nahi), Consistency (Sahi data), Isolation (Alag alag), Durability (Hamesha ke liye save).',
    desiAnalogy: 'ATM cash transfer: Ya to dono accounts mein balance perfectly update hoga, ya beech mein power cut pe 1 rupaye ka bhi jhol nahi hoga.'
  },
  'cap theorem': {
    term: 'CAP Theorem',
    meaning: 'Consistency, Availability, aur Partition Tolerance mein se distributed system mein ek waqt par sirf 2 hi guarantees mil sakti hain.',
    desiAnalogy: 'Sasta, Sundar aur Tikau — teenon ek saath nahi milte!'
  },
  'rate limiting': {
    term: 'Rate Limiting',
    meaning: 'Kisi user ya bot ki request frequency ko limit karna taaki server par overload na ho.',
    desiAnalogy: 'Metro station ka turnstile gate: Ek baar mein ek hi token scan hoga, bheed ghusne nahi denge.'
  },
  'cdn': {
    term: 'CDN (Content Delivery Network)',
    meaning: 'Duniya bhar mein faile hue servers jo static files (images, JS, CSS) user ke sabse paas wale shahar se serve karte hain.',
    desiAnalogy: 'Har shahar mein Amazon ka local fulfillment center hona taaki saaman 1 din mein deliver ho sake.'
  }
};

/**
 * Returns the Hinglish guide for any chapter, with graceful dynamic fallback
 * if an explicit custom entry doesn't exist yet.
 */
export function getHinglishGuideForChapter(chapter: {
  id: string;
  title: string;
  summary: string;
  concepts?: { title: string; simpleDefinition: string; analogy?: string }[];
}): HinglishChapterGuide {
  if (HINGLISH_CHAPTER_GUIDES[chapter.id]) {
    return HINGLISH_CHAPTER_GUIDES[chapter.id];
  }

  // Smart fallback generator for other chapters
  return {
    chapterId: chapter.id,
    desiTitle: `${chapter.title} — Aasan Bhasha Mein Funda`,
    oneLiner: `Is chapter ka main goal hai ki ${chapter.title.toLowerCase()} ko scale par reliably kaise run karein bina system crash hue.`,
    whyNeeded: `Bina iske bade scale par system slow ho jata hai ya bottleneck ban jata hai. Production scale par iski planning pehle se karni padti hai.`,
    realLifeAnalogy: {
      scenario: 'Real-Life Desi Analogy',
      explanation: chapter.concepts?.[0]?.analogy 
        ? chapter.concepts[0].analogy 
        : `Jaise kisi vyast railway station ya express highway par traffic aur bheed ko manage karne ke liye rules aur signals banaye jaate hain, waise hi ${chapter.title} software mein data aur traffic ko sambhalta hai.`
    },
    threeGoldenRules: [
      'Pehle Bottlenecks Pehchano: Har step par check karo ki sabse slow cheez kaun si hai (Network, CPU, ya Disk).',
      'Redundancy & Failover Rakho: Kisi ek server ya component par poora system mat chhoro (No Single Point of Failure).',
      'Simple Rakho Jab Tak Scale Na Maange: Premature optimization se bacho; pehle working solution banao fir measure karke optimize karo.'
    ],
    keyTermsHinglish: [
      {
        term: 'High Availability',
        englishMeaning: 'System resilience without downtime',
        aasanBhasha: 'System 24 ghante chalta rahe, ek component fail ho to doosra bina ruke sambhal le.',
        desiExample: 'Car mein stepney (spare tyre) hona taaki puncture hone par rasta na ruke.'
      },
      {
        term: 'Scalability',
        englishMeaning: 'Handling increased traffic smoothly',
        aasanBhasha: 'Jab users 10x badhein to servers aur database bhi bina fatiye traffic jhel lein.',
        desiExample: 'Diwali par mithai dukan wale ka extra karigar aur counters lagana.'
      }
    ],
    conceptHinglish: {}
  };
}

