import { createSlice } from '@reduxjs/toolkit';

// First define the initial state structure
const initialFormState = {
  title: '',
  description: '',
  selectedDomain: '',
  selectedType: '',
  sourceLanguage: '',
  targetLanguage: '',
  selectedInstances: [],
  confirmed: false,
  samplingMode: null,
  random: '',
  batchSize: '',
  batchNumber: [],
  selectedAnnotatorsNum: 1,
  taskReviews: 1,
  createannotationsAutomatically: 'none',
  is_published: false,
  passwordForProjects: '',
  conceal: false,
  jsonInput: '',
  isModelSelectionEnabled: true,
  selectedLanguageModels: [],
  fixedModels: [],
  numSelectedModels: 0,
  defaultValue: 0,
  questionsJSON: null
};

const initialState = {
  formData: initialFormState,
  status: 'idle',
  error: null,
};

// Helper functions for localStorage
const loadStateFromStorage = () => {
  try {
    const serializedState = localStorage.getItem('projectFormData');
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return initialState;
  }
};

const saveStateToStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('projectFormData', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

// Create the slice
export const projectFormSlice = createSlice({
  name: 'projectForm',
  initialState: loadStateFromStorage(), // Load from localStorage on initialization
  reducers: {
    saveProjectFormData: (state, action) => {
      console.log(action.payload);
      state.formData = { ...state.formData, ...action.payload };
      // Save to localStorage after update
      saveStateToStorage(state);
    },
    setFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
      // Save to localStorage after update
      saveStateToStorage(state);
    },
    resetForm: (state) => {
      state.formData = initialFormState;
      // Save to localStorage after reset
      saveStateToStorage(state);
    }
  },
});

export const { saveProjectFormData, setFormField, resetForm } = projectFormSlice.actions;

export default projectFormSlice.reducer;