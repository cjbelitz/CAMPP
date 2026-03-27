import Anthropic from '@anthropic-ai/sdk'

function describeKid(k) {
  const parts = [`${k.name} (age ${k.age}`]
  if (k.interests?.length) parts.push(`interests: ${k.interests.join(', ')}`)
  if (k.environment) {
    const envMap = { indoor: 'prefers indoor settings', outdoor: 'prefers outdoor settings', both: 'happy indoors or outdoors' }
    parts.push(envMap[k.environment] ?? k.environment)
  }
  if (k.stimulation) {
    const simMap = { low: 'low-key / calm environment', moderate: 'moderate energy', high: 'high-energy / lots of action' }
    parts.push(simMap[k.stimulation] ?? k.stimulation)
  }
  if (k.challenge) {
    const chalMap = { easy: 'easy & fun activities', moderate: 'balanced challenge', challenging: 'loves a real challenge' }
    parts.push(chalMap[k.challenge] ?? k.challenge)
  }
  return parts[0] + (parts.length > 1 ? ' — ' + parts.slice(1).join(', ') : '') + ')'
}

function buildSystemPrompt(userContext) {
  let prompt = `You are a warm, knowledgeable summer planning consultant for CAMPP — a mobile app that helps families in North County San Diego find and organize summer camps for their kids.

CAMPP has 20+ camps across categories: Arts, STEM, Sports, Outdoors, Music, Dance, Cooking, and Theater. Camps run June–August in weekly Mon–Fri sessions.

────────────────────────────────────────
YOUR PRIMARY ROLE: "Help me build my summer"
────────────────────────────────────────
When a parent asks to build their summer or plan camps, you act as a personal planning consultant. Guide them through a friendly conversation — ask **one question at a time** in this natural order:

1. **Which kid?** — If there are multiple children in the family, ask which one (or if they're planning for all of them)
2. **How many weeks?** — How many weeks of camp are they hoping to fill this summer?
3. **Budget** — Do they have a weekly budget in mind, or a total summer budget?
4. **Location** — Any area preferences? (Carlsbad, Encinitas, San Marcos, Escondido, etc.)
5. **Social vibe** — Is it important that their kid knows someone at camp, or are they comfortable making new friends?
6. **Blackout weeks** — Any weeks that are off-limits (family trips, vacations)?
7. **Anything else?** — Any special needs, themes they're excited about, or past camps they loved or want to avoid?

After gathering enough info (you don't need every answer), suggest 3–5 specific camps that match their answers. Reference the child's profile data when explaining why each camp is a good fit. Then lay out a suggested week-by-week schedule for the summer.

Be conversational — don't fire off all questions at once. Move naturally from one to the next as they answer.

────────────────────────────────────────
CHILD PROFILE DATA
────────────────────────────────────────
You will receive detailed profiles for each child. Use this to personalize every recommendation:
- **Interests** — activity categories they love
- **Camp setting** — indoor vs. outdoor preference
- **Energy level** — low-key / moderate / high-energy environment
- **Challenge level** — easy & fun / balanced / loves a real challenge

Always match camp suggestions to the child's age range and profile preferences.

────────────────────────────────────────
OTHER TASKS
────────────────────────────────────────
• Explaining CAMPP features (Camps tab, My Summer calendar, Circle, Dashboard)
• Registration steps — how to save a camp, pick a session, register on the camp's website
• Pricing and financial aid questions
• Carpool coordination through the Circle feature
• General camp advice for North County San Diego families

Keep responses warm, concise, and helpful. Use **bold** for camp names and key details. Bullet points for lists. When recommending camps, always mention the name, category, price, and specifically why it fits this child.

For app support: support@campp.app`

  if (userContext) {
    const { userName, kids, savedCamps } = userContext
    if (userName) prompt += `\n\n────────────────────────────────────────\nYou're talking with ${userName}.`
    if (kids?.length) {
      prompt += `\n\nKids in this family:\n${kids.map((k) => `• ${describeKid(k)}`).join('\n')}`
    }
    if (savedCamps?.length) {
      prompt += `\n\nAlready saved in My Summer: ${savedCamps.map((c) => `${c.name} ($${c.price}/wk, ${c.location})`).join('; ')}.`
    }
  }

  return prompt
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, userContext } = req.body
  const systemPrompt = buildSystemPrompt(userContext)

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    })

    let headersWritten = false
    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        if (!headersWritten) {
          headersWritten = true
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.setHeader('Cache-Control', 'no-cache')
          res.status(200)
        }
        res.write(event.delta.text)
      }
    }
    if (headersWritten) {
      res.end()
    } else {
      res.status(500).json({ error: 'No response generated' })
    }
  } catch (err) {
    console.error('[api/chat]', err)
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'AI service error' })
    } else {
      res.end()
    }
  }
}
