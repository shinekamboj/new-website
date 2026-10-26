export const challenges = {
  'math-meteor': {
    mode: 'quiz',
    instructions: 'Answer the quick-fire number questions to fuel your rocket.',
    questions: [
      { prompt: 'What is 7 + 5?', choices: ['10', '12', '13', '15'], answer: 1, tip: 'Count 7 purple blocks, then 5 green blocks. Together they make 12.', visual: { type: 'add', equation: '7 + 5', groups: [7, 5], total: 12, result: 12, hint: 'Count the glowing blocks in both piles.' } },
      { prompt: 'What is 18 − 9?', choices: ['7', '8', '9', '10'], answer: 2, tip: '9 blocks fly away from 18. Count the 9 bright blocks left.', visual: { type: 'subtract', equation: '18 − 9', total: 18, takeAway: 9, result: 9, hint: 'Dim blocks are taken away. Count the bright blocks that stay.' } },
      { prompt: 'What is 4 × 3?', choices: ['7', '10', '12', '14'], answer: 2, tip: 'There are 4 groups with 3 blocks each: 3, 6, 9, 12.', visual: { type: 'multiply', equation: '4 × 3', groups: 4, perGroup: 3, total: 12, result: 12, hint: 'Count 3 blocks in each of the 4 equal groups.' } },
    ],
  },
  'word-wild': {
    mode: 'word',
    instructions: 'Unscramble each word. Type your answer and press Check word.',
    rounds: [
      { mixed: 'TAC', answer: 'cat', hint: 'A furry pet that says meow.', image: '/images/word-wild/cat-3d.svg', imageAlt: 'A dimensional orange kitten sitting on a little garden stage.' },
      { mixed: 'RATS', answer: 'star', hint: 'A twinkly shape you might see at night.', image: '/images/word-wild/star-3d.svg', imageAlt: 'A bright golden 3D star with a deep shaded side.' },
      { mixed: 'NIPAL', answer: 'plain', hint: 'A wide, flat area of land.', image: '/images/word-wild/plain-3d.svg', imageAlt: 'A floating 3D green plain with flowers and small hills.' },
    ],
  },
  'dino-lab': {
    mode: 'quiz',
    instructions: 'Put on your explorer hat and discover some dino facts.',
    questions: [
      { prompt: 'What do we call a dinosaur’s preserved remains?', choices: ['A fossil', 'A feather', 'A shell', 'A crystal'], answer: 0, tip: 'Fossils are preserved remains or traces of ancient life.', image: '/images/dino-lab/fossil-3d.svg', imageAlt: 'A dinosaur fossil displayed in a dimensional amber rock slab.', imageCaption: 'FOSSIL DISCOVERY', imageTheme: 'fossil' },
      { prompt: 'Which word means a plant-eating animal?', choices: ['Carnivore', 'Herbivore', 'Omnivore', 'Aquatic'], answer: 1, tip: 'Herbivores eat plants.', image: '/images/dino-lab/herbivore-3d.svg', imageAlt: 'A friendly green long-neck dinosaur munching a fern.', imageCaption: 'MEET A HERBIVORE', imageTheme: 'dino' },
      { prompt: 'What can a fossil footprint tell scientists?', choices: ['How an animal moved', 'Its favorite color', 'Its name', 'The weather tomorrow'], answer: 0, tip: 'Footprints give clues about how an animal moved.', image: '/images/dino-lab/footprint-3d.svg', imageAlt: 'Three dinosaur footprints pressed into a raised sandy fossil tile.', imageCaption: 'FOLLOW THE TRACKS', imageTheme: 'fossil' },
    ],
  },
  'planet-pals': {
    mode: 'quiz',
    instructions: 'Take a trip around the solar system and see what you know.',
    questions: [
      { prompt: 'Which planet is our home?', choices: ['Mars', 'Venus', 'Earth', 'Saturn'], answer: 2, tip: 'We live on planet Earth.', image: '/images/planet-pals/earth-3d.svg', imageAlt: 'A bright blue 3D Earth with green continents and white clouds.', imageCaption: 'OUR HOME PLANET', imageTheme: 'earth' },
      { prompt: 'What is the star at the center of our solar system?', choices: ['The Moon', 'The Sun', 'Jupiter', 'Polaris'], answer: 1, tip: 'The Sun is the star at the center of our solar system.', image: '/images/planet-pals/sun-3d.svg', imageAlt: 'A glowing dimensional golden Sun with soft rays.', imageCaption: 'THE SUNNY CENTER', imageTheme: 'sun' },
      { prompt: 'Which planet is famous for its beautiful rings?', choices: ['Mercury', 'Earth', 'Saturn', 'Mars'], answer: 2, tip: 'Saturn is well known for its beautiful rings.', image: '/images/planet-pals/saturn-3d.svg', imageAlt: 'A striped 3D Saturn planet surrounded by golden rings.', imageCaption: 'RINGED SATURN', imageTheme: 'saturn' },
    ],
  },
  'code-camp': {
    mode: 'quiz',
    instructions: 'Help your robot with tiny steps and easy patterns. Look at the picture, then pick an answer.',
    questions: [
      { prompt: 'What comes next? 1, 2, 3, __', choices: ['3', '4', '5', '6'], answer: 1, tip: 'Count one more: 1, 2, 3, 4.', image: '/images/code-camp/number-blocks-3d.svg', imageAlt: 'Three colorful counting blocks with a glowing next block.', imageCaption: 'COUNT ONE MORE', imageTheme: 'dino' },
      { prompt: 'The robot takes 1 step, then 1 more. How many steps?', choices: ['1', '2', '3', '4'], answer: 1, tip: 'One step and one more step makes 2 steps.', image: '/images/code-camp/robot-steps-3d.svg', imageAlt: 'A friendly robot walking two glowing steps along a 3D path.', imageCaption: 'TINY ROBOT STEPS', imageTheme: 'earth' },
      { prompt: 'Which command tells the robot to do steps again?', choices: ['Repeat', 'Pause', 'Paint', 'Hide'], answer: 0, tip: 'Repeat means do those steps again.', image: '/images/code-camp/repeat-loop-3d.svg', imageAlt: 'A little robot following bright arrows around a repeat loop.', imageCaption: 'DO IT AGAIN', imageTheme: 'saturn' },
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
