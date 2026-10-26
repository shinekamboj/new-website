export const challenges = {
  'math-meteor': {
    mode: 'quiz',
    instructions: 'Answer the quick-fire number questions to fuel your rocket.',
    questions: [
      { prompt: 'What is 7 + 5?', choices: ['10', '12', '13', '15'], answer: 1, tip: '7 plus 5 makes 12.' },
      { prompt: 'What is 18 − 9?', choices: ['7', '8', '9', '10'], answer: 2, tip: '18 take away 9 leaves 9.' },
      { prompt: 'What is 4 × 3?', choices: ['7', '10', '12', '14'], answer: 2, tip: '4 groups of 3 make 12.' },
    ],
  },
  'word-wild': {
    mode: 'word',
    instructions: 'Unscramble each word. Type your answer and press Check word.',
    rounds: [
      { mixed: 'TAC', answer: 'cat', hint: 'A furry pet that says meow.' },
      { mixed: 'RATS', answer: 'star', hint: 'A twinkly shape you might see at night.' },
      { mixed: 'NIPAL', answer: 'plain', hint: 'A wide, flat area of land.' },
    ],
  },
  'dino-lab': {
    mode: 'quiz',
    instructions: 'Put on your explorer hat and discover some dino facts.',
    questions: [
      { prompt: 'What do we call a dinosaur’s preserved remains?', choices: ['A fossil', 'A feather', 'A shell', 'A crystal'], answer: 0, tip: 'Fossils are preserved remains or traces of ancient life.' },
      { prompt: 'Which word means a plant-eating animal?', choices: ['Carnivore', 'Herbivore', 'Omnivore', 'Aquatic'], answer: 1, tip: 'Herbivores eat plants.' },
      { prompt: 'What can a fossil footprint tell scientists?', choices: ['How an animal moved', 'Its favorite color', 'Its name', 'The weather tomorrow'], answer: 0, tip: 'Footprints give clues about how an animal moved.' },
    ],
  },
  'planet-pals': {
    mode: 'quiz',
    instructions: 'Take a trip around the solar system and see what you know.',
    questions: [
      { prompt: 'Which planet is our home?', choices: ['Mars', 'Venus', 'Earth', 'Saturn'], answer: 2, tip: 'We live on planet Earth.' },
      { prompt: 'What is the star at the center of our solar system?', choices: ['The Moon', 'The Sun', 'Jupiter', 'Polaris'], answer: 1, tip: 'The Sun is the star at the center of our solar system.' },
      { prompt: 'Which planet is famous for its beautiful rings?', choices: ['Mercury', 'Earth', 'Saturn', 'Mars'], answer: 2, tip: 'Saturn is well known for its rings.' },
    ],
  },
  'code-camp': {
    mode: 'quiz',
    instructions: 'Spot the pattern and help your robot reach the finish.',
    questions: [
      { prompt: 'What comes next? 2, 4, 6, __', choices: ['7', '8', '9', '10'], answer: 1, tip: 'The numbers go up by 2 each time.' },
      { prompt: 'A robot moves 3 steps, then 3 more. How many steps altogether?', choices: ['5', '6', '7', '9'], answer: 1, tip: '3 plus 3 equals 6 steps.' },
      { prompt: 'Which instruction makes a character repeat an action?', choices: ['Loop', 'Pause', 'Stop', 'Color'], answer: 0, tip: 'A loop repeats an instruction.' },
    ],
  },
  'star-catcher': {
    mode: 'arcade',
    instructions: 'Move your rocket to catch golden stars and dodge the space rocks. Use ← → or A/D, or the touch controls.',
  },
  'turbo-track': {
    mode: 'racing',
    instructions: 'Complete three laps around the track. Hold ↑ or W to accelerate, ←/→ or A/D to steer, and ↓ or S to brake. Touch controls work too.',
  },
  'gem-runner-3d': {
    mode: 'three-dimensional',
    instructions: 'Switch lanes to grab blue gems and avoid red blocks. Use ←/→ or A/D to move, and ↑, W, or Space to jump. Touch controls work too.',
  },
  'neon-drift': {
    mode: 'reflex',
    instructions: 'Wait for the signal to turn green, then tap as quickly as you can. Don’t jump the start!',
  },
  'mythic-realms': {
    mode: 'story',
    instructions: 'Choose a helpful path through this peaceful fantasy adventure.',
    prompt: 'A little dragon has lost its way home. What do you do?',
    choices: [
      { label: 'Follow the bright map together', result: 'You found the valley and made a new friend!', points: 1 },
      { label: 'Ask the village guide for directions', result: 'The guide knows a safe shortcut. Great teamwork!', points: 1 },
      { label: 'Look for friendly landmarks', result: 'The glowing river leads everyone home. Nice exploring!', points: 1 },
    ],
  },
  'outpost-zero': {
    mode: 'resource',
    instructions: 'Power the friendly research station. Gather parts, charge up, and reach 7 energy in 3 moves.',
  },
  'shadow-circuit': {
    mode: 'quiz',
    instructions: 'Crack each clean, brain-teasing pattern to light up the circuit.',
    questions: [
      { prompt: 'What comes next? 2, 4, 8, 16, __', choices: ['18', '24', '30', '32'], answer: 3, tip: 'Each number doubles: 16 × 2 = 32.' },
      { prompt: 'Which shape has no corners?', choices: ['Triangle', 'Circle', 'Rectangle', 'Pentagon'], answer: 1, tip: 'A circle has no corners.' },
      { prompt: 'If today is Monday, what day is two days later?', choices: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], answer: 1, tip: 'Tuesday is one day later, Wednesday is two.' },
    ],
  },
  'summit-bound': {
    mode: 'quiz',
    instructions: 'Solve a few cheerful trail puzzles to reach the summit.',
    questions: [
      { prompt: 'What comes next? 5, 10, 15, __', choices: ['18', '20', '25', '30'], answer: 1, tip: 'The pattern adds 5 each time.' },
      { prompt: 'You walk 2 km in the morning and 3 km later. How far altogether?', choices: ['4 km', '5 km', '6 km', '8 km'], answer: 1, tip: '2 plus 3 equals 5 km.' },
      { prompt: 'Which is the best thing to bring on a sunny hike?', choices: ['A water bottle', 'A snow shovel', 'A kite only', 'A pillow'], answer: 0, tip: 'Water helps you stay hydrated on a hike.' },
    ],
  },
};
