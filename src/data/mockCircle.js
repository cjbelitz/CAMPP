const MIN  = 60 * 1000
const HOUR = 60 * MIN
const DAY  = 24 * HOUR
const NOW  = Date.now()

export const MOCK_MOMS = [
  { id: 'mom-1', name: 'Jess R.',    avatarColor: '#FF9B28', location: 'Encinitas',    kidName: 'Maya',   kidAge: 9,  campIds: [3, 6]     },
  { id: 'mom-2', name: 'Priya K.',   avatarColor: '#7A88FE', location: 'Carlsbad',     kidName: 'Rohan',  kidAge: 11, campIds: [2, 12]    },
  { id: 'mom-3', name: 'Dana M.',    avatarColor: '#BFDFF3', location: 'Oceanside',    kidName: 'Kai',    kidAge: 10, campIds: [3, 9]     },
  { id: 'mom-4', name: 'Lacey B.',   avatarColor: '#FABE37', location: 'Carlsbad',     kidName: 'Ellie',  kidAge: 8,  campIds: [2, 3]     },
  { id: 'mom-5', name: 'Steph O.',   avatarColor: '#F055A5', location: 'Vista',        kidName: 'Connor', kidAge: 13, campIds: [9, 6]     },
  { id: 'mom-6', name: 'Raquel T.',  avatarColor: '#CCD537', location: 'Oceanside',    kidName: 'Mia',    kidAge: 12, campIds: [2, 9]     },
  { id: 'mom-7', name: 'Bri J.',     avatarColor: '#F055A5', location: 'Encinitas',    kidName: 'Lily',   kidAge: 7,  campIds: [6]        },
  { id: 'mom-8', name: 'Tamsin L.',  avatarColor: '#BFDFF3', location: 'Solana Beach', kidName: 'Jack',   kidAge: 10, campIds: [2]        },
]

// ─── Group: Creative Arts (camp 3) ───────────────────────────────────────────
const GROUP_3 = [
  { id: 'g3-1',  senderId: 'mom-1', ts: NOW - 4*DAY - 2*HOUR,   body: "Hi everyone!! So excited for the Creative Arts session starting Monday. Is anyone doing the full-day option or just half-day?" },
  { id: 'g3-2',  senderId: 'mom-3', ts: NOW - 4*DAY - 90*MIN,   body: "We're doing half-day — Kai gets a little overwhelmed with full days 😅 Is drop-off still at the Encinitas studio entrance?" },
  { id: 'g3-3',  senderId: 'mom-4', ts: NOW - 4*DAY - 55*MIN,   body: "Same, half-day for Ellie too! Jess do you know if they want the kids to bring their own aprons? The packing list was vague" },
  { id: 'g3-4',  senderId: 'mom-1', ts: NOW - 3*DAY - 15*HOUR,  body: "I emailed them — aprons are provided but kids can bring their own if they have a fave ☺️ Also heads up: parking on Monday mornings is rough, plan for 15 min early!" },
  { id: 'g3-5',  senderId: 'mom-3', ts: NOW - 3*DAY - 15*HOUR + 15*MIN, body: "OMG thank you for asking!! That lot is always a nightmare. Setting a reminder now 😅" },
  { id: 'g3-6',  senderId: 'mom-4', ts: NOW - 2*DAY - 10*HOUR,  body: "Day 1 recap — Ellie came home COVERED in paint and absolutely glowing 😍 She made a self-portrait in the style of Matisse apparently??" },
  { id: 'g3-7',  senderId: 'mom-1', ts: NOW - 2*DAY - 8*HOUR,   body: "Same energy here 🎨 Maya said her favorite part was the printmaking station. They made these little block prints. Obsessed." },
  { id: 'g3-8',  senderId: 'mom-3', ts: NOW - 2*DAY - 8*HOUR + 22*MIN, body: "Kai made a clay pinch pot and is already planning what he'll put in it. A rock collection obviously 😂" },
  { id: 'g3-9',  senderId: 'mom-1', ts: NOW - 14*HOUR,          body: "Did anyone else get the email about the parent showcase on Friday?? I'm already emotional just thinking about it 🥹" },
  { id: 'g3-10', senderId: 'mom-4', ts: NOW - 2*HOUR,           body: "YES and I'm telling my husband NOW to leave work early. We are not missing this. Also — anyone want to grab coffee at Bird Rock after pickup Wednesday?" },
  { id: 'g3-carpool-1', senderId: 'mom-4', ts: NOW - 30*MIN, type: 'carpool', carpool: { role: 'driving', session: 'Jun 23–27', seats: 2, neighborhood: 'Carlsbad / La Costa' } },
]

// ─── Group: Rock Star Music (camp 6) ─────────────────────────────────────────
const GROUP_6 = [
  { id: 'g6-1',  senderId: 'mom-7', ts: NOW - 6*DAY - 14*HOUR,  body: "Ok who else is doing Rock Star Music Academy this session?? Lily has been talking about it since March and I may have built up the hype a little too much 😬" },
  { id: 'g6-2',  senderId: 'mom-5', ts: NOW - 6*DAY - 13*HOUR,  body: "Connor is SO in. He's been air-guitaring around the house for two weeks. Is it the San Marcos location?" },
  { id: 'g6-3',  senderId: 'mom-1', ts: NOW - 6*DAY - 12*HOUR,  body: "Yes San Marcos! Maya's doing piano but apparently they can also try other instruments? The brochure was a bit unclear" },
  { id: 'g6-4',  senderId: 'mom-7', ts: NOW - 5*DAY - 15*HOUR,  body: "Update: Lily is assigned to DRUMS. She has never played drums. Send thoughts and prayers to our household 🥁🥁🥁" },
  { id: 'g6-5',  senderId: 'mom-5', ts: NOW - 5*DAY - 14*HOUR,  body: "HAHA amazing. Connor got guitar which feels on brand. Does anyone know if they record the end performance? My mom wants to come and she lives in Temecula" },
  { id: 'g6-6',  senderId: 'mom-1', ts: NOW - 5*DAY - 12*HOUR,  body: "They do a live performance Friday afternoon and post a recording link in the parent portal. Tell your mom to come, the more the merrier!!" },
  { id: 'g6-7',  senderId: 'mom-7', ts: NOW - 3*DAY - 6*HOUR,   body: "Day 3 check-in: Lily is already obsessed with her instructor and came home teaching me drum rudiments. I do not know what a rudiment is but I'm learning 😂" },
  { id: 'g6-8',  senderId: 'mom-5', ts: NOW - 1*DAY - 11*HOUR,  body: "Connor learned a G chord and immediately tried to write a song about soccer. I respect the commitment to brand 😂 Heads up — Friday performance is at 4pm, gates open at 3:30!" },
]

// ─── Group: Makers & Builders STEM (camp 2) ──────────────────────────────────
const GROUP_2 = [
  { id: 'g2-1',  senderId: 'mom-2', ts: NOW - 5*DAY - 16*HOUR,  body: "Hi Makers & Builders families! Anyone else equal parts excited and nervous? Rohan has been prepping for this for MONTHS 😂" },
  { id: 'g2-2',  senderId: 'mom-4', ts: NOW - 5*DAY - 15*HOUR,  body: "Ellie is the same! She made a list of 'things I want to build' which includes a robot, a catapult, and a 'machine that makes smoothies'" },
  { id: 'g2-3',  senderId: 'mom-6', ts: NOW - 5*DAY - 14*HOUR,  body: "Mia wants to build an app. She's 12. I'm scared." },
  { id: 'g2-4',  senderId: 'mom-8', ts: NOW - 5*DAY - 13*HOUR,  body: "Jack just wants to learn how to make things move. I support this dream." },
  { id: 'g2-5',  senderId: 'mom-2', ts: NOW - 4*DAY - 8*HOUR,   body: "Pro tip from last year: bring extra snacks on Wednesday — that's the big robot build day and no one wants to stop. Also the AC in the building is COLD, light jacket not a bad idea" },
  { id: 'g2-6',  senderId: 'mom-6', ts: NOW - 4*DAY - 7*HOUR,   body: "Omg thank you!! Noted on both. This group is already more helpful than any school email chain I've ever been on 😂" },
  { id: 'g2-7',  senderId: 'mom-4', ts: NOW - 2*DAY - 9*HOUR,   body: "Day 1 report: Ellie immediately found 3 new best friends and also learned what a servo motor is. Today was a success." },
  { id: 'g2-8',  senderId: 'mom-8', ts: NOW - 2*DAY - 8*HOUR,   body: "Jack came home with a cardboard vehicle held together entirely by zip ties and pure determination. It technically moved. He is beyond proud." },
  { id: 'g2-9',  senderId: 'mom-2', ts: NOW - 1*DAY - 2*HOUR,   body: "How's everyone's kid doing today? Rohan texted me 'mom my robot arm actually works' and then nothing for 4 hours which I think is a great sign" },
  { id: 'g2-carpool-1', senderId: 'mom-2', ts: NOW - 45*MIN, type: 'carpool', carpool: { role: 'driving', session: 'Jun 23–27', seats: 3, neighborhood: 'Carlsbad' } },
]

// ─── Group: Ninja Warrior (camp 9) ───────────────────────────────────────────
const GROUP_9 = [
  { id: 'g9-1',  senderId: 'mom-3', ts: NOW - 7*DAY - 10*HOUR,  body: "Ninja Warrior parents unite!! Kai has been doing practice runs over our patio furniture for three weeks. I'm terrified and impressed." },
  { id: 'g9-2',  senderId: 'mom-5', ts: NOW - 7*DAY - 9*HOUR,   body: "Connor has been timing himself on everything. EVERYTHING. Getting a glass of water. Brushing teeth. I regret nothing." },
  { id: 'g9-3',  senderId: 'mom-6', ts: NOW - 7*DAY - 8*HOUR,   body: "Mia just asked me if we could install a warped wall in the backyard. The answer was no but honestly... how much do those cost 😭" },
  { id: 'g9-4',  senderId: 'mom-3', ts: NOW - 3*DAY - 12*HOUR,  body: "Day 1: Kai got to the third obstacle and fell into the foam pit laughing so hard he couldn't get out. Best $295 I've ever spent." },
  { id: 'g9-5',  senderId: 'mom-5', ts: NOW - 3*DAY - 11*HOUR,  body: "Connor mastered the rope traverse and is now insufferable about it (affectionate). His words: 'I think I'm ready for the show.'" },
  { id: 'g9-6',  senderId: 'mom-6', ts: NOW - 3*DAY - 10*HOUR,  body: "Mia is COMPETING with a boy named Tyler and she is absolutely not going to let him beat her. Counselors apparently love it. I love it." },
  { id: 'g9-7',  senderId: 'mom-3', ts: NOW - 6*HOUR,           body: "Heads up: Friday is mini-competition day! Counselors will time each kid on a full course. Families welcome to watch. Starts at 3pm!" },
]

// ─── DM: Jess R. (mom-1) ─────────────────────────────────────────────────────
const DM_MOM_1 = [
  { id: 'dm1-1', senderId: 'mom-1', ts: NOW - 3*DAY - 4*HOUR,   body: "Hey!! So random but I noticed our girls are both at Creative Arts — are you the one who asked the apron question in the group? 😂" },
  { id: 'dm1-2', senderId: 'me',    ts: NOW - 3*DAY - 3*HOUR - 18*MIN, body: "Haha yes that was me!! Such a relief she emailed back. Your Maya sounds so sweet btw 🥰" },
  { id: 'dm1-3', senderId: 'mom-1', ts: NOW - 3*DAY - 3*HOUR,   body: "She really is but do not let her fool you, she is also extremely chaotic about her art supplies 😅 Which neighborhood are you in? We're in Leucadia" },
  { id: 'dm1-4', senderId: 'me',    ts: NOW - 3*DAY - 2*HOUR - 48*MIN, body: "Encinitas! We're practically neighbors. We should do a playdate after camp one of these days if the girls hit it off 🥹" },
  { id: 'dm1-5', senderId: 'mom-1', ts: NOW - 2*DAY - 23*HOUR,  body: "OK so Olivia and Maya were apparently best friends by like 9am today?? Maya would not stop talking about her at dinner. Playdate is 100% happening, I'll DM you my number! 🎉" },
  { id: 'dm1-6', senderId: 'me',    ts: NOW - 25*MIN,            body: "Hi Jess! 🚗 You just claimed a seat for the ride to camp carpool — Jun 23–27 week, Carlsbad / La Costa area. Can you send me your pickup address and what time your kid needs to be dropped off? I'll put together a plan and confirm the full schedule!" },
]

// ─── DM: Priya K. (mom-2) ────────────────────────────────────────────────────
const DM_MOM_2 = [
  { id: 'dm2-1', senderId: 'mom-2', ts: NOW - 5*DAY - 8*HOUR,   body: "Hi! I think our boys are both signed up for Makers & Builders? My son Rohan is 11, super into robotics. Is Noah the one who did Ninja Warrior last summer? Rohan mentioned a Noah" },
  { id: 'dm2-2', senderId: 'me',    ts: NOW - 5*DAY - 7*HOUR - 15*MIN, body: "That's him!! Small world — Noah talked about a kid who built a really impressive robot arm last year, I wonder if that was Rohan 😄" },
  { id: 'dm2-3', senderId: 'mom-2', ts: NOW - 5*DAY - 7*HOUR,   body: "THAT WAS ROHAN!! He was SO proud of that thing. Oh this is the best news. They are going to have so much fun together 🥹" },
  { id: 'dm2-4', senderId: 'mom-2', ts: NOW - 4*DAY - 22*HOUR,  body: "Quick tip from last year: extra snacks on Wednesday (big build day), and the AC in the building is COLD — light jacket! You're welcome 😄" },
  { id: 'dm2-5', senderId: 'me',    ts: NOW - 4*DAY - 21*HOUR - 5*MIN, body: "You are an absolute lifesaver, I had no idea about the AC. Adding jacket to the bag right now. Thank you!!" },
  { id: 'dm2-6', senderId: 'mom-2', ts: NOW - 1*DAY - 2*HOUR - 44*MIN, body: "How's Noah liking it so far? Rohan came home with what I can only describe as a small wheeled vehicle made of zip ties and cardboard and he is EXTREMELY proud of it 😂" },
]

// ─── Carpool posts (feed across all circles) ─────────────────────────────────
// tocamp / fromcamp: { seats, claimedBy[] } or null if not offered in that direction
export const MOCK_CARPOOL_POSTS = [
  {
    id: 'cp-0',
    momId: 'me',
    circleName: 'Creative Arts Intensive',
    convId: 'group-3',
    role: 'driving',
    session: 'Jun 23–27',
    neighborhood: 'Carlsbad / La Costa',
    tocamp:   { seats: 2, claimedBy: ['mom-1'] },
    fromcamp: { seats: 2, claimedBy: [] },
    ts: NOW - 28 * MIN,
  },
  {
    id: 'cp-1',
    momId: 'mom-4',
    circleName: 'Creative Arts Intensive',
    convId: 'group-3',
    role: 'driving',
    session: 'Jun 23–27',
    neighborhood: 'Carlsbad / La Costa',
    tocamp:   { seats: 2, claimedBy: [] },
    fromcamp: { seats: 2, claimedBy: [] },
    ts: NOW - 30 * MIN,
  },
  {
    id: 'cp-2',
    momId: 'mom-2',
    circleName: 'Makers & Builders STEM',
    convId: 'group-2',
    role: 'driving',
    session: 'Jun 23–27',
    neighborhood: 'Carlsbad',
    tocamp:   { seats: 3, claimedBy: [] },
    fromcamp: null,
    ts: NOW - 45 * MIN,
  },
  {
    id: 'cp-3',
    momId: 'mom-3',
    circleName: 'Ninja Warrior Fitness',
    convId: 'group-9',
    role: 'riding',
    session: 'Jun 23–27',
    neighborhood: 'Oceanside',
    tocamp:   { seats: 0, claimedBy: [] },
    fromcamp: { seats: 0, claimedBy: [] },
    ts: NOW - 2 * HOUR,
  },
]

// ─── User-named circles (groups organized under each kid) ────────────────────
export const MOCK_CIRCLES = [
  { id: 'circle-1', kidId: 'sample-olivia', name: 'Creative Arts Intensive', campId: 3, memberIds: ['mom-1', 'mom-3', 'mom-4'] },
  { id: 'circle-2', kidId: 'sample-olivia', name: 'Rock Star Music 🎸',       campId: 6, memberIds: ['mom-7', 'mom-1', 'mom-5'] },
  { id: 'circle-3', kidId: 'sample-noah',   name: 'Makers & Builders STEM',   campId: 2, memberIds: ['mom-2', 'mom-4', 'mom-6', 'mom-8'] },
  { id: 'circle-4', kidId: 'sample-noah',   name: 'Ninja Warrior Fitness',    campId: 9, memberIds: ['mom-3', 'mom-5', 'mom-6'] },
]

// ─── Contacts (confirmed people in your circle community) ─────────────────────
export const MOCK_CONTACTS = ['mom-1', 'mom-2', 'mom-3', 'mom-4', 'mom-5']

// ─── Circle signups: who's registered for which camp ─────────────────────────
// campId → [{kidName, momName, momId, session}]
export const MOCK_CIRCLE_SIGNUPS = {
  // Creative Arts Intensive (3)
  3: [
    { kidName: 'Maya',  momName: 'Jess R.',   momId: 'mom-1', session: 'Jun 23–27' },
    { kidName: 'Kai',   momName: 'Dana M.',   momId: 'mom-3', session: 'Jun 23–27' },
    { kidName: 'Ellie', momName: 'Lacey B.',  momId: 'mom-4', session: 'Jul 7–11'  },
  ],
  // Makers & Builders STEM (2)
  2: [
    { kidName: 'Rohan', momName: 'Priya K.',  momId: 'mom-2', session: 'Jun 23–27' },
    { kidName: 'Ellie', momName: 'Lacey B.',  momId: 'mom-4', session: 'Jun 16–20' },
    { kidName: 'Jack',  momName: 'Tamsin L.', momId: 'mom-8', session: 'Jul 7–11'  },
    { kidName: 'Mia',   momName: 'Raquel T.', momId: 'mom-6', session: 'Jul 14–18' },
  ],
  // Rock Star Music Academy (6)
  6: [
    { kidName: 'Lily',   momName: 'Bri J.',   momId: 'mom-7', session: 'Jul 7–11'  },
    { kidName: 'Maya',   momName: 'Jess R.',  momId: 'mom-1', session: 'Jul 14–18' },
    { kidName: 'Connor', momName: 'Steph O.', momId: 'mom-5', session: 'Jul 7–11'  },
  ],
  // Ninja Warrior Fitness (9)
  9: [
    { kidName: 'Kai',    momName: 'Dana M.',   momId: 'mom-3', session: 'Jun 23–27' },
    { kidName: 'Connor', momName: 'Steph O.',  momId: 'mom-5', session: 'Jun 23–27' },
    { kidName: 'Mia',    momName: 'Raquel T.', momId: 'mom-6', session: 'Jul 7–11'  },
  ],
  // Soccer Stars Summer Camp (14)
  14: [
    { kidName: 'Connor', momName: 'Steph O.', momId: 'mom-5', session: 'Jun 23–27' },
    { kidName: 'Kai',    momName: 'Dana M.',  momId: 'mom-3', session: 'Jun 23–27' },
  ],
  // Young Coders Academy (15)
  15: [
    { kidName: 'Rohan', momName: 'Priya K.', momId: 'mom-2', session: 'Jun 16–20' },
    { kidName: 'Mia',   momName: 'Raquel T.', momId: 'mom-6', session: 'Jun 16–20' },
  ],
  // Musical Theater Workshop (18)
  18: [
    { kidName: 'Lily', momName: 'Bri J.',  momId: 'mom-7', session: 'Jun 23–27' },
    { kidName: 'Maya', momName: 'Jess R.', momId: 'mom-1', session: 'Jun 23–27' },
  ],
  // Gymnastics Summer Intensive (19)
  19: [
    { kidName: 'Kai',   momName: 'Dana M.',  momId: 'mom-3', session: 'Jun 16–20' },
    { kidName: 'Ellie', momName: 'Lacey B.', momId: 'mom-4', session: 'Jun 23–27' },
  ],
  // LEGO Engineering Camp (20)
  20: [
    { kidName: 'Rohan', momName: 'Priya K.', momId: 'mom-2', session: 'Jun 16–20' },
    { kidName: 'Ellie', momName: 'Lacey B.', momId: 'mom-4', session: 'Jun 23–27' },
    { kidName: 'Jack',  momName: 'Tamsin L.', momId: 'mom-8', session: 'Jun 16–20' },
  ],
  // Ballet & Dance Intensive (23)
  23: [
    { kidName: 'Lily',  momName: 'Bri J.',   momId: 'mom-7', session: 'Jul 7–11' },
    { kidName: 'Ellie', momName: 'Lacey B.', momId: 'mom-4', session: 'Jul 7–11' },
  ],
  // Science Discovery Camp (24)
  24: [
    { kidName: 'Rohan', momName: 'Priya K.',  momId: 'mom-2', session: 'Jul 21–25' },
    { kidName: 'Mia',   momName: 'Raquel T.', momId: 'mom-6', session: 'Jul 21–25' },
  ],
  // Minecraft & Game Design (26)
  26: [
    { kidName: 'Rohan',  momName: 'Priya K.', momId: 'mom-2', session: 'Jul 14–18' },
    { kidName: 'Connor', momName: 'Steph O.', momId: 'mom-5', session: 'Jul 14–18' },
  ],
  // Surf Camp - Surf Diva (27)
  27: [
    { kidName: 'Maya',   momName: 'Jess R.',  momId: 'mom-1', session: 'Jun 23–27' },
    { kidName: 'Connor', momName: 'Steph O.', momId: 'mom-5', session: 'Jul 7–11'  },
  ],
  // Robotics Engineering Camp (30)
  30: [
    { kidName: 'Rohan', momName: 'Priya K.',  momId: 'mom-2', session: 'Jul 28–Aug 1' },
    { kidName: 'Jack',  momName: 'Tamsin L.', momId: 'mom-8', session: 'Jul 28–Aug 1' },
  ],
  // Musical Instrument Workshop (32)
  32: [
    { kidName: 'Lily', momName: 'Bri J.',  momId: 'mom-7', session: 'Jun 23–27' },
    { kidName: 'Maya', momName: 'Jess R.', momId: 'mom-1', session: 'Jun 23–27' },
  ],
}

// ─── Exported conversation map ────────────────────────────────────────────────
export const MOCK_CONVERSATIONS = {
  'group-3': { id: 'group-3', type: 'group', campId: 3,  messages: GROUP_3 },
  'group-6': { id: 'group-6', type: 'group', campId: 6,  messages: GROUP_6 },
  'group-2': { id: 'group-2', type: 'group', campId: 2,  messages: GROUP_2 },
  'group-9': { id: 'group-9', type: 'group', campId: 9,  messages: GROUP_9 },
  'dm-mom-1': { id: 'dm-mom-1', type: 'dm', momId: 'mom-1', messages: DM_MOM_1 },
  'dm-mom-2': { id: 'dm-mom-2', type: 'dm', momId: 'mom-2', messages: DM_MOM_2 },
}
