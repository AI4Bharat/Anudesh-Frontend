const UserRolesList = {
  1: "Annotator",
  2: "Reviewer",
  3: "SuperChecker",
  4: "WorkspaceManager",
  5: "OrganizationOwner",
  6: "Admin",
};
export default UserRolesList[
  /* eslint-disable react-hooks/exhaustive-deps */
  ({
    question_type: "fill_in_blanks",
    input_question: "This model output contains <blank> grammatical errors.",
  },
  {
    question_type: "rating",
    input_question:
      "Rate this sentence on a scale of 1 to 10 based on grammatical errors, 1 being lowest and 5 being highest rating.",
    rating_scale_list: [1, 2, 3, 4, 5],
  },
  {
    question_type: "multi_select_options",
    input_question:
      "Which of the following improvements might make the model's output better?",
    input_selections_list: [
      "Answer by the model should be more factual and contain a detailed information.",
      "The answer could have been rephrased to make it more presentable.",
      "Avoiding silly mistakes would do wonders to this answer",
      "None of the above.",
    ],
  },
  {
    question_type: "mcq",
    input_question:
      "Is the answer given by the model satisfactory on the basis of data collection guidelines shared by your team lead?",
    input_selections_list: [
      "Yes, it can be accepted without any changes.",
      "Yes, but need minor improvements.",
      "No, there are some major improvements required.",
      "No, the model is completely hallucinating",
    ],
  })
];
