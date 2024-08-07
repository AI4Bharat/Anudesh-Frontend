// export const questions = [
//   "Fails to follow the correct instruction/task?",
//   "Inappropriate for customer assistance?",
//   "Contains sexual content",
//   "Contains violent content",
//   "Encourages or fails to discourage violence/abuse/terrorism/self-harm",
//   "Denigrates a protected class",
//   "Gives harmful advice?",
//   "Express moral judgement",
// ]

export const questions = [
  { "question_type": "fill_in_blanks", "input_question": "Fish is an <blank> animal. Fishes live under <blank>.", "mandatory": true },
  { "question_type": "rating", "input_question": "Rate this sentence on a scale of 1 to 5 based on grammatical errors and description of a fish", "rating_scale_list": [1, 2, 3, 4, 5], "mandatory": false },
  { "question_type": "multi_select_options", "input_question": "Select the characteristics of fish", "input_selections_list": ["fish is cute", "fishes are found under water", "fishes are dangerous"], "mandatory": false },
  { "question_type": "mcq", "input_question": "Select the characteristics of fish", "input_selections_list": ["fish is cute", "fishes are found under water", "fishes are dangerous"], "mandatory": true },
  { "question_type": "fill_in_blanks", "input_question": "Birds can <blank>. They have <blank>.", "mandatory": false },
  { "question_type": "rating", "input_question": "Rate your experience with our service on a scale of 1 to 10", "rating_scale_list": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "mandatory": true },
  { "question_type": "multi_select_options", "input_question": "Select your favorite fruits", "input_selections_list": ["Apple", "Banana", "Cherry", "Date"], "mandatory": false },
  { "question_type": "mcq", "input_question": "What is the capital of France?", "input_selections_list": ["Paris", "London", "Rome", "Berlin"], "mandatory": true },
  { "question_type": "fill_in_blanks", "input_question": "The sun rises in the <blank> and sets in the <blank>.", "mandatory": false },
  { "question_type": "rating", "input_question": "Rate the quality of our product on a scale of 1 to 10", "rating_scale_list": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "mandatory": true },
  { "question_type": "multi_select_options", "input_question": "Select the modes of transportation you use", "input_selections_list":["Car", "Bicycle", "Bus", "Train"], "mandatory": false },
  { "question_type": "mcq", "input_question": "Which planet is known as the Red Planet?", "input_selections_list": ["Earth", "Mars", "Jupiter", "Saturn"], "mandatory": true },
  { "question_type": "fill_in_blanks", "input_question": "Water freezes at <blank> degrees Celsius.", "mandatory": false },
  { "question_type": "rating", "input_question": "Rate the ease of use of our website on a scale of 1 to 10", "rating_scale_list": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "mandatory": true },
  { "question_type": "multi_select_options", "input_question": "Select the colors you like", "input_selections_list": ["Red", "Blue", "Green", "Yellow"], "mandatory": false },
  { "question_type": "mcq", "input_question": "Which animal is known as the King of the Jungle?", "input_selections_list": ["Lion", "Elephant", "Tiger", "Giraffe"], "mandatory": true },
  { "question_type": "fill_in_blanks", "input_question": "The chemical symbol for water is <blank>.", "mandatory": false },
  { "question_type": "rating", "input_question": "Rate your satisfaction with our customer support on a scale of 1 to 10", "rating_scale_list": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "mandatory": true },
  { "question_type": "multi_select_options", "input_question": "Select the programming languages you are familiar with", "input_selections_list": ["JavaScript", "Python", "Java", "C++"], "mandatory": true },
  { "question_type": "mcq", "input_question": "What is the largest planet in our solar system?", "input_selections_list": ["Earth", "Mars", "Jupiter", "Saturn"], "mandatory": true },
  { "question_type": "fill_in_blanks", "input_question": "The first president of the United States was <blank>.", "mandatory": false },
  { "question_type": "rating", "input_question": "Rate the cleanliness of our facilities on a scale of 1 to 10", "rating_scale_list": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "mandatory": true },
  { "question_type": "multi_select_options", "input_question": "Select the sports you enjoy watching", "input_selections_list": ["Football", "Basketball", "Tennis", "Cricket"], "mandatory": false },
  { "question_type": "mcq", "input_question": "Which element is represented by the symbol 'O'?", "input_selections_list": ["Oxygen", "Hydrogen", "Carbon", "Nitrogen"], "mandatory": true },
  { "question_type": "fill_in_blanks", "input_question": "The largest mammal in the ocean is the <blank>.", "mandatory": false },
  { "question_type": "rating", "input_question": "Rate your overall experience with our company on a scale of 1 to 10", "rating_scale_list": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "mandatory": true }
];
