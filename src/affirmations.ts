export const affirmations = [
  "You're allowed to rest.",
  'One step at a time.',
  'You are doing enough.',
  'Your worth is not measured by your grades.',
  "It's okay to ask for help.",
  'Progress, not perfection.',
  "You've made it through every hard day so far.",
  "Breathe in. Breathe out. You're here.",
  'Small wins still count.',
  'You are more than your to-do list.',
  "It's okay to not be okay today.",
  'Be as kind to yourself as you are to your friends.',
  'Your feelings are valid.',
  "You don't have to earn rest.",
  'Drink some water. You deserve care.',
  'You bring something no one else can.',
  "Mistakes mean you're learning.",
  "Today doesn't have to be perfect to be good.",
  'You are not behind. You are on your own path.',
  'Someone is glad you exist.',
  "It's okay to log off for a while.",
  'Your pace is still progress.',
  'You belong here.',
  'Even the toughest bugs get fixed. So will this.',
  'Rest is part of the process, not a break from it.',
  'You are not alone in this.',
  'You are enough, just as you are.',
  "Slow down. This isn't a race.",
  'You matter more than you know.',
  "I'm proud of you, even for the small steps.",
  'Take a deep breath first.',
  'Tomorrow is a fresh start.',
  'Pausing is not giving up.',
  'Your story is still being written.',
  "Look how far you've come.",
  'Done is better than perfect.',
  'You are allowed to take up space.',
  'Have you eaten yet? Take care of yourself too.',
  'This too shall pass.',
  'You can do hard things, and you can rest after.',
  "Your best looks different every day, and that's okay.",
  "Be patient with yourself. You're still growing.",
  'You are worthy of good things.',
  "It's okay to say no.",
  'Your effort counts, even when no one sees it.',
]

let queue: string[] = []
let last = ''

export function nextAffirmation() {
  if (!queue.length) {
    queue = [...affirmations]
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[queue[i], queue[j]] = [queue[j], queue[i]]
    }
    if (queue[queue.length - 1] === last) [queue[0], queue[queue.length - 1]] = [queue[queue.length - 1], queue[0]]
  }
  return (last = queue.pop()!)
}
