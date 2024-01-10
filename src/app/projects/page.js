'use client'
import  { React,useEffect, useState } from "react";
import { Radio, Box, Grid, Typography, ThemeProvider } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import ProjectCardList from "../../components/Project/ProjectCardList";
import ProjectCard from "../../components/Project/ProjectCard";
import Spinner from "../../components/common/Spinner";
import Search from "../../components/common/Search";
import  "../../styles/Dataset.css";
import themeDefault from "../../themes/theme";
import tableTheme from "../../themes/tableTheme";

export default function ProjectList() {
  const [radiobutton, setRadiobutton] = useState(true);
  
//   const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setsSelectedFilters] = useState({
    project_type: "",
    project_user_type: "",
    archived_projects: "",
  });

  const handleProjectlist = () => {
    setRadiobutton(true);
  };
  const handleProjectcard = () => {
    setRadiobutton(false);
  };


const projectData = [
  {
      "id": 2279,
      "title": "test ocr ce 2",
      "description": "test",
      "created_by": null,
      "is_archived": false,
      "is_published": true,
      "workspace_id": 1,
      "organization_id": 1,
      "filter_string": null,
      "sampling_mode": "f",
      "sampling_parameters_json": {},
      "project_type": "OCRSegmentCategorizationEditing",
      "dataset_id": [
          295
      ],
      "label_config": "<View>\n  <Image name=\"image_url\" value=\"$image_url\"/>\n  \n  <Labels name=\"annotation_labels\" toName=\"image_url\" className=\"ignore_assertion\">\n    \n    <Label value=\"title\" background=\"green\" name=\"title\" className=\"ignore_assertion\"/>\n    <Label value=\"text\" background=\"blue\" name=\"text\" className=\"ignore_assertion\"/>\n    <Label value=\"image\" background=\"red\" name=\"image\" className=\"ignore_assertion\"/>\n    <Label value=\"unord-list\" background=\"yellow\" name=\"unord-list\" className=\"ignore_assertion\"/>\n    <Label value=\"ord-list\" background=\"black\" name=\"ord-list\" className=\"ignore_assertion\"/>\n    <Label value=\"placeholder\" background=\"orange\" name=\"placeholder\" className=\"ignore_assertion\"/>\n    <Label value=\"table\" background=\"violet\" name=\"table\" className=\"ignore_assertion\"/>\n    <Label value=\"dateline\" background=\"cyan\" name=\"dateline\" className=\"ignore_assertion\"/>\n    <Label value=\"byline\" background=\"brown\" name=\"byline\" className=\"ignore_assertion\"/>\n    <Label value=\"page-number\" background=\"purple\" name=\"page-number\" className=\"ignore_assertion\"/>\n    <Label value=\"footer\" background=\"indigo\" name=\"footer\" className=\"ignore_assertion\"/>\n    <Label value=\"footnote\" background=\"pink\" name=\"footnote\" className=\"ignore_assertion\"/>\n    <Label value=\"header\" background=\"olive\" name=\"header\" className=\"ignore_assertion\"/>\n    <Label value=\"social-media-handle\" background=\"aqua\" name=\"social-media-handle\" className=\"ignore_assertion\"/>\n    <Label value=\"website-link\" background=\"teal\" name=\"website-link\" className=\"ignore_assertion\"/>\n    <Label value=\"caption\" background=\"maroon\" name=\"caption\" className=\"ignore_assertion\"/>\n    <Label value=\"table-header\" background=\"aquamarine\" name=\"table-header\" className=\"ignore_assertion\"/>\n    \n  </Labels>\n\n  <Rectangle name=\"annotation_bboxes\" toName=\"image_url\" strokeWidth=\"3\" className=\"ignore_assertion\"/>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"title\" name=\"title_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"h1\" className=\"ignore_assertion\"/>\n    <Choice value=\"h2\" className=\"ignore_assertion\"/>\n    <Choice value=\"h3\" className=\"ignore_assertion\"/>\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"text\" name=\"text_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"paragraph\" className=\"ignore_assertion\"/>\n    <Choice value=\"foreign-language-text\" className=\"ignore_assertion\"/>\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"image\" name=\"image_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"img\" className=\"ignore_assertion\"/>\n    <Choice value=\"logo\" className=\"ignore_assertion\"/>\n    <Choice value=\"formula\" className=\"ignore_assertion\"/>\n    <Choice value=\"equation\" className=\"ignore_assertion\"/>\n    <Choice value=\"bg-img\" className=\"ignore_assertion\"/>\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"placeholder\" name=\"placeholder_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"placeholder-txt\" className=\"ignore_assertion\"/>\n    <Choice value=\"placeholder-img\" className=\"ignore_assertion\"/>\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"caption\" name=\"caption_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"fig-caption\" className=\"ignore_assertion\"/>\n    <Choice value=\"table-caption\" className=\"ignore_assertion\"/>\n  </Choices>\n    \n</View>\n\n\n",
      "variable_parameters": {},
      "project_mode": "Annotation",
      "required_annotators_per_task": 1,
      "tasks_pull_count_per_batch": 10,
      "max_pending_tasks_per_user": 60,
      "src_language": null,
      "tgt_language": null,
      "created_at": "2023-12-06T06:37:58.364413Z",
      "project_stage": 1
  },
  {
      "id": 2278,
      "title": "testocrce",
      "description": "test",
      "created_by": null,
      "is_archived": false,
      "is_published": true,
      "workspace_id": 1,
      "organization_id": 1,
      "filter_string": null,
      "sampling_mode": "f",
      "sampling_parameters_json": {},
      "project_type": "OCRSegmentCategorizationEditing",
      "dataset_id": [
          295
      ],
      "label_config": "<View>\n  <Image name=\"image_url\" value=\"$image_url\"/>\n  \n  <Labels name=\"annotation_labels\" toName=\"image_url\" className=\"ignore_assertion\">\n    \n    <Label value=\"title\" background=\"green\" name=\"title\" className=\"ignore_assertion\"/>\n    <Label value=\"text\" background=\"blue\" name=\"text\" className=\"ignore_assertion\"/>\n    <Label value=\"image\" background=\"red\" name=\"image\" className=\"ignore_assertion\"/>\n    <Label value=\"unord-list\" background=\"yellow\" name=\"unord-list\" className=\"ignore_assertion\"/>\n    <Label value=\"ord-list\" background=\"black\" name=\"ord-list\" className=\"ignore_assertion\"/>\n    <Label value=\"placeholder\" background=\"orange\" name=\"placeholder\" className=\"ignore_assertion\"/>\n    <Label value=\"table\" background=\"violet\" name=\"table\" className=\"ignore_assertion\"/>\n    <Label value=\"dateline\" background=\"cyan\" name=\"dateline\" className=\"ignore_assertion\"/>\n    <Label value=\"byline\" background=\"brown\" name=\"byline\" className=\"ignore_assertion\"/>\n    <Label value=\"page-number\" background=\"purple\" name=\"page-number\" className=\"ignore_assertion\"/>\n    <Label value=\"footer\" background=\"indigo\" name=\"footer\" className=\"ignore_assertion\"/>\n    <Label value=\"footnote\" background=\"pink\" name=\"footnote\" className=\"ignore_assertion\"/>\n    <Label value=\"header\" background=\"olive\" name=\"header\" className=\"ignore_assertion\"/>\n    <Label value=\"social-media-handle\" background=\"aqua\" name=\"social-media-handle\" className=\"ignore_assertion\"/>\n    <Label value=\"website-link\" background=\"teal\" name=\"website-link\" className=\"ignore_assertion\"/>\n    <Label value=\"caption\" background=\"maroon\" name=\"caption\" className=\"ignore_assertion\"/>\n    <Label value=\"table-header\" background=\"aquamarine\" name=\"table-header\" className=\"ignore_assertion\"/>\n    \n  </Labels>\n\n  <Rectangle name=\"annotation_bboxes\" toName=\"image_url\" strokeWidth=\"3\" className=\"ignore_assertion\"/>\n  \n  <Choices visibleWhen=\"region-selected\" whenTagName=\"annotation_labels\" whenLabelValue=\"title\" name=\"title_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"h1\" />\n    <Choice value=\"h2\" />\n    <Choice value=\"h3\" />\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" whenTagName=\"annotation_labels\" whenLabelValue=\"text\" name=\"text_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"paragraph\" />\n    <Choice value=\"foreign-language-text\" />\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" whenTagName=\"annotation_labels\" whenLabelValue=\"image\" name=\"image_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"img\" />\n    <Choice value=\"logo\" />\n    <Choice value=\"formula\" />\n    <Choice value=\"equation\" />\n    <Choice value=\"bg-img\" />\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" whenTagName=\"annotation_labels\" whenLabelValue=\"placeholder\" name=\"placeholder_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"placeholder-txt\" />\n    <Choice value=\"placeholder-img\" />\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" whenTagName=\"annotation_labels\" whenLabelValue=\"caption\" name=\"caption_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"fig-caption\" />\n    <Choice value=\"table-caption\" />\n  </Choices>\n    \n</View>\n\n\n",
      "variable_parameters": {},
      "project_mode": "Annotation",
      "required_annotators_per_task": 1,
      "tasks_pull_count_per_batch": 10,
      "max_pending_tasks_per_user": 60,
      "src_language": null,
      "tgt_language": null,
      "created_at": "2023-12-06T06:14:27.448929Z",
      "project_stage": 1
  },
  {
      "id": 2273,
      "title": "test deallocate",
      "description": "test",
      "created_by": null,
      "is_archived": false,
      "is_published": true,
      "workspace_id": 63,
      "organization_id": 1,
      "filter_string": null,
      "sampling_mode": "f",
      "sampling_parameters_json": {},
      "project_type": "OCRTranscriptionEditing",
      "dataset_id": [
          295
      ],
      "label_config": "<View>\n  <Style>.ant-input { font-size: large; }</Style>\n  <Image name=\"image_url\" value=\"$image_url\"/>\n\n  <Labels name=\"annotation_labels\" toName=\"image_url\" className=\"ignore_assertion\">\n    <Label value=\"Header\" background=\"green\"/>\n    <Label value=\"Body\" background=\"blue\"/>\n    <Label value=\"Footer\" background=\"orange\"/>\n  </Labels>\n\n  <Rectangle name=\"annotation_bboxes\" toName=\"image_url\" strokeWidth=\"3\" className=\"ignore_assertion\"/>\n\n  <TextArea name=\"ocr_transcribed_json\" toName=\"image_url\"\n            editable=\"true\"\n            perRegion=\"true\"\n            required=\"true\"\n            maxSubmissions=\"1\"\n            rows=\"5\"\n            placeholder=\"Recognized Text\"\n            />\n</View>\n",
      "variable_parameters": {},
      "project_mode": "Annotation",
      "required_annotators_per_task": 1,
      "tasks_pull_count_per_batch": 10,
      "max_pending_tasks_per_user": 60,
      "src_language": null,
      "tgt_language": null,
      "created_at": "2023-12-05T05:29:54.172185Z",
      "project_stage": 1
  },
  {
      "id": 2265,
      "title": "notif",
      "description": "notif test",
      "created_by": {
          "id": 2554,
          "username": "mustafa",
          "email": "mustafaasad198@gmail.com",
          "languages": [],
          "availability_status": 1,
          "enable_mail": false,
          "first_name": "",
          "last_name": "",
          "phone": "",
          "profile_photo": "",
          "role": 1,
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
          "unverified_email": "",
          "date_joined": "2023-09-20T08:24:47Z",
          "participation_type": 1,
          "prefer_cl_ui": false,
          "is_active": true
      },
      "is_archived": false,
      "is_published": false,
      "workspace_id": 1,
      "organization_id": 1,
      "filter_string": null,
      "sampling_mode": "f",
      "sampling_parameters_json": null,
      "project_type": "MonolingualTranslation",
      "dataset_id": [],
      "label_config": "",
      "variable_parameters": null,
      "project_mode": "Annotation",
      "required_annotators_per_task": 1,
      "tasks_pull_count_per_batch": 10,
      "max_pending_tasks_per_user": 60,
      "src_language": null,
      "tgt_language": null,
      "created_at": "2023-10-25T13:06:15.149521Z",
      "project_stage": 1
  },
  {
      "id": 2272,
      "title": "test_ast",
      "description": "testing",
      "created_by": null,
      "is_archived": false,
      "is_published": true,
      "workspace_id": 1,
      "organization_id": 1,
      "filter_string": null,
      "sampling_mode": "f",
      "sampling_parameters_json": {},
      "project_type": "ContextualTranslationEditing",
      "dataset_id": [
          54
      ],
      "label_config": "<View>\n  <Style>.ant-input { font-size: large; }</Style>\n  <View style=\"font-size: large; display: grid; grid-template: auto/1fr 1fr 1fr; column-gap: 1em\">\n    <Header size=\"3\" value=\"Source sentence\"/>\n    <Header size=\"3\" value=\"$output_language translation\"/>\n    <Header size=\"3\" value=\"Machine translation\"/>\n    <Text name=\"input_text\" value=\"$input_text\"/>\n    <TextArea name=\"output_text\" toName=\"input_text\" value=\"$machine_translation\" rows=\"5\" transcription=\"true\" showSubmitButton=\"true\" maxSubmissions=\"1\" editable=\"false\" required=\"true\"/>\n    <Text name=\"machine_translation\" value=\"$machine_translation\"/>\n  </View>\n  <View style=\"font-size: large; display: grid; grid-template: auto; column-gap: 1em\">\n    <Header size=\"3\" value=\"Context\"/>\n    <Text name=\"context\" value=\"$context\"/>\n  </View>\n</View>\n",
      "variable_parameters": {},
      "project_mode": "Annotation",
      "required_annotators_per_task": 1,
      "tasks_pull_count_per_batch": 10,
      "max_pending_tasks_per_user": 60,
      "src_language": "English",
      "tgt_language": "Bengali",
      "created_at": "2023-11-09T07:40:45.201984Z",
      "project_stage": 1
  }]


  return (
    <ThemeProvider theme={themeDefault}>
      {/* {loading && <Spinner />} */}

      {/* <Grid container direction="row" columnSpacing={3} rowSpacing={2} sx={{ position: "static", bottom: "-51px", left: "20px" }} > */}
      <Grid container className="root">
        <Grid item style={{ flexGrow: "0" }}>
          <Typography variant="h6" sx={{ paddingBottom: "7px" }}>
            View :{" "}
          </Typography>
        </Grid>
        <Grid item style={{ flexGrow: "1", paddingLeft: "5px" }}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue="ProjectList"
            >
              <FormControlLabel
                value="ProjectList"
                control={<Radio />}
                label="List"
                onClick={handleProjectlist}
              />
              <FormControlLabel
                value="ProjectCard"
                control={<Radio />}
                label="Card"
                onClick={handleProjectcard}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid xs={3} item className="fixedWidthContainer">
          <Search />
        </Grid>
      </Grid>

      <Box>
        <Box sx={{ marginTop: "20px" }}>
          {radiobutton ? (
            <ProjectCardList
              projectData={projectData}
              selectedFilters={selectedFilters} 
              setsSelectedFilters={setsSelectedFilters} 
            />
          ) : (
            <ProjectCard 
            projectData={projectData}
             selectedFilters={selectedFilters} 
            setsSelectedFilters={setsSelectedFilters}
              />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
