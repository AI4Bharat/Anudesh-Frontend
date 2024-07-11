"use client";

import { useState, useEffect } from "react";
import Button from "../../../../components/common/Button";
import RefreshIcon from '@mui/icons-material/Refresh';
import ModelResponseEvaluationStyle from "@/styles/ModelResponseEvaluation";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TextareaAutosize,
  Box,
  Typography,
  Icon,
  IconButton,
  Grid,
} from "@mui/material";
import "./model_response_evaluation.css";
import { Paper } from "@mui/material";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Resizable } from "re-resizable";
import { translate } from "@/config/localisation";
import GetTaskAnnotationsAPI from "@/app/actions/api/Dashboard/GetTaskAnnotationsAPI";
import GetTaskDetailsAPI from "@/app/actions/api/Dashboard/getTaskDetails";
import { useParams } from "react-router-dom";
import { questions } from "./config";
import Tooltip from '@mui/material/Tooltip';

const ModelInteractionEvaluation = ({ currentInteraction, setCurrentInteraction, interactions, setInteractions, forms, setForms, stage }) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const { taskId } = useParams();
  const classes = ModelResponseEvaluationStyle();
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState([]);


  const toggleLeftPanel = () => {
    setLeftPanelVisible(!leftPanelVisible);
  };

  useEffect(() => {
    
    const fetchData = async () => {
      const taskAnnotationsObj = new GetTaskAnnotationsAPI(taskId);
      const response = await fetch(taskAnnotationsObj.apiEndPoint(), {
        method: "GET",
        headers: taskAnnotationsObj.getHeaders().headers,
      });
      const annotationForms = await response.json();
      let formsData = []
      console.log(annotationForms[0].result?.length);
      
      if(annotationForms && Array.isArray(annotationForms[0]?.result) && [...annotationForms[0]?.result]?.length){
        console.log(stage)
        if(stage ==="Review"){
          console.log("here in review if")
          let reviewData = annotationForms.find((item) => item.annotation_type === 2);
          if(reviewData.annotation_status === "unreviewed"){
            reviewData = annotationForms.find((item) => item.annotation_type === 1);
          }
          formsData = reviewData?.result;
          console.log("reviewdata: " + JSON.stringify(reviewData));
          console.log(formsData)
        }
      else if(stage === "SuperChecker"){
        console.log("here in sc if")
        let superCheckerData = annotationForms.filter((data)=>data.annotation_type==3)
        console.log(superCheckerData[0].annotation_status)
        if(superCheckerData[0].annotation_status === "unvalidated"){
          superCheckerData = annotationForms.find((item) => item.annotation_type == 2);
        }
        console.log("supercheckdata: " + JSON.stringify(superCheckerData));
        formsData = superCheckerData[0]?.result
        console.log(formsData)
      }else if(stage === "Annotation"){
        console.log("here in annotation if")
        let annotationData = annotationForms.filter((data)=>data.annotation_type==1)
        console.log("annotationdata: "+ JSON.stringify(annotationData));
        formsData = annotationData[0]?.result;
        console.log(formsData)
      }
      else{
        console.log("here in else")
      }
    }
    else if(annotationForms && Array.isArray(annotationForms[0]?.result) && [...annotationForms[0]?.result]?.length===0 && stage==="SuperChecker"){
      console.log("here in sc if")
        let superCheckerData = annotationForms.filter((data)=>data.annotation_type==3)
        console.log(superCheckerData[0].annotation_status)
        if(superCheckerData[0].annotation_status === "unvalidated"){
          superCheckerData = annotationForms.find((item) => item.annotation_type == 1);
        }
        console.log("supercheckdata: " + JSON.stringify(superCheckerData));
        formsData = superCheckerData?.result
        console.log(formsData)  
    }
      setForms(formsData?.length ? [...formsData] : [])
    };
    fetchData();
  }, [taskId]);

  const handleReset = () => {
    setCurrentInteraction((prev) => ({
      ...prev,
      rating: null,
      questions_response: Array(questions.length).fill(null),
    }));
  };
  
 

  useEffect(() => {
    const fetchData = async () => {
      const taskDetailsObj = new GetTaskDetailsAPI(taskId);
      const taskResponse = await fetch(taskDetailsObj.apiEndPoint(), {
        method: "GET",
        headers: taskDetailsObj.getHeaders().headers,
      });
      const taskData = await taskResponse.json();
      setInteractions(taskData ? [...taskData.data?.interactions_json] : []);
    };
    fetchData();
  }, [forms, taskId]);

  useEffect(() => {
    setSelectedQuestions(questions.slice(0, 3)); // Change this to your default questions
  }, []);
  // console.log(interactions[0]);
  useEffect(() => {
    if (forms.length > 0 && interactions.length > 0 && !currentInteraction?.prompt) {
      const defaultFormId = 1;
  
      const currentForm = forms.find(form => form.prompt_output_pair_id === defaultFormId);
      console.log("currentform: " + currentForm.rating);
      if (currentForm) {
        const selectedQuestionsFromResponse = currentForm.questions_response
          ? currentForm.questions_response.map((response) => response.question)
          : [];
  
        const newState = {
          prompt: currentForm?.prompt || "",
          output: typeof currentForm?.output === "string" ? currentForm?.output : currentForm?.output.map((item) => item.value).join(', ') || "",
          prompt_output_pair_id: currentForm.prompt_output_pair_id,
          rating: currentForm.rating || null,
          additional_note: currentForm.additional_note || "",
          questions_response: currentForm.questions_response || Array(questions.length).fill(null),
        };
        setCurrentInteraction(newState);
        setSelectedQuestions(selectedQuestionsFromResponse);
      }
    }
  }, [forms, interactions, currentInteraction, setCurrentInteraction]);
  
  useEffect(() => {
    if (forms.length === 0 && interactions.length > 0) {
      const initialForms = interactions.map((interaction) => ({
        prompt: interaction.prompt,
        output: interaction.output,
        prompt_output_pair_id: interaction.prompt_output_pair_id,
        rating: null,
        additional_note: null,
        questions_response: questions.slice(0, 3).map((question) => ({
          question,
          answer: null
        }))
      }));
      setForms(initialForms);
    }
  }, [forms, interactions]);
       
  
console.log(interactions);
const handleOptionChange = (selectedIndex, answer) => {
  setCurrentInteraction((prev) => {
    const newAnswers = selectedQuestions.map((question, i) => {
      if (selectedQuestions[selectedIndex] === question) {
        return { question, answer: answer || null };
      } else {
        return prev.questions_response?.find(response => response.question === question) || { question, answer: null };
      }
    });

    const updatedInteraction = {
      ...prev,
      questions_response: newAnswers,
    };

    // Update the forms array with the updatedInteraction
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.prompt_output_pair_id === prev.prompt_output_pair_id
          ? updatedInteraction
          : form
      )
    );

    return updatedInteraction;
  });
};

console.log(currentInteraction);
console.log(interactions);
console.log(forms);

const handleRating = (rating) => {
  setCurrentInteraction((prev) => {
    const updatedInteraction = {
      ...prev,
      rating: rating,
    };
    console.log("updatedinteraction: "+ updatedInteraction);
    // setInteractions((prevInteractions) =>
    //   prevInteractions.map((interaction) =>
    //     interaction.prompt_output_pair_id === prev.prompt_output_pair_id
    //       ? updatedInteraction
    //       : interaction
    //   )
    // );

    setForms((prevInteractions) =>
      prevInteractions.map((interaction) =>
        interaction.prompt_output_pair_id === prev.prompt_output_pair_id
          ? updatedInteraction
          : interaction
      )
    );


    return updatedInteraction;
  });
};

const handleNoteChange = (event) => {
  const newNote = event.target.value;
  setCurrentInteraction((prev) => {
    const updatedInteraction = {
      ...prev,
      additional_note: newNote,
    };

    // setInteractions((prevInteractions) =>
    //   prevInteractions.map((interaction) =>
    //     interaction.prompt_output_pair_id === prev.prompt_output_pair_id
    //       ? updatedInteraction
    //       : interaction
    //   )
    // );

    setForms((prevForms) =>
      prevForms.map((form) =>
        form.prompt_output_pair_id === prev.prompt_output_pair_id
          ? updatedInteraction
          : form
      )
    );

    return updatedInteraction;
  });
};

console.log(forms);
const handleFormBtnClick = (e) => {
  const clickedPromptOutputPairId = parseInt(e.target.id);
  const currInteraction = forms.find(
    (interaction) => interaction.prompt_output_pair_id === clickedPromptOutputPairId
  );
  if (currInteraction) {
    setCurrentInteraction({
      prompt: currInteraction.prompt,
      output: Array.isArray(currInteraction.output)
        ? currInteraction.output.map((item) => item.value).join(', ')
        : currInteraction.output,
      prompt_output_pair_id: currInteraction.prompt_output_pair_id,
      rating: currInteraction.rating || null,
      additional_note: currInteraction.additional_note || '',
      questions_response: currInteraction.questions_response || Array(questions.length).fill(null),
    });
    setSelectedQuestions(currInteraction.questions_response.map((response) => response.question));
  }
};


  const handleQuestionClick = (question) => {
    setSelectedQuestions((prevQuestions) => {
      if (prevQuestions.includes(question)) {
        return prevQuestions.filter((q) => q !== question);
      } else {
        return [...prevQuestions, question];
      }
    });
  };
  const EvaluationForm = () => {
    return (
      <div className={classes.rightPanel} >
        <div className={classes.promptContainer} style={{ overflowY: "auto" }}>
          <div className={classes.heading} style={{ fontSize: "20px" }}>
            {translate("modal.prompt")}
          </div>
          {currentInteraction.prompt}
        </div>
        <div className={classes.heading} style={{ fontSize: "20px" }}>
          {translate("modal.output")}
        </div>
        <div className={classes.outputContainer} style={{ maxHeight: "100px", overflowY: "auto" }}>
          {currentInteraction.output}
        </div>
        <div className={classes.ratingText}>
          {translate("model_evaluation_rating")}
        </div>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {Array.from({ length: 7 }, (_, index) => (
            <Button
              key={index + 1}
              className={`${classes.numBtn} ${currentInteraction.rating === index + 1 ? classes.selected : ""
                }`}
              label={index + 1}
              onClick={() => handleRating(index + 1)}
              style={{
                marginRight: "1rem",
                marginLeft: "0.9px",
                marginBottom: "2rem",
                borderRadius: "1rem",
                width: "47px",
                padding: "13px",
              }}
            />
          ))}
        </Box>
        <hr className={classes.hr} />
        {selectedQuestions.length > 0 ? <div className={classes.heading}>
          {translate("modal.select_que")}
        </div> : <div className={classes.heading}>
          {translate("modal.pls_select_que")}
        </div>}
        <div style={{
          overflowY: 'auto',
          maxHeight: "10rem"
        }}>
          {selectedQuestions.map((question, index) => (
            <div key={index} className={classes.questionContainer}>
              <div className={classes.questionText}>{question}</div>
              <div className={classes.radioGroupContainer}>
              <RadioGroup
      value={
        currentInteraction?.questions_response
          ? currentInteraction.questions_response[index]?.answer
          : null
      }
      onChange={(event) => handleOptionChange(index, event.target.value)}
    >
      <FormControlLabel
        value="Yes"
        control={<Radio className={classes.orangeRadio} />}
        label={<span className={classes.yesText}>Yes</span>}
      />
      <FormControlLabel
        value="No"
        control={<Radio className={classes.orangeRadio} />}
        label={<span className={classes.yesText}>No</span>}
      />         
    </RadioGroup>   
              </div>
            </div>            
          ))}
        </div>
        <hr className={classes.hr} />
        <div className={classes.notesContainer}>
          {translate("model_evaluation_note")}
        </div>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={3}
          defaultSize="50px"
          placeholder={translate("model_evaluation_notes_placeholder")}
          value={
            currentInteraction.additional_note
              ? currentInteraction.additional_note
              : null
          }
          style={{ minHeight: "50px", maxHeight: "10rem", height: "50px" }}
          onChange={handleNoteChange}
          className={classes.notesTextarea}
        />
      </div>
    );
  };

  const PairAccordion = ({ pairs, classes }) => {
    const [expanded, setExpanded] = useState(Array(pairs.length).fill(false));

    const handleAccordionChange = (index) => (event, isExpanded) => {
      setExpanded((prevExpanded) => {
        const newExpanded = [...prevExpanded];
        newExpanded[index] = isExpanded;
        return newExpanded;
      });
    };

    return (
      <div>
        {pairs.map((pair, index) => {
          return (
            <Accordion
              key={index}
              expanded={expanded[index]}
              onChange={handleAccordionChange(index)}
              className={classes.accordion}
              style={{
                borderRadius: expanded[index] ? "1rem" : "1rem",
                boxShadow: expanded[index]
                  ? "0px 4px 6px rgba(0, 0, 0, 0.1)"
                  : "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderBottom: "none",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}a-content`}
                id={`panel${index}a-header`}
                classes={{
                  content: "MuiAccordionSummary-content",
                  expanded: "Mui-expanded",
                }}
              >

<Box
  sx={{
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: expanded[index] ? "normal" : "nowrap",
    maxWidth: "200px",
    maxHeight: "3rem",
    position: "relative",
  }}
  className={classes.promptTile}
>
  {pair.prompt}
  {expanded[index] && (
    <Tooltip title={pair.prompt} placement="bottom">
    <span style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", cursor: "pointer" }}>
      {pair.text}
    </span>
  </Tooltip>
  )}
</Box>
              </AccordionSummary>
              <AccordionDetails style={{ display: "block", cursor: "pointer" }}>
                {/* <Box
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: expanded[index] ? "wrap": "nowrap",
                    maxWidth: "200px",
                    maxHeight: "3rem",
                  }}
                  className={classes.answerTile}
                >
                  {typeof(pair.output)==="string"?pair?.output:pair?.output[0]?.value}
                </Box> */}
                <Box sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap',justifyContent: 'flex-start', marginTop: '1rem'}}>
                    <Button
                      label={translate("model_evaluation_btn")}
                      buttonVariant={"outlined"}
                      style={{
                        marginTop: "1rem",
                        padding:"0.5rem"
                      }}
                      onClick={handleFormBtnClick}
                      id={pair.prompt_output_pair_id}
                    />
                    <Button
                      label="reset"
                      buttonVariant={"outlined"}
                      style={{
                        marginTop: "1rem",
                        marginLeft: "1.5rem",
                      }}
                      onClick={handleReset}
                    />
                    </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    );
  };

  const QuestionList = ({ questions }) => {
    return (
      <div style={{ height: "25rem", overflowY: "scroll", margin: "1.5rem 1.5rem 2rem 1.5rem" }}>
        <div className={classes.questionList}>
          {questions.map((question, index) => (
            <Box
              key={index}
              sx={{
                padding: "10px",
                margin: "5px 0",
                backgroundColor: selectedQuestions.includes(question) ? "#d3d3d3" : "#fff",
                cursor: "pointer",
              }}
              onClick={() => handleQuestionClick(question)}
            >
              {question}
            </Box>
          ))}
        </div>
      </div>
    );
  };

  const InteractionDisplay = () => {
    return (
      <Resizable
        defaultSize={{
          width: "30%",
          height: "100%",
        }}
        minWidth={"20%"}
        // maxWidth={"70%"}
        enable={{ right: true, top: false, bottom: false, left: false }}
      >
        <div className={classes.heading} style={{ margin: "2rem 0 0.5rem 1.5rem", fontSize: "20px" }}>
          {translate("modal.interact")}
        </div>
        <Paper className={classes.interactionWindow} style={{ border: "none", backgroundColor: '#f0f0f0' }}>
          {interactions && (
            <PairAccordion pairs={interactions} classes={classes} />
          )}
        </Paper>
        <div className={classes.heading} style={{ margin: "1.5rem 0 0.5rem 1.5rem", fontSize: "20px" }}>
          {translate("modal.quelist")}
        </div>
        <QuestionList questions={questions} />
      </Resizable>
    );
  };

  return (
    <>
      <div className={classes.container} style={{width: "2300px"}}>
        <IconButton onClick={toggleLeftPanel}>
          <ExpandMoreIcon />
        </IconButton>
        {leftPanelVisible && <InteractionDisplay />}
        <Divider orientation="vertical" flexItem />
        {EvaluationForm()}
      </div>
    </>
  );
};

export default ModelInteractionEvaluation;
