import {
    Button,
    Grid,
    ThemeProvider,
    Typography,
    Select,
    Box,
    MenuItem,
    InputLabel,
    FormControl,
    Card,
    CircularProgress,
    RadioGroup,
    FormControlLabel,
    Radio,
  } from "@mui/material";
  import tableTheme from "../../themes/tableTheme";
  import themeDefault from "../../themes/theme";
  import React, { useEffect, useState } from "react";
//   import { useSelector, useDispatch } from "react-redux";
//   import APITransport from "../../../../redux/actions/apitransport/apitransport";
  // import Snackbar from "../common/Snackbar";
  // import UserMappedByRole from "../../../utils/UserMappedByRole/UserMappedByRole";
  // import {
  //   addDays,
  //   addWeeks,
  //   format,
  //   lastDayOfWeek,
  //   startOfMonth,
  //   startOfWeek,
  // } from "date-fns";
//   import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
  import MUIDataTable from "mui-datatables";
  import  "../../styles/Dataset.css";
  import ColumnList from "../common/ColumnList";
  import CustomizedSnackbars from "../common/Snackbar";
//   import { isSameDay, format } from 'date-fns/esm';
  import { DateRangePicker, defaultStaticRanges } from "react-date-range";
  import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
  import ArrowRightIcon from "@mui/icons-material/ArrowRight";
  import Spinner from "../common/Spinner";
  import { MenuProps } from "../../utils/utils";
  
  const MyProgress = () => {
 
    const [showPicker, setShowPicker] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const [projectTypes, setProjectTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [radiobutton, setRadiobutton] = useState("AnnotatationReports");
    const [workspaces, setWorkspaces] = useState([]);
    const [totalsummary, setTotalsummary] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);
    // const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
    const Workspaces = [];
    const UserAnalytics = [];
    const UserAnalyticstotalsummary = [];
    // const apiLoading = useSelector(state => state.apiStatus.loading);
    // const dispatch = useDispatch();
const ProjectTypes={
    "Translation": {
        "description": "Translating sentences from source to target language",
        "project_types": {
            "MonolingualTranslation": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "translation/monolingual_translation.jsx",
                "input_dataset": {
                    "class": "SentenceText",
                    "fields": [
                        "language",
                        "text"
                    ],
                    "display_fields": [
                        "text"
                    ]
                },
                "output_dataset": {
                    "class": "TranslationPair",
                    "save_type": "new_record",
                    "fields": {
                        "variable_parameters": [
                            "output_language"
                        ],
                        "copy_from_input": {
                            "language": "input_language",
                            "text": "input_text"
                        },
                        "annotations": [
                            "output_text"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n  <Style>.ant-input { font-size: large; }</Style>\n  <View style=\"font-size: large; display: grid; grid-template: auto/1fr 1fr; column-gap: 1em\">\n    <Header size=\"3\" value=\"Source sentence\"/>\n    <Header size=\"3\" value=\"$output_language translation\"/>\n    <Text name=\"input_text\" value=\"$input_text\"/>\n    <TextArea name=\"output_text\" toName=\"input_text\" rows=\"5\" transcription=\"true\" showSubmitButton=\"true\" maxSubmissions=\"1\" editable=\"false\" required=\"true\"/>\n  </View>\n</View>\n",
                "domain": "Translation"
            },
            "TranslationEditing": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "translation/translation_editing.jsx",
                "input_dataset": {
                    "class": "TranslationPair",
                    "fields": [
                        "input_language",
                        "input_text",
                        "output_language",
                        "machine_translation"
                    ],
                    "display_fields": [
                        "input_text",
                        "machine_translation"
                    ]
                },
                "output_dataset": {
                    "class": "TranslationPair",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "output_text"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n  <Style>.ant-input { font-size: large; }</Style>\n  <View style=\"font-size: large; display: grid; grid-template: auto/1fr 1fr 1fr; column-gap: 1em\">\n    <Header size=\"3\" value=\"Source sentence\"/>\n    <Header size=\"3\" value=\"$output_language translation\"/>\n    <Header size=\"3\" value=\"Machine translation\"/>\n    <Text name=\"input_text\" value=\"$input_text\"/>\n    <TextArea name=\"output_text\" toName=\"input_text\" value=\"$machine_translation\" rows=\"5\" transcription=\"true\" showSubmitButton=\"true\" maxSubmissions=\"1\" editable=\"false\" required=\"true\"/>\n    <Text name=\"machine_translation\" value=\"$machine_translation\"/>\n  </View>\n</View>\n",
                "domain": "Translation"
            },
            "SemanticTextualSimilarity_Scale5": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "translation/semantic_textual_similarity_scale5.jsx",
                "input_dataset": {
                    "class": "TranslationPair",
                    "fields": [
                        "input_language",
                        "input_text",
                        "output_language",
                        "output_text"
                    ],
                    "display_fields": [
                        "input_text",
                        "output_text"
                    ]
                },
                "output_dataset": {
                    "class": "TranslationPair",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "rating"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n    <Style>.ant-input { font-size: large; }</Style>\n    <View style=\"font-size: large; display: grid; grid-template: auto/1fr 1fr; column-gap: 1em\">\n        <Header size=\"3\" value=\"Source sentence\"/>\n        <Header size=\"3\" value=\"Translated Sentence\"/>\n        <Text name=\"input_text\" value=\"$input_text\"/>\n        <Text name=\"output_text\" value=\"$output_text\"/>\n    </View>\n    <View>\n        <Header size=\"3\" value=\"Rating\"/>\n        <Choices name=\"rating\" toName=\"output_text\" choice=\"single-radio\" required=\"true\" requiredMessage=\"Please select a rating for the translation\">\n            <Choice alias=\"1\" value=\"1, Two sentences are not equivalent, share very little details, and may be about different topics.\" />\n            <Choice alias=\"2\" value=\"2, Two sentences share some details, but are not equivalent.\" />\n            <Choice alias=\"3\" value=\"3, Two sentences are mostly equivalent, but some unimportant details can differ.\" />\n            <Choice alias=\"4\" value=\"4, Two sentences are paraphrases of each other. Their meanings are near-equivalent, with no major differences or information missing.\" />\n            <Choice alias=\"5\" value=\"5, Two sentences are exactly and completely equivalent in meaning and usage expression.\" />\n        </Choices>\n    </View>\n</View>\n",
                "domain": "Translation"
            },
            "ContextualTranslationEditing": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "translation/contextual_translation_editing.jsx",
                "input_dataset": {
                    "class": "TranslationPair",
                    "fields": [
                        "input_language",
                        "input_text",
                        "output_language",
                        "machine_translation",
                        "context"
                    ],
                    "display_fields": [
                        "input_text",
                        "machine_translation"
                    ]
                },
                "output_dataset": {
                    "class": "TranslationPair",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "output_text"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n  <Style>.ant-input { font-size: large; }</Style>\n  <View style=\"font-size: large; display: grid; grid-template: auto/1fr 1fr 1fr; column-gap: 1em\">\n    <Header size=\"3\" value=\"Source sentence\"/>\n    <Header size=\"3\" value=\"$output_language translation\"/>\n    <Header size=\"3\" value=\"Machine translation\"/>\n    <Text name=\"input_text\" value=\"$input_text\"/>\n    <TextArea name=\"output_text\" toName=\"input_text\" value=\"$machine_translation\" rows=\"5\" transcription=\"true\" showSubmitButton=\"true\" maxSubmissions=\"1\" editable=\"false\" required=\"true\"/>\n    <Text name=\"machine_translation\" value=\"$machine_translation\"/>\n  </View>\n  <View style=\"font-size: large; display: grid; grid-template: auto; column-gap: 1em\">\n    <Header size=\"3\" value=\"Context\"/>\n    <Text name=\"context\" value=\"$context\"/>\n  </View>\n</View>\n",
                "domain": "Translation"
            }
        }
    },
    "OCR": {
        "description": "Performing OCR on images",
        "project_types": {
            "OCRTranscription": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "ocr/ocr_transcription.jsx",
                "input_dataset": {
                    "class": "OCRDocument",
                    "fields": [
                        "image_url"
                    ],
                    "display_fields": [
                        "image_url"
                    ],
                    "prediction": "ocr_prediction_json"
                },
                "output_dataset": {
                    "class": "OCRDocument",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "ocr_transcribed_json"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n  <Style>.ant-input { font-size: large; }</Style>\n  <Image name=\"image_url\" value=\"$image_url\"/>\n\n  <Labels name=\"annotation_labels\" toName=\"image_url\" className=\"ignore_assertion\">\n    <Label value=\"Header\" background=\"green\"/>\n    <Label value=\"Body\" background=\"blue\"/>\n    <Label value=\"Footer\" background=\"orange\"/>\n  </Labels>\n\n  <Rectangle name=\"annotation_bboxes\" toName=\"image_url\" strokeWidth=\"3\" className=\"ignore_assertion\"/>\n\n  <TextArea name=\"ocr_transcribed_json\" toName=\"image_url\"\n            editable=\"true\"\n            perRegion=\"true\"\n            required=\"true\"\n            maxSubmissions=\"1\"\n            rows=\"5\"\n            placeholder=\"Recognized Text\"\n            />\n</View>\n",
                "domain": "OCR"
            },
            "OCRTranscriptionEditing": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "ocr/ocr_transcription.jsx",
                "input_dataset": {
                    "class": "OCRDocument",
                    "fields": [
                        "image_url"
                    ],
                    "display_fields": [
                        "image_url"
                    ],
                    "prediction": "ocr_prediction_json"
                },
                "output_dataset": {
                    "class": "OCRDocument",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "ocr_transcribed_json"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n  <Style>.ant-input { font-size: large; }</Style>\n  <Image name=\"image_url\" value=\"$image_url\"/>\n\n  <Labels name=\"annotation_labels\" toName=\"image_url\" className=\"ignore_assertion\">\n    <Label value=\"Header\" background=\"green\"/>\n    <Label value=\"Body\" background=\"blue\"/>\n    <Label value=\"Footer\" background=\"orange\"/>\n  </Labels>\n\n  <Rectangle name=\"annotation_bboxes\" toName=\"image_url\" strokeWidth=\"3\" className=\"ignore_assertion\"/>\n\n  <TextArea name=\"ocr_transcribed_json\" toName=\"image_url\"\n            editable=\"true\"\n            perRegion=\"true\"\n            required=\"true\"\n            maxSubmissions=\"1\"\n            rows=\"5\"\n            placeholder=\"Recognized Text\"\n            />\n</View>\n",
                "domain": "OCR"
            }
        }
    },
    "Monolingual": {
        "description": "Monolingual Data Collection",
        "project_types": {
            "MonolingualCollection": {
                "project_mode": "Collection",
                "output_dataset": {
                    "class": "BlockText",
                    "save_type": "new_record",
                    "fields": {
                        "annotations": [
                            "domain",
                            "text"
                        ],
                        "variable_parameters": [
                            "language"
                        ]
                    }
                },
                "domain": "Monolingual"
            },
            "SentenceSplitting": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "monolingual/sentence_splitting.jsx",
                "input_dataset": {
                    "class": "BlockText",
                    "fields": [
                        "text",
                        "language"
                    ],
                    "display_fields": [
                        "text"
                    ],
                    "prediction": "splitted_text_prediction"
                },
                "output_dataset": {
                    "class": "BlockText",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "splitted_text"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n  <Style>.ant-input { font-size: large; }</Style>\n  <Header size=\"3\" value=\"Block Text\"/>\n  <View style=\"font-size: large\">\n    <Text name=\"text\" value=\"$text\" />\n  </View>\n  <Header size=\"3\" value=\"Split into Sentences\" />\n  <View style=\"font-size: large\">\n    <TextArea name=\"splitted_text\" toName =\"text\" rows=\"20\" showSubmitButton=\"true\" maxSubmissions=\"1\" editable=\"true\" required=\"true\"/>\n  </View>\n</View>\n",
                "domain": "Monolingual"
            },
            "ContextualSentenceVerification": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "monolingual/contextual_sentence_verification.jsx",
                "input_dataset": {
                    "class": "SentenceText",
                    "fields": [
                        "text",
                        "context",
                        "language"
                    ],
                    "display_fields": [
                        "text"
                    ]
                },
                "output_dataset": {
                    "class": "SentenceText",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "corrected_text",
                            "quality_status"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n  <Style>.ant-input { font-size: large; }</Style>\n  <View style=\"font-size: large; display: grid; grid-template: auto/1fr 1fr 1fr; column-gap: 1em\">\n    <Header size=\"3\" value=\"$language Sentence\"/>\n    <Header size=\"3\" value=\"Corrected Sentence\"/>\n    <Header size=\"3\" value=\"Quality Status\"/>\n    <Text name=\"text\" value=\"$text\"/>\n    <TextArea name=\"corrected_text\" toName=\"text\" value=\"$text\" rows=\"5\" transcription=\"true\" showSubmitButton=\"true\" maxSubmissions=\"1\" editable=\"false\" required=\"true\"/>\n  \t<Choices name=\"quality_status\" toName=\"text\" choice=\"single-radio\" required=\"true\">\n    \t<Choice value=\"Clean\" selected=\"true\"/>\n    \t<Choice value=\"Profane\" />\n      <Choice value=\"Difficult vocabulary\" />\n      <Choice value=\"Ambiguous sentence\" />\n      <Choice value=\"Context incomplete\" />\n    \t<Choice value=\"Corrupt\" />\n  \t</Choices>\n  </View>\n  <View style=\"font-size: large; display: grid; grid-template: auto; column-gap: 1em\">\n    <Header size=\"3\" value=\"Context\"/>\n    <Text name=\"context\" value=\"$context\"/>\n  </View>\n</View>\n",
                "domain": "Monolingual"
            },
            "ContextualSentenceVerificationAndDomainClassification": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "monolingual/contextual_sentence_verification_and_domain_classifcation.jsx",
                "input_dataset": {
                    "class": "SentenceText",
                    "fields": [
                        "text",
                        "context",
                        "language"
                    ],
                    "display_fields": [
                        "text"
                    ]
                },
                "output_dataset": {
                    "class": "SentenceText",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "corrected_text",
                            "quality_status",
                            "domain"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n  <Style>.ant-input { font-size: large; }</Style>\n  <View style=\"font-size: large; display: grid; grid-template: auto/1fr 1fr 1fr; column-gap: 1em\">\n    <Header size=\"3\" value=\"$language Sentence\"/>\n    <Header size=\"3\" value=\"Corrected Sentence\"/>\n    <Header size=\"3\" value=\"Quality Status\"/>\n    <Text name=\"text\" value=\"$text\"/>\n    <TextArea name=\"corrected_text\" toName=\"text\" value=\"$text\" rows=\"5\" transcription=\"true\" showSubmitButton=\"true\" maxSubmissions=\"1\" editable=\"false\" required=\"true\"/>\n  \t<Choices name=\"quality_status\" toName=\"text\" choice=\"single-radio\" required=\"true\">\n    \t<Choice value=\"Clean\" selected=\"true\"/>\n    \t<Choice value=\"Profane\" />\n        <Choice value=\"Difficult vocabulary\" />\n        <Choice value=\"Ambiguous sentence\" />\n        <Choice value=\"Context incomplete\" />\n    \t<Choice value=\"Corrupt\" />\n  \t</Choices>\n  </View>\n<View visibleWhen=\"choice-selected\" whenTagName=\"quality_status\" whenChoiceValue=\"Clean\"\nstyle=\"font-size: large; display: grid; grid-template: auto; column-gap: 1em\">\n  <Header size=\"3\" value=\"Domain\"/> \n <Taxonomy name=\"domain\" toName=\"text\" maxUsages=\"1\" required=\"true\">\n      <Choice value=\"None\" selected=\"true\"/>\n      <Choice value=\"General\" />\n      <Choice value=\"News\" />\n      <Choice value=\"Education\" />\n      <Choice value=\"Legal\" />\n      <Choice value=\"Government-Press-Release\" />\n      <Choice value=\"Healthcare\" />\n      <Choice value=\"Agriculture\" />\n      <Choice value=\"Automobile\" />\n      <Choice value=\"Tourism\" />\n      <Choice value=\"Financial\" />\n      <Choice value=\"Movies\" />\n      <Choice value=\"Subtitles\" />\n      <Choice value=\"Sports\" />\n      <Choice value=\"Technology\" />\n      <Choice value=\"Lifestyle\" />\n      <Choice value=\"Entertainment\" />\n      <Choice value=\"Parliamentary\" />\n      <Choice value=\"Art-and-Culture\" />\n      <Choice value=\"Economy\" />\n      <Choice value=\"History\" />\n      <Choice value=\"Philosophy\" />\n      <Choice value=\"Religion\"/>\n      <Choice value=\"National-Security-and-Defence\"/>\n      <Choice value=\"Literature\"/>\n      <Choice value=\"Geography\"/>\n  \t</Taxonomy>\n</View>\n  <View style=\"font-size: large; display: grid; grid-template: auto; column-gap: 1em\">\n    <Header size=\"3\" value=\"Context\"/>\n    <Text name=\"context\" value=\"$context\"/>\n  </View>\n</View>\n",
                "domain": "Monolingual"
            }
        }
    },
    "Conversation": {
        "description": "Translation of Conversation data",
        "project_types": {
            "ConversationTranslation": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "conversation/conversation_translation.jsx",
                "input_dataset": {
                    "class": "Conversation",
                    "fields": [
                        "domain",
                        "topic",
                        "scenario",
                        "prompt",
                        "speaker_count",
                        "speakers_json",
                        "conversation_json",
                        "machine_translated_conversation_json"
                    ]
                },
                "output_dataset": {
                    "class": "Conversation",
                    "save_type": "new_record",
                    "fields": {
                        "variable_parameters": [
                            "language"
                        ],
                        "copy_from_input": {
                            "domain": "domain",
                            "topic": "topic",
                            "scenario": "scenario",
                            "prompt": "prompt",
                            "speaker_count": "speaker_count",
                            "speakers_json": "speakers_json",
                            "machine_translated_conversation_json": "machine_translated_conversation_json"
                        },
                        "annotations": [
                            "conversation_json"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n\n</View>",
                "domain": "Conversation"
            },
            "ConversationTranslationEditing": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "conversation/conversation_translation.jsx",
                "input_dataset": {
                    "class": "Conversation",
                    "parent_class": "Conversation",
                    "fields": [
                        "domain",
                        "topic",
                        "scenario",
                        "prompt",
                        "speaker_count",
                        "speakers_json",
                        "machine_translated_conversation_json",
                        "parent_data",
                        "language"
                    ],
                    "display_fields": [
                        "domain",
                        "topic",
                        "scenario",
                        "prompt"
                    ],
                    "copy_from_parent": {
                        "conversation_json": "source_conversation_json"
                    }
                },
                "output_dataset": {
                    "class": "Conversation",
                    "save_type": "in_place",
                    "fields": {
                        "variable_parameters": [
                            "language"
                        ],
                        "annotations": [
                            "conversation_json"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n\n</View>",
                "domain": "Conversation"
            },
            "ConversationVerification": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "conversation/conversation_verification.jsx",
                "input_dataset": {
                    "class": "Conversation",
                    "fields": [
                        "domain",
                        "topic",
                        "scenario",
                        "prompt",
                        "speaker_count",
                        "speakers_json",
                        "unverified_conversation_json"
                    ]
                },
                "output_dataset": {
                    "class": "Conversation",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "conversation_quality_status",
                            "conversation_json"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n\n</View>",
                "domain": "Conversation"
            }
        }
    },
    "Audio": {
        "description": "Projects related to audio-processing",
        "project_types": {
            "AudioTranscription": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "audio/audio_transcription.jsx",
                "input_dataset": {
                    "class": "SpeechConversation",
                    "fields": [
                        "audio_url",
                        "reference_raw_transcript",
                        "audio_duration",
                        "scenario",
                        "domain",
                        "speakers_json"
                    ],
                    "display_fields": [
                        "scenario",
                        "audio_url"
                    ],
                    "prediction": "machine_transcribed_json"
                },
                "output_dataset": {
                    "class": "SpeechConversation",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "transcribed_json"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View> \n\n   <Header value=\"Speaker Details\" />          \n   {speaker_0_details ?\n   <Text name=\"speaker_0_details\" className=\"ignore_assertion\"\n    value=\"$speaker_0_details\"/> : null} \n   {speaker_1_details ?\n   <Text name=\"speaker_1_details\" className=\"ignore_assertion\"\n    value=\"$speaker_1_details\"/> : null} \n\n  <Labels name=\"labels\" toName=\"audio_url\" className=\"ignore_assertion\"> \n    {speaker_0_details ? <Label value=\"Speaker 0\" />  : null} \n    {speaker_1_details ? <Label value=\"Speaker 1\" />  : null}\n  </Labels> \n  <AudioPlus name=\"audio_url\" value=\"$audio_url\"/> \n  \n  <View visibleWhen=\"region-selected\"> \n    <Header value=\"Provide Transcription\" /> \n  </View> \n  <View style=\"overflow: auto; width: 50%;\">\n<TextArea name=\"transcribed_json\" transcription=\"true\" toName=\"audio_url\" \n            rows=\"2\" editable=\"false\" maxSubmissions=\"1\"\n            perRegion=\"true\" required=\"true\"/>\n  </View>\n              \n  {reference_raw_transcript ? <Header value=\"Reference Transcript\" /> \n   <Text name=\"reference_raw_transcript\" \n    value=\"$reference_raw_transcript\"/> : null}\n\n   \n</View> \n \n",
                "domain": "Audio"
            },
            "AudioSegmentation": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "audio/audio_segmentation.jsx",
                "input_dataset": {
                    "class": "SpeechConversation",
                    "fields": [
                        "audio_url",
                        "audio_duration",
                        "scenario",
                        "domain",
                        "speakers_json"
                    ],
                    "display_fields": [
                        "scenario",
                        "audio_url"
                    ],
                    "prediction": "machine_transcribed_json"
                },
                "output_dataset": {
                    "class": "SpeechConversation",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "prediction_json"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View> \n\n   <Header value=\"Speaker Details\" />          \n   {speaker_0_details ?\n   <Text name=\"speaker_0_details\" className=\"ignore_assertion\"\n    value=\"$speaker_0_details\"/> : null} \n   {speaker_1_details ?\n   <Text name=\"speaker_1_details\" className=\"ignore_assertion\"\n    value=\"$speaker_1_details\"/> : null} \n\n  <Labels name=\"labels\" toName=\"audio_url\" className=\"ignore_assertion\"> \n    {speaker_0_details ? <Label value=\"Speaker 0\" />  : null} \n    {speaker_1_details ? <Label value=\"Speaker 1\" />  : null}\n  </Labels> \n  <AudioPlus name=\"audio_url\" value=\"$audio_url\"/> \n\n   \n</View> ",
                "domain": "Audio"
            },
            "AudioTranscriptionEditing": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "audio/audio_transcription.jsx",
                "input_dataset": {
                    "class": "SpeechConversation",
                    "fields": [
                        "audio_url",
                        "reference_raw_transcript",
                        "audio_duration",
                        "scenario",
                        "domain",
                        "speakers_json"
                    ],
                    "display_fields": [
                        "scenario",
                        "audio_url"
                    ],
                    "prediction": "machine_transcribed_json"
                },
                "output_dataset": {
                    "class": "SpeechConversation",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "transcribed_json"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View> \n\n   <Header value=\"Speaker Details\" />          \n   {speaker_0_details ?\n   <Text name=\"speaker_0_details\" className=\"ignore_assertion\"\n    value=\"$speaker_0_details\"/> : null} \n   {speaker_1_details ?\n   <Text name=\"speaker_1_details\" className=\"ignore_assertion\"\n    value=\"$speaker_1_details\"/> : null} \n\n  <Labels name=\"labels\" toName=\"audio_url\" className=\"ignore_assertion\"> \n    {speaker_0_details ? <Label value=\"Speaker 0\" />  : null} \n    {speaker_1_details ? <Label value=\"Speaker 1\" />  : null}\n  </Labels> \n  <AudioPlus name=\"audio_url\" value=\"$audio_url\"/> \n  \n  <View visibleWhen=\"region-selected\"> \n    <Header value=\"Provide Transcription\" /> \n  </View> \n  <View style=\"overflow: auto; width: 50%;\">\n<TextArea name=\"transcribed_json\" transcription=\"true\" toName=\"audio_url\" \n            rows=\"2\" editable=\"false\" maxSubmissions=\"1\"\n            perRegion=\"true\" required=\"true\"/>\n  </View>\n              \n  {reference_raw_transcript ? <Header value=\"Reference Transcript\" /> \n   <Text name=\"reference_raw_transcript\" \n    value=\"$reference_raw_transcript\"/> : null}\n\n   \n</View> \n \n",
                "domain": "Audio"
            },
            "AcousticNormalisedTranscriptionEditing": {
                "project_mode": "Annotation",
                "label_studio_jsx_file": "audio/acoustic_transcription.jsx",
                "input_dataset": {
                    "class": "SpeechConversation",
                    "fields": [
                        "audio_url",
                        "reference_raw_transcript",
                        "audio_duration",
                        "scenario",
                        "domain",
                        "speakers_json"
                    ],
                    "display_fields": [
                        "scenario",
                        "audio_url"
                    ],
                    "prediction": "machine_transcribed_json"
                },
                "output_dataset": {
                    "class": "SpeechConversation",
                    "save_type": "in_place",
                    "fields": {
                        "annotations": [
                            "transcribed_json"
                        ]
                    }
                },
                "label_studio_jsx_payload": "<View>\n\n  <Header value=\"Speaker Details\" />\n  {speaker_0_details ?\n    <Text name=\"speaker_0_details\" className=\"ignore_assertion\"\n      value=\"$speaker_0_details\" /> : null}\n  {speaker_1_details ?\n    <Text name=\"speaker_1_details\" className=\"ignore_assertion\"\n      value=\"$speaker_1_details\" /> : null}\n\n  <Labels name=\"labels\" toName=\"audio_url\" className=\"ignore_assertion\">\n    {speaker_0_details ? <Label value=\"Speaker 0\" /> : null}\n    {speaker_1_details ? <Label value=\"Speaker 1\" /> : null}\n  </Labels>\n  <AudioPlus name=\"audio_url\" value=\"$audio_url\" />\n\n  <View visibleWhen=\"region-selected\">\n    <Header value=\"Provide Transcription\" />\n  </View>\n  <View style=\"overflow: auto; width: 50%;\">\n    <TextArea name=\"verbatim_transcribed_json\" transcription=\"true\" toName=\"audio_url\" \n      rows=\"2\" editable=\"false\" maxSubmissions=\"1\"\n      perRegion=\"true\" required=\"true\" className=\"ignore_assertion\"/>\n  </View>\n  <View style=\"display: none;\">\n    <TextArea name=\"acoustic_normalised_transcribed_json\" toName=\"audio_url\" perRegion=\"true\" className=\"ignore_assertion\" />\n    <TextArea name=\"standardised_transcription\" toName=\"audio_url\" className=\"ignore_assertion\"/>\n  </View>\n  {reference_raw_transcript ? <Header value=\"Reference Transcript\" /> \n   <Text name=\"reference_raw_transcript\" \n    value=\"$reference_raw_transcript\"/> : null}\n\n</View >\n\n",
                "domain": "Audio"
            }
        }
    }
}

    const UserDetails= {
        "id": 1,
        "username": "shoonya",
        "email": "shoonya@ai4bharat.org",
        "languages": [],
        "availability_status": 1,
        "enable_mail": false,
        "first_name": "Admin",
        "last_name": "AI4B",
        "phone": "",
        "profile_photo": "",
        "role": 6,
        "organization": {
            "id": 1,
            "title": "AI4Bharat",
            "email_domain_name": "ai4bharat.org",
            "created_by": {
                "username": "shoonya",
                "email": "shoonya@ai4bharat.org",
                "first_name": "Admin",
                "last_name": "AI4B",
                "role": 6
            },
            "created_at": "2022-04-24T13:11:30.339610Z"
        },
        "unverified_email": "shoonya@ai4bharat.org",
        "date_joined": "2022-04-24T07:40:11Z",
        "participation_type": 3,
        "prefer_cl_ui": false,
        "is_active": true
    };
    
    const [selectRange, setSelectRange] = useState([{
        startDate: new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
        endDate: new Date(),
        key: "selection"
      }]);
    

    const handleRangeChange = (ranges) => {
      const { selection } = ranges;
      if (selection.endDate > new Date()) selection.endDate = new Date();
      setSelectRange([selection]);
      console.log(selection, "selection");
    };
  
    const handleProgressSubmit = () => {
      setShowPicker(false);
      setSubmitted(true);
      // if (!selectedWorkspaces.length) {
      //   setSnackbarText("Please select atleast one workspace!");
      //   showSnackbar();
      //   return;
      // }
      const reviewdata = {
        user_id: id,
        project_type: selectedType,
        reports_type: radiobutton === "AnnotatationReports" ? "annotation" :radiobutton ==="ReviewerReports" ? "review" : "supercheck" ,
        start_date: format(selectRange[0].startDate, 'yyyy-MM-dd'),
        end_date: format(selectRange[0].endDate, 'yyyy-MM-dd'),
  
      }
  
      
      const progressObj = new GetUserAnalyticsAPI(reviewdata);
      dispatch(APITransport(progressObj));
      // setShowSpinner(true);
      setTotalsummary(true)
  
    };
  
    const showSnackbar = () => {
      setSnackbarOpen(true);
    };
  
    const closeSnackbar = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setSnackbarOpen(false);
    };
  
    const handleChangeReports = (e) => {
      setRadiobutton(e.target.value)
    }
  
  
    const renderToolBar = () => {
      return (
        <Box className="filterToolbarContainer">
          <ColumnList
            columns={columns}
            setColumns={setSelectedColumns}
            selectedColumns={selectedColumns}
          />
        </Box>
      );
    };
  
    const tableOptions = {
      filterType: "checkbox",
      selectableRows: "none",
      download: false,
      filter: false,
      print: false,
      search: false,
      viewColumns: false,
      jumpToPage: true,
      customToolbar: renderToolBar,
    };
    const tableOptionstotalSummary = {
      filterType: "checkbox",
      selectableRows: "none",
      download: false,
      filter: false,
      print: false,
      search: false,
      viewColumns: false,
      jumpToPage: true,
      customToolbar: renderToolBar,
    };
    return (
      <ThemeProvider theme={themeDefault}>
        {/* <Header /> */}
        {loading && <Spinner />}
        <Grid
          container
          direction="row"
          justifyContent="start"
          alignItems="center"
          // sx={{ marginLeft: "50px" }}
        >
          <Grid >
            <Typography gutterBottom component="div" sx={{ marginTop: "15px", fontSize: "16px" }}>
              Select Report Type :
            </Typography>
          </Grid>
          <FormControl>
  
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              sx={{ marginTop: "10px", marginLeft: "20px" }}
              value={radiobutton}
              onChange={handleChangeReports}
  
            >
              <FormControlLabel value="AnnotatationReports" control={<Radio />} label="Annotator" />
              <FormControlLabel value="ReviewerReports" control={<Radio />} label="Reviewer" />
              <FormControlLabel value="SuperCheckerReports" control={<Radio />} label="Super Checker" />
  
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
  
          <Grid container columnSpacing={4} rowSpacing={2} mt={1} mb={1} justifyContent="flex-start">
  
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>
                  Project Type
                </InputLabel>
                <Select
                  labelId="project-type-label"
                  id="project-type-select"
                  value={selectedType}
                  label="Project Type"
                  onChange={(e) => setSelectedType(e.target.value)}
                  MenuProps={MenuProps}
                >
                  {projectTypes.map((type, index) => (
                    <MenuItem value={type} key={index}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
              <Button
                endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                variant="contained"
                color="primary"
                sx={{width:"130px"}}
                onClick={() => setShowPicker(!showPicker)}
              >
                Pick Dates
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleProgressSubmit}
                sx={{width:"130px"}}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
          {showPicker && <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }}>
            <Card sx={{ overflowX: "scroll" }}>
              <DateRangePicker
                onChange={handleRangeChange}
                staticRanges={[
                  ...defaultStaticRanges,
                  {
                    label: "Till Date",
                    range: () => ({
                      startDate: new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
                      endDate: new Date(),
                    }),
                    isSelected(range) {
                      const definedRange = this.range();
                      return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                      );
                    }
                  },
                ]}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={selectRange}
                minDate={new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ'))}
                maxDate={new Date()}
                direction="horizontal"
              />
  
            </Card>
  
  
          </Box>}
          {radiobutton === "AnnotatationReports" && totalsummary && <Grid
            container
            direction="row"
            sx={{ mb: 3, mt: 2 }}
          >
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="h6">Total Summary </Typography>
  
            </Grid>
  
            <Grid
              container
              alignItems="center"
              direction="row"
  
            >
              <Typography variant="subtitle1">Annotated Tasks : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Annotated Tasks"]}</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              direction="row"
  
  
            >
              <Typography variant="subtitle1">Average Annotation Time (In Seconds) : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Avg Annotation Time (sec)"]}</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Word Count : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Word Count"]}</Typography>
            </Grid>
          </Grid>
          }
        
  
          {radiobutton === "ReviewerReports" && totalsummary && <Grid
            container
            alignItems="center"
            direction="row"
            sx={{ mb: 3, mt: 2 }}
  
          >
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="h6">Total Summary </Typography>
  
            </Grid>
  
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Reviewed Tasks : </Typography>
              <Typography variant="body2" className="TotalSummarydata" >{UserAnalyticstotalsummary?.at(0)?.["Reviewed Tasks"]}</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Average Review Time (In Seconds) : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Avg Review Time (sec)"]}</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Word Count : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Word Count"]}</Typography>
            </Grid>
          </Grid>}
          {radiobutton === "SuperCheckerReports" && totalsummary && <Grid
            container
            alignItems="center"
            direction="row"
            sx={{ mb: 3, mt: 2 }}
  
          >
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="h6">Total Summary </Typography>
  
            </Grid>
  
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Super Checker Tasks : </Typography>
              <Typography variant="body2" className="TotalSummarydata" >{UserAnalyticstotalsummary?.at(0)?.["SuperChecked Tasks"]}</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Average Super Checker Time (In Seconds) : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Avg SuperCheck Time (sec)"]}</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Word Count : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Word Count"]}</Typography>
            </Grid>
          </Grid>}
          {UserAnalytics?.length > 0 ? (
            <ThemeProvider theme={tableTheme}>
              <MUIDataTable
               title={radiobutton==="AnnotatationReports"? "Annotation Report" :radiobutton==="ReviewerReports"? "Reviewer Report":"Super Checker Report"}
                data={reportData}
                columns={columns.filter((col) => selectedColumns.includes(col.name))}
                options={tableOptions}
              />
            </ThemeProvider>
          ) : <Grid
            container
            justifyContent="center"
          >
            <Grid item sx={{ mt: "10%" }}>
              {showSpinner ? <CircularProgress color="primary" size={50} /> : (
                !reportData?.length && submitted && <>No results</>
              )}
            </Grid>
          </Grid>
          }
        </Grid>
        <CustomizedSnackbars message={snackbarText} open={snackbarOpen} hide={2000} handleClose={closeSnackbar} anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }} variant="error" />
      </ThemeProvider>
    );
  };
  
  export default MyProgress;
  