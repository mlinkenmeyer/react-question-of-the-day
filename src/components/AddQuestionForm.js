import React from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import {
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

const TextField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={props.id || props.name}>{label}</InputLabel>
      <textarea className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div
          className={`error ${
            meta.error === "Required" ? "required-error" : ""
          }`}
        >
          {meta.error}
        </div>
      ) : null}
    </FormControl>
  );
};

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={props.id || props.name}>{label}</InputLabel>
      <select {...field} {...props}>
        {props.children}
      </select>
      {meta.touched && meta.error ? (
        <div
          className={`error ${
            meta.error === "Required" ? "required-error" : ""
          }`}
        >
          {meta.error}
        </div>
      ) : null}
    </FormControl>
  );
};

const AddQuestionForm = ({ handleNewQuestion }) => {
  const handleSubmit = (values) => {
    const newQuestion = {
      text: values.newQuestion,
      category: values.category,
    };

    fetch("http://localhost:3000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((r) => r.json())
      .then((questions) => {
        handleNewQuestion(questions);
      });
  };

  return (
    <Grid container justifyContent="center" className="AddQuestionForm">
      <Grid item xs={12} sm={8} md={6}>
        <Box p={3}>
          <Typography variant="h4" align="center">
            Add a new Question
          </Typography>
          <Formik
            initialValues={{
              newQuestion: "",
              category: "",
            }}
            validationSchema={Yup.object({
              newQuestion: Yup.string()
                .max(150, "Must be 150 characters or less")
                .required("Required"),
              category: Yup.string()
                .oneOf(
                  ["recreation", "family & friends", "work", "miscellaneous"],
                  "Invalid Job Type"
                )
                .required("Required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              handleSubmit(values);
              setSubmitting(false);
              resetForm();
            }}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="filled"
                    name="newQuestion"
                    type="text"
                    placeholder="Type your question here..."
                    className="question-input"
                    style={{ marginTop: "10px" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MySelect name="category" className="category-input">
                    <option value="select-category">Select a Category</option>
                    <option value="recreation">Recreation</option>
                    <option value="family & friends">Family & Friends</option>
                    <option value="work">Work</option>
                    <option value="miscellaneous">Miscellaneous</option>
                  </MySelect>
                </Grid>
              </Grid>
              <Button
                className="new-question-button"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "20px" }}
              >
                Submit
              </Button>
            </Form>
          </Formik>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AddQuestionForm;
