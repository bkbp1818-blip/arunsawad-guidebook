import { PrismaClient, Category, TimeOfDay, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create Admin User
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Admin",
      role: Role.SUPER_ADMIN,
    },
  });
  console.log("✅ Created admin user:", admin.username);

  // Create 3 Locations
  const chinatown = await prisma.location.upsert({
    where: { slug: "chinatown" },
    update: {},
    create: {
      slug: "chinatown",
      name: "Chinatown",
      nameThai: "ไชน่าทาวน์",
      tagline: "The Authentic Hideaway",
      description: "Tucked away in Soi Pradoo, escape the tourist crowds and embrace the 'Real Bangkok' living. Experience the charm of local neighbors and the quiet side of Chinatown.",
      address: "Soi Pradoo, Rama 4 Road, Maha Phruttharam, Bang Rak, Bangkok 10500",
      addressThai: "ซอยประดู่ ถนนพระรามที่ 4 แขวงมหาพฤฒาราม เขตบางรัก กรุงเทพฯ 10500",
      latitude: 13.7308,
      longitude: 100.5120,
      wifiName: "ARUNSAWAD_CHINATOWN",
      wifiPassword: "sawaddee2024",
      emergencyPhone: "+66 2 123 4567",
      breakfastInfo: "Light breakfast available 7:00-10:00 AM (included in room rate)",
      houseRules: "- Quiet hours: 10 PM - 8 AM\\n- No outside food in dorms\\n- Shoes off in common areas\\n- Respect other guests",
      spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DX5trt9i14X7j",
    },
  });

  const yaowarat = await prisma.location.upsert({
    where: { slug: "yaowarat" },
    update: {},
    create: {
      slug: "yaowarat",
      name: "Yaowarat",
      nameThai: "เยาวราช",
      tagline: "The Living Heritage",
      description: "Located inside the historic 'Luen Rit Community'. Stay surrounded by Sino-Portuguese history, legendary street food, and the dragon's heartbeat.",
      address: "Luen Rit Community, Yaowarat Road, Samphanthawong, Bangkok 10100",
      addressThai: "ชุมชนเลื่อนฤทธิ์ ถนนเยาวราช เขตสัมพันธวงศ์ กรุงเทพฯ 10100",
      latitude: 13.7400,
      longitude: 100.5100,
      wifiName: "ARUNSAWAD_YAOWARAT",
      wifiPassword: "heritage2024",
      emergencyPhone: "+66 2 234 5678",
      breakfastInfo: "Breakfast not included. Amazing street food nearby!",
      houseRules: "- Quiet hours: 11 PM - 7 AM\\n- No smoking inside\\n- Keep valuables in lockers\\n- Check out by 12 PM",
      spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
    },
  });

  const nana = await prisma.location.upsert({
    where: { slug: "103-nana" },
    update: {},
    create: {
      slug: "103-nana",
      name: "103 NANA",
      nameThai: "103 นานา",
      tagline: "The Hipster's Hub",
      description: "Situated in the trendy Soi Nana. Surrounded by art galleries and craft cocktail bars. Designed for the night owls and style seekers.",
      address: "Soi Nana, Rama 4 Road, Pom Prap Sattru Phai, Bangkok 10100",
      addressThai: "ซอยนานา ถนนพระรามที่ 4 เขตป้อมปราบศัตรูพ่าย กรุงเทพฯ 10100",
      latitude: 13.7450,
      longitude: 100.5150,
      wifiName: "ARUNSAWAD_103NANA",
      wifiPassword: "hipster2024",
      emergencyPhone: "+66 2 345 6789",
      breakfastInfo: "Coffee and toast available until 11 AM",
      houseRules: "- Late check-in available until 2 AM\\n- Rooftop closes at midnight\\n- No glass bottles outside\\n- Have fun!",
      spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DX4dyzvuaRJ0n",
    },
  });
  console.log("✅ Created 3 locations");

  // Create Sample Places for Chinatown
  const places = [
    // Morning - Chinatown
    {
      name: "On Lok Yun",
      nameThai: "ออนล็อกหยุ่น",
      description: "Classic Thai-Chinese breakfast spot since 1933. Famous for kaya toast, soft-boiled eggs, and traditional coffee.",
      address: "72 Charoen Krung Rd",
      latitude: 13.7310,
      longitude: 100.5125,
      category: Category.CAFE,
      timeOfDay: TimeOfDay.MORNING,
      tags: ["Classic", "Local Favorite", "Budget"],
      priceRange: 1,
      mustTry: "Kaya Toast + Thai Tea Set",
      tips: "Get there before 8 AM to avoid the queue",
      isHostelChoice: true,
      locationId: chinatown.id,
    },
    {
      name: "Jok Prince",
      nameThai: "โจ๊กปริ๊นซ์",
      description: "Best congee in Chinatown. Silky smooth rice porridge with all the toppings.",
      address: "Soi Sukon 1, Charoen Krung",
      latitude: 13.7315,
      longitude: 100.5130,
      category: Category.STREET_FOOD,
      timeOfDay: TimeOfDay.MORNING,
      tags: ["Street Food", "Michelin"],
      priceRange: 1,
      mustTry: "Pork Congee with Century Egg",
      tips: "Opens at 6:30 AM, closes when sold out (usually by 11 AM)",
      locationId: chinatown.id,
    },
    // Day - Chinatown
    {
      name: "Wat Mangkon Kamalawat",
      nameThai: "วัดมังกรกมลาวาส",
      description: "The largest Chinese Buddhist temple in Bangkok. Beautiful architecture and peaceful atmosphere.",
      address: "423 Charoen Krung Rd",
      latitude: 13.7420,
      longitude: 100.5080,
      category: Category.CULTURAL,
      timeOfDay: TimeOfDay.DAY,
      tags: ["Temple", "Cultural", "Free"],
      priceRange: 1,
      tips: "Dress respectfully. Best visited in the morning for fewer crowds.",
      locationId: chinatown.id,
    },
    {
      name: "Ba Hao",
      nameThai: "บ้าเฮา",
      description: "Hip cafe in a renovated shophouse. Great coffee and Instagram-worthy interiors.",
      address: "8 Soi Nana",
      latitude: 13.7445,
      longitude: 100.5145,
      category: Category.CAFE,
      timeOfDay: TimeOfDay.DAY,
      tags: ["Hip", "Coffee", "Photography"],
      priceRange: 2,
      mustTry: "Coconut Coffee",
      isHostelChoice: true,
      locationId: nana.id,
    },
    // Night - Chinatown
    {
      name: "Jay Fai",
      nameThai: "เจ๊ไฝ",
      description: "The legendary street food chef with a Michelin star. Worth the wait for her famous crab omelette.",
      address: "327 Maha Chai Rd",
      latitude: 13.7530,
      longitude: 100.5020,
      category: Category.STREET_FOOD,
      timeOfDay: TimeOfDay.NIGHT,
      tags: ["Michelin Star", "Legendary", "Splurge"],
      priceRange: 4,
      mustTry: "Crab Omelette (ไข่เจียวปู)",
      tips: "Reservations recommended. Opens at 2 PM.",
      isHostelChoice: true,
      locationId: yaowarat.id,
    },
    {
      name: "Nai Ek Roll Noodles",
      nameThai: "นายเอ็กก๋วยเตี๋ยวหลอด",
      description: "Fresh hand-rolled rice noodles made right in front of you. A Yaowarat institution.",
      address: "Yaowarat Rd",
      latitude: 13.7400,
      longitude: 100.5095,
      category: Category.STREET_FOOD,
      timeOfDay: TimeOfDay.NIGHT,
      tags: ["Street Food", "Classic", "Budget"],
      priceRange: 1,
      mustTry: "Roll Noodles with Pork",
      tips: "Look for the queue - that's how you know it's good!",
      locationId: yaowarat.id,
    },
    {
      name: "Teens of Thailand",
      nameThai: "ทีนส์ ออฟ ไทยแลนด์",
      description: "Award-winning cocktail bar with Thai-inspired drinks. Hidden speakeasy vibes.",
      address: "76 Soi Nana",
      latitude: 13.7448,
      longitude: 100.5148,
      category: Category.BAR,
      timeOfDay: TimeOfDay.NIGHT,
      tags: ["Cocktails", "Hidden Bar", "Cool"],
      priceRange: 3,
      mustTry: "Tom Yum Martini",
      tips: "No reservations, first come first served. Opens at 6 PM.",
      isHostelChoice: true,
      locationId: nana.id,
    },
    {
      name: "Sampeng Market",
      nameThai: "ตลาดสำเพ็ง",
      description: "Bangkok's oldest wholesale market. Everything from fabric to toys at bargain prices.",
      address: "Sampeng Lane",
      latitude: 13.7380,
      longitude: 100.5050,
      category: Category.MARKET,
      timeOfDay: TimeOfDay.DAY,
      tags: ["Shopping", "Local", "Budget"],
      priceRange: 1,
      tips: "Best on weekdays. Closes early afternoon.",
      locationId: yaowarat.id,
    },
  ];

  for (const place of places) {
    await prisma.place.create({ data: place });
  }
  console.log(`✅ Created ${places.length} sample places`);

  // Create FAQs
  const faqs = [
    { question: "What is the WiFi password?", answer: "Each location has different WiFi. Check the Welcome page for your location's WiFi name and password, or scan the QR code in your room.", category: "wifi" },
    { question: "What time is check-in?", answer: "Check-in time is 2:00 PM (14:00). Early check-in may be available upon request, subject to availability.", category: "general" },
    { question: "What time is check-out?", answer: "Check-out time is 12:00 PM (noon). Late check-out may be available for an additional fee.", category: "general" },
    { question: "Where is the best Pad Thai nearby?", answer: "Thip Samai on Maha Chai Road is legendary! They're famous for their Pad Thai wrapped in egg. Opens at 5 PM.", category: "food" },
    { question: "Is street food safe to eat?", answer: "Yes! Street food in Yaowarat is generally very safe. Look for busy stalls with high turnover. The locals eat there too!", category: "food" },
    { question: "How do I get to the Grand Palace?", answer: "Take the MRT to Sanam Chai station (15 min walk from Yaowarat). The Grand Palace is a 10-minute walk from there.", category: "transport" },
    { question: "What time does the MRT close?", answer: "The MRT operates from 6:00 AM to midnight. The nearest station is Wat Mangkon (5 min walk from Yaowarat location).", category: "transport" },
    { question: "Where can I do laundry?", answer: "There's a laundromat 2 minutes walk from each location. Ask at reception for directions. Cost is about 40-60 THB per load.", category: "general" },
    { question: "Is breakfast included?", answer: "It depends on your booking and location. Check your reservation details or ask at reception.", category: "general" },
    { question: "Can I store my luggage?", answer: "Yes! We offer free luggage storage for guests before check-in and after check-out.", category: "general" },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log(`✅ Created ${faqs.length} FAQs`);

  // Create Thai Phrases
  const phrases = [
    // Greetings
    { english: "Hello", thai: "สวัสดี", pronunciation: "sa-wat-dee", category: "greeting" },
    { english: "Thank you", thai: "ขอบคุณ", pronunciation: "kop-kun", category: "greeting" },
    { english: "Sorry / Excuse me", thai: "ขอโทษ", pronunciation: "kor-toht", category: "greeting" },
    { english: "Yes", thai: "ใช่", pronunciation: "chai", category: "greeting" },
    { english: "No", thai: "ไม่", pronunciation: "mai", category: "greeting" },
    // Food
    { english: "Delicious!", thai: "อร่อย", pronunciation: "a-roy", category: "food" },
    { english: "Not spicy please", thai: "ไม่เผ็ด", pronunciation: "mai pet", category: "food" },
    { english: "A little spicy", thai: "เผ็ดนิดหน่อย", pronunciation: "pet nit noi", category: "food" },
    { english: "Check please", thai: "เก็บเงิน", pronunciation: "gep ngern", category: "food" },
    { english: "One more please", thai: "อีกอันหนึ่ง", pronunciation: "eek an nung", category: "food" },
    // Numbers
    { english: "One", thai: "หนึ่ง", pronunciation: "nung", category: "numbers" },
    { english: "Two", thai: "สอง", pronunciation: "song", category: "numbers" },
    { english: "Three", thai: "สาม", pronunciation: "sam", category: "numbers" },
    { english: "How much?", thai: "เท่าไหร่", pronunciation: "tao-rai", category: "numbers" },
    { english: "Too expensive", thai: "แพงไป", pronunciation: "paeng pai", category: "numbers" },
    // Emergency
    { english: "Help!", thai: "ช่วยด้วย", pronunciation: "chuay duay", category: "emergency" },
    { english: "I need a doctor", thai: "ต้องการหมอ", pronunciation: "tong garn mor", category: "emergency" },
    { english: "Where is...?", thai: "...อยู่ที่ไหน", pronunciation: "...yoo tee nai", category: "emergency" },
  ];

  for (const phrase of phrases) {
    await prisma.thaiPhrase.create({ data: phrase });
  }
  console.log(`✅ Created ${phrases.length} Thai phrases`);

  // Create Sample Events
  const events = [
    {
      title: "Movie Night: Thai Cinema",
      description: "Join us for a classic Thai movie with English subtitles. Popcorn provided!",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      time: "19:00",
      endTime: "21:30",
      locationId: yaowarat.id,
      isActive: true,
    },
    {
      title: "Chinatown Food Tour",
      description: "Guided walking tour through the best street food spots in Yaowarat. 5 stops, unlimited deliciousness!",
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      time: "18:00",
      endTime: "21:00",
      locationId: yaowarat.id,
      isActive: true,
    },
    {
      title: "Rooftop Sunset Drinks",
      description: "Watch the Bangkok sunset from our rooftop with complimentary welcome drink.",
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      time: "17:30",
      endTime: "19:00",
      locationId: nana.id,
      isActive: true,
    },
    {
      title: "Thai Cooking Class",
      description: "Learn to make Pad Thai and Tom Yum with our local chef. Ingredients included.",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      time: "14:00",
      endTime: "17:00",
      locationId: chinatown.id,
      isActive: true,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }
  console.log(`✅ Created ${events.length} sample events`);

  // Create Daily Picks
  const dailyPicks = [
    {
      title: "Tonight: Night Market at Yaowarat Road!",
      description: "The famous Chinatown street food scene is buzzing tonight. Don't miss the seafood!",
      isActive: true,
    },
    {
      title: "Weekend Special: Free Walking Tour",
      description: "Join our staff for a free 2-hour walking tour of hidden gems in the neighborhood.",
      isActive: true,
    },
  ];

  for (const pick of dailyPicks) {
    await prisma.dailyPick.create({ data: pick });
  }
  console.log(`✅ Created ${dailyPicks.length} daily picks`);

  // Create Sample Guestbook Entries
  const guestbookEntries = [
    {
      name: "Sarah",
      country: "Australia",
      message: "Amazing stay! The staff recommendations for street food were spot on. Will definitely come back!",
      rating: 5,
      isApproved: true,
    },
    {
      name: "Marco",
      country: "Italy",
      message: "Perfect location for exploring Chinatown. The rooftop is beautiful at sunset.",
      rating: 5,
      isApproved: true,
    },
    {
      name: "Yuki",
      country: "Japan",
      message: "Very clean and friendly staff. The chatbot Chao was super helpful!",
      rating: 4,
      isApproved: true,
    },
    {
      name: "Alex",
      country: "Germany",
      message: "Great value for money. Loved the local vibe and the breakfast recommendations.",
      rating: 5,
      isApproved: true,
    },
  ];

  for (const entry of guestbookEntries) {
    await prisma.guestbookEntry.create({ data: entry });
  }
  console.log(`✅ Created ${guestbookEntries.length} guestbook entries`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
